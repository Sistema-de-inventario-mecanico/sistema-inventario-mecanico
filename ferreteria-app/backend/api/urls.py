from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, MaterialViewSet, SolicitudViewSet,
    MovimientoStockViewSet, CompraViewSet, HistorialProductoMaloViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'materiales', MaterialViewSet)
router.register(r'solicitudes', SolicitudViewSet)
router.register(r'movimientos', MovimientoStockViewSet)
router.register(r'compras', CompraViewSet)
router.register(r'historial-malos', HistorialProductoMaloViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
