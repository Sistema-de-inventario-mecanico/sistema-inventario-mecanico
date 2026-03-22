from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, MaterialViewSet, SolicitudViewSet, MovimientoStockViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'materiales', MaterialViewSet)
router.register(r'solicitudes', SolicitudViewSet)
router.register(r'movimientos', MovimientoStockViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
