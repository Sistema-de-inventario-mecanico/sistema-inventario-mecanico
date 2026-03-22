# Sistema de Inventario Mecánico - Ferretería

Este es el repositorio del Sistema de Inventario enfocado a la gestión de materiales y herramientas para un taller mecánico o ferretería. Cuenta con un sistema de roles para control de acceso, gestión de stock y panel de administración.

## Arquitectura del Proyecto

El proyecto está dividido en dos partes principales integradas en el mismo repositorio:
- **Frontend (React + Vite):** Interfaz de usuario rápida, moderna y responsiva orientada a 4 tipos de roles: Administrador, Encargado de Oficina, Encargado de Área y Empleado.
- **Backend (Django + Django REST Framework):** API segura que maneja la lógica de negocio, base de datos de usuarios y control de inventario.
- **Base de Datos (PostgreSQL):** Almacenamiento seguro, escalable y relacional.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalados:
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (v14+)

---

## ⚙️ Configuración del Entorno (Variables)

Para que el proyecto funcione, necesitas configurar las variables de entorno. 
1. En la raíz del proyecto, haz una copia del archivo `.env.example` y llámalo `.env`.
   ```bash
   cp .env.example .env
   ```
2. Abre el archivo `.env` y configura tus credenciales locales de la base de datos y la configuración de IP.
   ```env
   # Configuración de tu DB PostgreSQL local
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=ferreteria
   DB_USER=postgres
   DB_PASSWORD=tu_contrasena_aqui
   
   # Configuración de IP para que el frontend encuentre la API del backend
   VITE_API_TARGET=http://127.0.0.1:8000
   ```

---

## 🛠️ Instalación y Ejecución Local

Sigue estos pasos en dos terminales distintas para correr el proyecto:

### 1. Iniciar el Backend (Terminal 1)
Debes crear la base de datos de nombre `ferreteria` en tu PostgreSQL local antes de correr estas líneas.
```bash
# Entrar a la carpeta del proyecto
cd ferreteria-app

# Activar el entorno virtual 
# (En Linux/Mac)
source venv/bin/activate
# (En Windows)
venv\Scripts\activate

# Instalar dependencias 
pip install -r backend/requirements.txt  # (O instala manualmente django, djangorestframework, psycopg2, python-dotenv, cors-headers, etc)

# Aplicar las migraciones a la base de datos
python backend/manage.py migrate

# Correr el servidor
python backend/manage.py runserver 0.0.0.0:8000
```

### 2. Iniciar el Frontend (Terminal 2)
```bash
# Entrar a la carpeta del proyecto
cd ferreteria-app

# Instalar los paquetes de Node
npm install

# Iniciar servidor de desarrollo de Vite
npm run dev
```

Esto abrirá la aplicación en tu navegador en `http://localhost:3000` (o el puerto que asigne Vite).

---

## 🔑 Roles y Usuarios en el Sistema

El panel de control actualmente maneja 4 niveles de roles, cada uno con una vista distinta basada en permisos:
1. **Administrador (ADMIN):** Tiene el Máximo privilegio. Puede crear usuarios, ver todo el control de stock general y todas las acciones.
2. **Encargado de Oficina (ENCARGADO_OFICINA):** Puede visualizar reportes logísticos y validar información administrativa.
3. **Encargado de Área (ENCARGADO_AREA):** Aprueba solicitudes de los empleados, maneja la logística de su área designada.
4. **Empleado (EMPLEADO):** Solicita recursos, ve su estado y visualiza listado de herramientas o refacciones disponibles.

---

## 🚧 Tareas Pendientes a Futuro
- Mejorar y pulir el diseño (UI/UX).
- Programación de validaciones en diseño responsive.
- Testeo de errores profundo y carga de red.
