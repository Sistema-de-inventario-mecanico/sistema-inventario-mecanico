from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import (
    Usuario, Material, Solicitud, MovimientoStock, Compra, HistorialProductoMalo,
    CategoriaMaterial, EstadoSolicitud, EstadoDevolucion, TipoMovimiento, EstadoCompra
)
from .serializers import (
    UsuarioSerializer, MaterialSerializer, SolicitudSerializer,
    MovimientoStockSerializer, CompraSerializer, HistorialProductoMaloSerializer
)

class IsAdminUserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        user_rol = getattr(request.user, 'rol', None)
        return user_rol == 'ADMIN' or request.user.is_staff or request.user.is_superuser

class IsAdminOrOficina(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        user_rol = getattr(request.user, 'rol', None)
        return user_rol in ['ADMIN', 'ENCARGADO_OFICINA'] or request.user.is_staff or request.user.is_superuser

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminUserOrReadOnly()]
        return super().get_permissions()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
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
        
        # Cancel all active solicitudes for this material
        active_requests = Solicitud.objects.filter(
            material=material, 
            estado__in=[EstadoSolicitud.PENDIENTE, EstadoSolicitud.APROBADA, EstadoSolicitud.ENTREGADA]
        )
        for req in active_requests:
            req.estado = EstadoSolicitud.CANCELADA
            req.fecha_cancelacion = timezone.now()
            req.save()
            
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def ajustar_stock(self, request, pk=None):
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

        if tipo == 'INGRESO':
            material.stock_actual += cantidad
        else:
            material.stock_actual -= cantidad
        material.save()

        MovimientoStock.objects.create(
            material=material, usuario=request.user,
            tipo=tipo, cantidad=cantidad, notas=notas
        )
        return Response({'status': f'{tipo} registrado', 'nuevo_stock': material.stock_actual})

class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all().order_by('-fecha_solicitud')
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
    def cancelar(self, request, pk=None):
        """Employee cancels their own PENDING request."""
        solicitud = self.get_object()
        if solicitud.empleado != request.user:
            return Response({'error': 'Solo puedes cancelar tus propias solicitudes'}, status=status.HTTP_403_FORBIDDEN)
        if solicitud.estado != EstadoSolicitud.PENDIENTE:
            return Response({'error': 'Solo se pueden cancelar solicitudes en estado PENDIENTE'}, status=status.HTTP_400_BAD_REQUEST)
        solicitud.estado = EstadoSolicitud.CANCELADA
        solicitud.fecha_cancelacion = timezone.now()
        solicitud.save()
        return Response({'status': 'Cancelada'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def avisar_devolucion(self, request, pk=None):
        """Employee notifies they will return leftover consumables."""
        solicitud = self.get_object()
        if solicitud.empleado != request.user:
            return Response({'error': 'No auth'}, status=status.HTTP_403_FORBIDDEN)
        if solicitud.estado != EstadoSolicitud.ENTREGADA:
            return Response({'error': 'La solicitud debe estar en estado ENTREGADA'}, status=status.HTTP_400_BAD_REQUEST)
        if solicitud.material.categoria not in [CategoriaMaterial.CONSUMIBLE, CategoriaMaterial.UNIDAD]:
            return Response({'error': 'Solo aplica para consumibles y materiales por unidad'}, status=status.HTTP_400_BAD_REQUEST)

        cantidad = request.data.get('cantidad_aviso')
        if not cantidad:
            return Response({'error': 'Indica la cantidad a devolver'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cantidad_int = int(cantidad)
        except:
            return Response({'error': 'Cantidad inválida'}, status=status.HTTP_400_BAD_REQUEST)

        if cantidad_int <= 0:
            return Response({'error': 'La cantidad debe ser mayor a 0'}, status=status.HTTP_400_BAD_REQUEST)
        if cantidad_int > solicitud.cantidad:
            return Response({'error': 'La cantidad no puede ser mayor a la solicitada'}, status=status.HTTP_400_BAD_REQUEST)

        solicitud.aviso_devolucion = True
        solicitud.cantidad_aviso_devolucion = cantidad_int
        solicitud.fecha_aviso_devolucion = timezone.now()
        solicitud.save()
        return Response({'status': 'Aviso de devolución registrado'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def entregar(self, request, pk=None):
        solicitud = self.get_object()
        if request.user.rol not in ['ADMIN', 'ENCARGADO_OFICINA']:
            return Response({'error': 'No auth'}, status=status.HTTP_403_FORBIDDEN)
        
        if solicitud.estado != 'APROBADA':
            return Response({'error': 'No está aprobada'}, status=status.HTTP_400_BAD_REQUEST)

        material = solicitud.material
        if material.stock_actual < solicitud.cantidad:
            return Response({'error': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)

        material.stock_actual -= solicitud.cantidad
        material.save()

        MovimientoStock.objects.create(
            material=material, usuario=request.user,
            tipo='EGRESO', cantidad=solicitud.cantidad,
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

        material = solicitud.material
        categoria = material.categoria
        motivo = request.data.get('motivo_devolucion', '')

        if categoria == CategoriaMaterial.HERRAMIENTA:
            estado_dev = request.data.get('estado_devolucion', EstadoDevolucion.BUENO)
            solicitud.estado_devolucion = estado_dev
            solicitud.motivo_devolucion = motivo
            solicitud.cantidad_devuelta = solicitud.cantidad
            solicitud.cantidad_buena_devuelta = solicitud.cantidad if estado_dev == EstadoDevolucion.BUENO else 0
            solicitud.cantidad_mala_devuelta = solicitud.cantidad if estado_dev == EstadoDevolucion.MALO else 0
            
            if estado_dev != EstadoDevolucion.MALO:
                material.stock_actual += solicitud.cantidad
            else:
                HistorialProductoMalo.objects.create(
                    material=material, material_nombre=material.nombre, material_categoria=material.categoria,
                    solicitud=solicitud, cantidad=solicitud.cantidad, comentario=motivo or "Herramienta defectuosa",
                    reportado_por=request.user
                )

        elif categoria == CategoriaMaterial.CONSUMIBLE:
            try:
                cant_dev = int(request.data.get('cantidad_devuelta', 0))
            except:
                return Response({'error': 'Cantidad inválida'}, status=status.HTTP_400_BAD_REQUEST)

            if cant_dev > solicitud.cantidad_aviso_devolucion:
                return Response({'error': f'No puede recibir más de lo reportado por el empleado ({solicitud.cantidad_aviso_devolucion})'}, status=status.HTTP_400_BAD_REQUEST)
            
            solicitud.cantidad_devuelta = cant_dev
            solicitud.cantidad_buena_devuelta = cant_dev
            solicitud.cantidad_mala_devuelta = 0
            material.stock_actual += cant_dev

        elif categoria == CategoriaMaterial.UNIDAD:
            try:
                buena = int(request.data.get('cantidad_buena_devuelta', 0))
                mala = int(request.data.get('cantidad_mala_devuelta', 0))
            except:
                return Response({'error': 'Cantidades inválidas'}, status=status.HTTP_400_BAD_REQUEST)

            if (buena + mala) > solicitud.cantidad_aviso_devolucion:
                return Response({'error': f'El total no puede superar lo reportado por el empleado ({solicitud.cantidad_aviso_devolucion})'}, status=status.HTTP_400_BAD_REQUEST)

            solicitud.cantidad_devuelta = buena + mala
            solicitud.cantidad_buena_devuelta = buena
            solicitud.cantidad_mala_devuelta = mala
            material.stock_actual += buena

            if mala > 0:
                HistorialProductoMalo.objects.create(
                    material=material, material_nombre=material.nombre, material_categoria=material.categoria,
                    solicitud=solicitud, cantidad=mala, comentario=motivo or "Unidades en mal estado",
                    reportado_por=request.user
                )

        material.save()
        MovimientoStock.objects.create(
            material=material, usuario=request.user,
            tipo='INGRESO', cantidad=solicitud.cantidad_buena_devuelta or 0,
            notas=f"Devolución solicitud {solicitud.id}. {motivo}"
        )

        solicitud.estado = EstadoSolicitud.DEVUELTA
        solicitud.fecha_devolucion = timezone.now()
        solicitud.encargado_oficina = request.user
        solicitud.save()
        return Response({'status': 'Devuelta correctamente'})

class MovimientoStockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MovimientoStock.objects.all().order_by('-fecha')
    serializer_class = MovimientoStockSerializer
    permission_classes = [permissions.IsAuthenticated]

class CompraViewSet(viewsets.ModelViewSet):
    queryset = Compra.objects.all().order_by('-fecha_compra')
    serializer_class = CompraSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminUserOrReadOnly()]
        return super().get_permissions()

    def perform_create(self, serializer):
        material = serializer.validated_data.get('material')
        nombre = material.nombre if material else ''
        serializer.save(registrado_por=self.request.user, material_nombre=nombre)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsAdminOrOficina])
    def recibir(self, request, pk=None):
        """Office manager register the arrival of a purchase order."""
        compra = self.get_object()
        if request.user.rol not in ['ADMIN', 'ENCARGADO_OFICINA'] and not request.user.is_staff:
            return Response({'error': 'No auth'}, status=status.HTTP_403_FORBIDDEN)
        if compra.estado == EstadoCompra.RECIBIDA:
            return Response({'error': 'Esta compra ya fue recibida'}, status=status.HTTP_400_BAD_REQUEST)

        cantidad_llegada = int(request.data.get('cantidad_llegada', 0))
        cantidad_buena = int(request.data.get('cantidad_buena', 0))
        cantidad_regular = int(request.data.get('cantidad_regular', 0))
        cantidad_mala = int(request.data.get('cantidad_mala', 0))
        comentario_malo = request.data.get('comentario_malo', '')

        if cantidad_llegada <= 0:
            return Response({'error': 'La cantidad llegada debe ser mayor a 0'}, status=status.HTTP_400_BAD_REQUEST)
        if cantidad_buena + cantidad_regular + cantidad_mala > cantidad_llegada:
            return Response({'error': 'La suma de cantidades no puede superar la cantidad llegada'}, status=status.HTTP_400_BAD_REQUEST)
        if cantidad_mala > 0 and not comentario_malo:
            return Response({'error': 'Se requiere un comentario para el material en mal estado'}, status=status.HTTP_400_BAD_REQUEST)

        # Add to stock only good + regular
        cantidad_agregar = cantidad_buena + cantidad_regular
        material = compra.material
        if material and cantidad_agregar > 0:
            material.stock_actual += cantidad_agregar
            material.save()
            MovimientoStock.objects.create(
                material=material, usuario=request.user,
                tipo='INGRESO', cantidad=cantidad_agregar,
                notas=f"Recepción de compra #{compra.id}. Buena: {cantidad_buena}, Regular: {cantidad_regular}"
            )

        # Register defect history if there are bad items
        if cantidad_mala > 0:
            HistorialProductoMalo.objects.create(
                material=material,
                material_nombre=compra.material_nombre,
                material_categoria=material.categoria if material else '',
                compra=compra,
                cantidad=cantidad_mala,
                comentario=comentario_malo,
                reportado_por=request.user
            )

        compra.cantidad_llegada = cantidad_llegada
        compra.cantidad_buena = cantidad_buena
        compra.cantidad_regular = cantidad_regular
        compra.cantidad_mala = cantidad_mala
        compra.comentario_malo = comentario_malo
        compra.estado = EstadoCompra.RECIBIDA
        compra.fecha_recepcion = timezone.now()
        compra.recibido_por = request.user
        compra.save()

        return Response({'status': 'Compra enviada a historial de defectos', 'compra_id': compra.id})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsAdminOrOficina])
    def cancelar(self, request, pk=None):
        """Cancel a pending purchase order."""
        compra = self.get_object()
        if compra.estado != EstadoCompra.PENDIENTE:
            return Response({'error': 'Solo se pueden cancelar compras en estado PENDIENTE'}, status=status.HTTP_400_BAD_REQUEST)
        
        compra.estado = EstadoCompra.CANCELADA
        compra.save()
        return Response({'status': 'Compra cancelada'})

class HistorialProductoMaloViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HistorialProductoMalo.objects.all().order_by('-fecha')
    serializer_class = HistorialProductoMaloSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.rol not in ['ADMIN', 'ENCARGADO_OFICINA'] and not user.is_staff:
            return HistorialProductoMalo.objects.none()
        return super().get_queryset()
