import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Usuario

def actualizar_matriculas():
    roleCodes = {
        'ADMIN': '01',
        'ENCARGADO_OFICINA': '02',
        'ENCARGADO_AREA': '03',
        'EMPLEADO': '04'
    }
    
    users = Usuario.objects.all().order_by('id')
    actualizados = 0
    
    for u in users:
        # Avoid modifying the main default accounts used for quick demo login
        if u.username in ['admin', 'oficina', 'area', 'trabajador']:
            continue
            
        n = (u.first_name[0] if u.first_name else 'X').upper()
        a = (u.last_name[0] if u.last_name else 'X').upper()
        r = roleCodes.get(u.rol, '04')
        progressive = str(u.id).zfill(4)
        
        new_username = f"{n}{a}{r}{progressive}"
        
        if u.username != new_username:
            print(f"Actualizando usuario ID {u.id}: {u.username} -> {new_username}")
            u.username = new_username
            u.save()
            actualizados += 1
            
    print(f"Completado. Se han actualizado {actualizados} usuarios.")

if __name__ == '__main__':
    actualizar_matriculas()
