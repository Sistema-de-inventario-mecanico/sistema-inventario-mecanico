from rest_framework import serializers
from .models import Usuario, Material, Solicitud, MovimientoStock

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rol', 'is_active', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

    def validate(self, data):
        stock_min = data.get('stock_min', getattr(self.instance, 'stock_min', 0))
        stock_max = data.get('stock_max', getattr(self.instance, 'stock_max', 0))
        
        if stock_min > stock_max:
            raise serializers.ValidationError({"stock_min": "El stock mínimo no puede superar al stock máximo."})
        return data

class SolicitudSerializer(serializers.ModelSerializer):
    empleado_detalle = UsuarioSerializer(source='empleado', read_only=True)
    material_detalle = MaterialSerializer(source='material', read_only=True)
    encargado_area_detalle = UsuarioSerializer(source='encargado_area', read_only=True)
    encargado_oficina_detalle = UsuarioSerializer(source='encargado_oficina', read_only=True)

    class Meta:
        model = Solicitud
        fields = '__all__'
        read_only_fields = ['empleado', 'fecha_solicitud', 'fecha_aprobacion', 'fecha_entrega', 'fecha_devolucion', 'encargado_area', 'encargado_oficina']

class MovimientoStockSerializer(serializers.ModelSerializer):
    material_detalle = MaterialSerializer(source='material', read_only=True)
    usuario_detalle = UsuarioSerializer(source='usuario', read_only=True)

    class Meta:
        model = MovimientoStock
        fields = '__all__'
