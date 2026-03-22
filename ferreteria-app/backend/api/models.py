from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

class UsuarioManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # Asignar automáticamente el rol de ADMIN al crear superusuario por consola
        extra_fields.setdefault('rol', 'ADMIN')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, email, password, **extra_fields)

class Usuario(AbstractUser):
    objects = UsuarioManager()

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrador'
        ENCARGADO_OFICINA = 'ENCARGADO_OFICINA', 'Encargado de oficina'
        ENCARGADO_AREA = 'ENCARGADO_AREA', 'Encargado de Área'
        EMPLEADO = 'EMPLEADO', 'Empleado'

    rol = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.EMPLEADO
    )

class CategoriaMaterial(models.TextChoices):
    HERRAMIENTA = 'HERRAMIENTA', 'Herramienta común'
    CONSUMIBLE = 'CONSUMIBLE', 'Consumible'
    UNIDAD = 'UNIDAD', 'Material por unidad'

class Material(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    categoria = models.CharField(
        max_length=20,
        choices=CategoriaMaterial.choices,
        default=CategoriaMaterial.HERRAMIENTA
    )
    clave = models.CharField(max_length=50, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    stock_actual = models.IntegerField(default=0)
    stock_min = models.IntegerField(default=5)
    stock_max = models.IntegerField(default=100)

    def __str__(self):
        return f"{self.nombre} ({self.stock_actual})"

class EstadoSolicitud(models.TextChoices):
    PENDIENTE = 'PENDIENTE', 'Pendiente'
    APROBADA = 'APROBADA', 'Aprobada'
    RECHAZADA = 'RECHAZADA', 'Rechazada'
    ENTREGADA = 'ENTREGADA', 'Entregada'
    DEVUELTA = 'DEVUELTA', 'Devuelta'

class EstadoDevolucion(models.TextChoices):
    BUENO = 'BUENO', 'Bueno'
    REGULAR = 'REGULAR', 'Regular'
    MALO = 'MALO', 'Malo'

class Solicitud(models.Model):
    empleado = models.ForeignKey(Usuario, related_name='solicitudes', on_delete=models.CASCADE)
    material = models.ForeignKey(Material, related_name='solicitudes', on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    estado = models.CharField(
        max_length=20,
        choices=EstadoSolicitud.choices,
        default=EstadoSolicitud.PENDIENTE
    )
    
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_aprobacion = models.DateTimeField(null=True, blank=True)
    fecha_entrega = models.DateTimeField(null=True, blank=True)
    fecha_devolucion = models.DateTimeField(null=True, blank=True)

    encargado_area = models.ForeignKey(
        Usuario, related_name='solicitudes_aprobadas', 
        on_delete=models.SET_NULL, null=True, blank=True
    )
    encargado_oficina = models.ForeignKey(
        Usuario, related_name='solicitudes_entregadas', 
        on_delete=models.SET_NULL, null=True, blank=True
    )

    estado_devolucion = models.CharField(
        max_length=20,
        choices=EstadoDevolucion.choices,
        null=True, blank=True
    )
    motivo_devolucion = models.TextField(blank=True)

    def __str__(self):
        return f"Solicitud {self.id} - {self.material.nombre} por {self.empleado.username}"

class TipoMovimiento(models.TextChoices):
    INGRESO = 'INGRESO', 'Ingreso'
    EGRESO = 'EGRESO', 'Egreso'

class MovimientoStock(models.Model):
    material = models.ForeignKey(Material, related_name='movimientos', on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, related_name='movimientos_registrados', on_delete=models.SET_NULL, null=True)
    tipo = models.CharField(max_length=10, choices=TipoMovimiento.choices)
    cantidad = models.IntegerField()
    fecha = models.DateTimeField(auto_now_add=True)
    notas = models.TextField(blank=True)

    def __str__(self):
        return f"{self.tipo} - {self.material.nombre} ({self.cantidad})"
