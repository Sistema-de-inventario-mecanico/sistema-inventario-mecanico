from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Usuario, Material, Solicitud, MovimientoStock, CategoriaMaterial, EstadoSolicitud, EstadoDevolucion, TipoMovimiento
from .serializers import UsuarioSerializer, MaterialSerializer, SolicitudSerializer, MovimientoStockSerializer

class IsAdminUserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        # Allow users with the custom ADMIN role OR Django staff/superusers
        user_rol = getattr(request.user, 'rol', None)
        return user_rol == 'ADMIN' or request.user.is_staff or request.user.is_superuser

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Only admin can create or modify users
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminUserOrReadOnly()]
        return super().get_permissions()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Returns the profile of the currently logged-in user."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.filter(is_active=True)
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'ajustar_stock']:
            return [permissions.IsAuthenticated(), IsAdminUserOrReadOnly()]
        return super().get_permissions()

    def destroy(self, request, *args, **kwargs):
        material = self.get_object()
        material.is_active = False
        material.save()
        
        # Cancel pending requests for this material
        pending_requests = Solicitud.objects.filter(material=material, estado=EstadoSolicitud.PENDIENTE)
        for req in pending_requests:
            req.estado = EstadoSolicitud.RECHAZADA
            req.fecha_aprobacion = timezone.now()
            req.encargado_area = request.user
            req.save()
            
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def ajustar_stock(self, request, pk=None):
        """Register a manual stock movement (INGRESO or EGRESO) and update material stock."""
        material = self.get_object()
        tipo = request.data.get('tipo')
        cantidad = int(request.data.get('cantidad', 0))
        notas = request.data.get('notas', '')

        if tipo not in ['INGRESO', 'EGRESO']:
            return Response({'error': 'tipo debe ser INGRESO o EGRESO'}, status=status.HTTP_400_BAD_REQUEST)

        if cantidad <= 0:
            return Response({'error': 'cantidad debe ser mayor a 0'}, status=status.HTTP_400_BAD_REQUEST)

        if tipo == 'EGRESO' and material.stock_actual < cantidad:
            return Response({'error': 'Stock insuficiente para el egreso'}, status=status.HTTP_400_BAD_REQUEST)

        # Update stock
        if tipo == 'INGRESO':
            material.stock_actual += cantidad
        else:
            material.stock_actual -= cantidad
        material.save()

        # Register movement in history
        MovimientoStock.objects.create(
            material=material,
            usuario=request.user,
            tipo=tipo,
            cantidad=cantidad,
            notas=notas
        )

        return Response({'status': f'{tipo} registrado', 'nuevo_stock': material.stock_actual})

class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(empleado=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def aprobar(self, request, pk=None):
        solicitud = self.get_object()
        if request.user.rol not in ['ADMIN', 'ENCARGADO_AREA']:
            return Response({'error': 'No auth'}, status=status.HTTP_403_FORBIDDEN)
        
        solicitud.estado = EstadoSolicitud.APROBADA
        solicitud.fecha_aprobacion = timezone.now()
        solicitud.encargado_area = request.user
        solicitud.save()
        return Response({'status': 'Aprobada'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def rechazar(self, request, pk=None):
        solicitud = self.get_object()
        if request.user.rol not in ['ADMIN', 'ENCARGADO_AREA']:
            return Response({'error': 'No auth'}, status=status.HTTP_403_FORBIDDEN)
        
        solicitud.estado = EstadoSolicitud.RECHAZADA
        solicitud.fecha_aprobacion = timezone.now()
        solicitud.encargado_area = request.user
        solicitud.save()
        return Response({'status': 'Rechazada'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def entregar(self, request, pk=None):
        solicitud = self.get_object()
        if request.user.rol not in ['ADMIN', 'ENCARGADO_OFICINA']:
            return Response({'error': 'No auth'}, status=status.HTTP_403_FORBIDDEN)
        
        if solicitud.estado != 'APROBADA':
            return Response({'error': 'No está aprobada'}, status=status.HTTP_400_BAD_REQUEST)

        # Restar stock
        material = solicitud.material
        if material.stock_actual < solicitud.cantidad:
            return Response({'error': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)

        material.stock_actual -= solicitud.cantidad
        material.save()

        # Registrar movimiento de egreso
        MovimientoStock.objects.create(
            material=material,
            usuario=request.user,
            tipo='EGRESO',
            cantidad=solicitud.cantidad,
            notas=f"Entrega de solicitud {solicitud.id}"
        )

        solicitud.estado = EstadoSolicitud.ENTREGADA
        solicitud.fecha_entrega = timezone.now()
        solicitud.encargado_oficina = request.user
        solicitud.save()

        return Response({'status': 'Entregada'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def devolver(self, request, pk=None):
        solicitud = self.get_object()
        if request.user.rol not in ['ADMIN', 'ENCARGADO_OFICINA']:
            return Response({'error': 'No auth'}, status=status.HTTP_403_FORBIDDEN)

        if solicitud.estado != 'ENTREGADA':
            return Response({'error': 'No ha sido entregada'}, status=status.HTTP_400_BAD_REQUEST)
        
        if solicitud.material.categoria != 'HERRAMIENTA':
            return Response({'error': 'Este material no requiere devolución'}, status=status.HTTP_400_BAD_REQUEST)

        estado_dev = request.data.get('estado_devolucion', EstadoDevolucion.BUENO)
        motivo = request.data.get('motivo_devolucion', '')

        # Regresar al stock
        material = solicitud.material
        material.stock_actual += solicitud.cantidad
        material.save()

        # Registrar ingreso
        MovimientoStock.objects.create(
            material=material,
            usuario=request.user,
            tipo='INGRESO',
            cantidad=solicitud.cantidad,
            notas=f"Devolución de solicitud {solicitud.id}. Estado: {estado_dev}. {motivo}"
        )

        solicitud.estado = EstadoSolicitud.DEVUELTA
        solicitud.fecha_devolucion = timezone.now()
        solicitud.estado_devolucion = estado_dev
        solicitud.motivo_devolucion = motivo
        solicitud.save()

        return Response({'status': 'Devuelta al inventario'})

class MovimientoStockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MovimientoStock.objects.all().order_by('-fecha')
    serializer_class = MovimientoStockSerializer
    permission_classes = [permissions.IsAuthenticated]
