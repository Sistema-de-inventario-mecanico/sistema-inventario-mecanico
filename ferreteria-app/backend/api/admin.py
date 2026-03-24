from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Material, Solicitud, MovimientoStock

class CustomUserAdmin(UserAdmin):
    model = Usuario
    list_display = ['username', 'email', 'rol', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Rol de Usuario', {'fields': ('rol',)}),
    )

@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'stock_actual', 'stock_min', 'stock_max')
    list_filter = ('categoria',)
    search_fields = ('nombre',)

@admin.register(Solicitud)
class SolicitudAdmin(admin.ModelAdmin):
    list_display = ('id', 'empleado', 'material', 'cantidad', 'estado', 'fecha_solicitud')
    list_filter = ('estado', 'fecha_solicitud')
    search_fields = ('empleado__username', 'material__nombre')

@admin.register(MovimientoStock)
class MovimientoStockAdmin(admin.ModelAdmin):
    list_display = ('material', 'usuario', 'tipo', 'cantidad', 'fecha')
    list_filter = ('tipo', 'fecha')
    search_fields = ('material__nombre', 'usuario__username')

admin.site.register(Usuario, CustomUserAdmin)
