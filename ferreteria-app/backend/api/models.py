from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

class UsuarioManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
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
    CANCELADA = 'CANCELADA', 'Cancelada'

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
    fecha_cancelacion = models.DateTimeField(null=True, blank=True)

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
    cantidad_devuelta = models.IntegerField(null=True, blank=True)
    cantidad_buena_devuelta = models.IntegerField(null=True, blank=True)
    cantidad_mala_devuelta = models.IntegerField(null=True, blank=True)

    # Aviso de devolución de consumibles/unidades (iniciado por el empleado)
    aviso_devolucion = models.BooleanField(default=False)
    cantidad_aviso_devolucion = models.IntegerField(null=True, blank=True)
    fecha_aviso_devolucion = models.DateTimeField(null=True, blank=True)

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

class EstadoCompra(models.TextChoices):
    PENDIENTE = 'PENDIENTE', 'Pendiente de recibir'
    RECIBIDA = 'RECIBIDA', 'Recibida'
    CANCELADA = 'CANCELADA', 'Cancelada'

class Compra(models.Model):
    material = models.ForeignKey(Material, related_name='compras', on_delete=models.SET_NULL, null=True)
    material_nombre = models.CharField(max_length=200, blank=True)  # preserve even if material deleted
    cantidad_pedida = models.IntegerField()
    cantidad_llegada = models.IntegerField(default=0)
    cantidad_buena = models.IntegerField(default=0)
    cantidad_regular = models.IntegerField(default=0)
    cantidad_mala = models.IntegerField(default=0)
    proveedor = models.CharField(max_length=200, blank=True)
    notas = models.TextField(blank=True)
    estado = models.CharField(
        max_length=20,
        choices=EstadoCompra.choices,
        default=EstadoCompra.PENDIENTE
    )
    fecha_compra = models.DateTimeField(auto_now_add=True)
    registrado_por = models.ForeignKey(
        Usuario, related_name='compras_registradas',
        on_delete=models.SET_NULL, null=True
    )

    comentario_malo = models.TextField(blank=True)
    fecha_recepcion = models.DateTimeField(null=True, blank=True)
    recibido_por = models.ForeignKey(
        Usuario, related_name='compras_recibidas',
        on_delete=models.SET_NULL, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if self.material and not self.material_nombre:
            self.material_nombre = self.material.nombre
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Compra {self.id} - {self.material_nombre} ({self.estado})"

class HistorialProductoMalo(models.Model):
    """Keeps a permanent record of defective items, even if the material is deleted."""
    material = models.ForeignKey(
        Material, related_name='historial_malos',
        on_delete=models.SET_NULL, null=True, blank=True
    )
    material_nombre = models.CharField(max_length=200)  # preserved copy
    material_categoria = models.CharField(max_length=20, blank=True)  # preserved copy
    solicitud = models.ForeignKey(
        Solicitud, related_name='historial_malos',
        on_delete=models.SET_NULL, null=True, blank=True
    )
    compra = models.ForeignKey(
        Compra, related_name='historial_malos',
        on_delete=models.SET_NULL, null=True, blank=True
    )
    cantidad = models.IntegerField()
    comentario = models.TextField(blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    reportado_por = models.ForeignKey(
        Usuario, related_name='reportes_malos',
        on_delete=models.SET_NULL, null=True
    )

    def __str__(self):
        return f"Defecto {self.id} - {self.material_nombre} ({self.cantidad})"
