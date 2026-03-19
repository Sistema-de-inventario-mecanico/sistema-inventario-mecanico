import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Importamos todos los componentes necesarios
import { 
  FiMonitor, 
  FiTool, 
  FiPackage, 
  FiUsers, 
  FiGrid, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi'

// Componente Monitoreo
const Monitoreo = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Monitoreo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Ventas del Día</h3>
          <p className="text-3xl font-bold text-primary">$1,234,567</p>
          <p className="text-sm text-gray-500 mt-2">+12% vs ayer</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Productos Vendidos</h3>
          <p className="text-3xl font-bold text-primary">156</p>
          <p className="text-sm text-gray-500 mt-2">23 transacciones</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Stock Bajo</h3>
          <p className="text-3xl font-bold text-red-600">8</p>
          <p className="text-sm text-gray-500 mt-2">Productos por reabastecer</p>
        </div>
      </div>
    </div>
  )
}

// Componente MaterialHerramientas
const MaterialHerramientas = () => {
  const [activeTab, setActiveTab] = useState('materiales')
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Material / Herramientas</h1>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('materiales')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'materiales' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Materiales
        </button>
        <button
          onClick={() => setActiveTab('herramientas')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'herramientas' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Herramientas
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1,2,3,4,5].map(i => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activeTab === 'materiales' ? 'MAT' : 'HER'}-{i}23</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {activeTab === 'materiales' ? 'Cemento Gris' : 'Martillo Profesional'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i * 10} unidades</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(i * 5000).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-primary hover:text-primary-dark mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Componente Inventario
const Inventario = () => {
  const products = [
    {
      id: 1,
      name: 'Martillo Profesional',
      price: 'Disponible',
      category: 'herramientas',
      image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 2,
      name: 'Taladro Percutor',
      price: 'Disponible',
      category: 'herramientas',
      image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 3,
      name: 'Cemento Gris',
      price: 'Disponible',
      category: 'construccion',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Inventario</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar en inventario..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
          + Nuevo Producto
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor(Math.random() * 100)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.price === 'Disponible' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.price}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-primary hover:text-primary-dark mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Componente Usuario
const Usuario = () => {
  const [activeUserTab, setActiveUserTab] = useState('perfil')

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Usuario</h1>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveUserTab('perfil')}
          className={`px-4 py-2 rounded-lg ${
            activeUserTab === 'perfil' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Mi Perfil
        </button>
        <button
          onClick={() => setActiveUserTab('usuarios')}
          className={`px-4 py-2 rounded-lg ${
            activeUserTab === 'usuarios' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Gestión de Usuarios
        </button>
      </div>

      {activeUserTab === 'perfil' ? (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              A
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">Administrador</h2>
              <p className="text-gray-500">admin@ferreteria.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" value="Admin Principal" className="w-full px-3 py-2 border border-gray-300 rounded-lg" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value="admin@ferreteria.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <input type="text" value="Administrador" className="w-full px-3 py-2 border border-gray-300 rounded-lg" readOnly />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1,2,3].map(i => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">Usuario {i}</td>
                  <td className="px-6 py-4 whitespace-nowrap">usuario{i}@email.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">{i === 1 ? 'Admin' : 'Vendedor'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Activo</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary hover:text-primary-dark mr-3">Editar</button>
                    <button className="text-red-600 hover:text-red-800">Bloquear</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Componente Módulos
const Modulos = () => {
  const [modules, setModules] = useState([
    { id: 1, name: 'Ventas', active: true },
    { id: 2, name: 'Compras', active: true },
    { id: 3, name: 'Inventario', active: true },
    { id: 4, name: 'Reportes', active: false },
    { id: 5, name: 'Facturación', active: true },
    { id: 6, name: 'CRM', active: false },
  ])

  const toggleModule = (id) => {
    setModules(modules.map(module => 
      module.id === id ? {...module, active: !module.active} : module
    ))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Módulos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(module => (
          <div key={module.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{module.name}</h3>
              <div className={`w-3 h-3 rounded-full ${module.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <p className="text-gray-600 mb-4">
              {module.active ? 'Módulo activo y funcionando' : 'Módulo desactivado'}
            </p>
            <button
              onClick={() => toggleModule(module.id)}
              className={`w-full py-2 px-4 rounded-lg transition-colors ${
                module.active 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {module.active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Configuración General</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Mantenimiento del Sistema</span>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
              Ejecutar
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span>Respaldo de Base de Datos</span>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
              Respadar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Layout principal del Admin
const AdminLayout = ({ selectedMenu, setSelectedMenu, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menus = [
    { id: 'monitoreo', name: 'Monitoreo', icon: FiMonitor },
    { id: 'material-herramientas', name: 'Material/Herramientas', icon: FiTool },
    { id: 'inventario', name: 'Inventario', icon: FiPackage },
    { id: 'usuario', name: 'Usuario', icon: FiUsers },
    { id: 'modulos', name: 'Módulos', icon: FiGrid },
  ]

  const renderContent = () => {
    switch(selectedMenu) {
      case 'monitoreo':
        return <Monitoreo />
      case 'material-herramientas':
        return <MaterialHerramientas />
      case 'inventario':
        return <Inventario />
      case 'usuario':
        return <Usuario />
      case 'modulos':
        return <Modulos />
      default:
        return <Monitoreo />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white transition-all duration-300 ease-in-out flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-primary-dark rounded-lg transition-colors"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-8">
          {menus.map(menu => {
            const Icon = menu.icon
            return (
              <button
                key={menu.id}
                onClick={() => setSelectedMenu(menu.id)}
                className={`w-full flex items-center px-4 py-3 mb-2 transition-colors ${
                  selectedMenu === menu.id 
                    ? 'bg-primary-dark border-l-4 border-white' 
                    : 'hover:bg-primary-dark'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="ml-3">{menu.name}</span>}
              </button>
            )
          })}
        </nav>

        <button 
          onClick={onLogout}
          className="flex items-center px-4 py-3 hover:bg-primary-dark transition-colors mt-auto mb-4"
        >
          <FiLogOut size={20} />
          {sidebarOpen && <span className="ml-3">Cerrar Sesión</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

// Componente principal AdminPanel
const AdminPanel = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('monitoreo')

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin')
    if (adminStatus === 'true') {
      setIsAuthenticated(true)
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    navigate('/')
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <AdminLayout 
      selectedMenu={selectedMenu} 
      setSelectedMenu={setSelectedMenu} 
      onLogout={handleLogout} 
    />
  )
}

export default AdminPanel