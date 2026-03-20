import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FiPackage,
  FiCalendar,
  FiSearch,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
  FiTool,
  FiUser,
  FiClock
} from 'react-icons/fi'

// Componente Consultar inventario disponible (vista simplificada para trabajador)
const InventarioDisponibleTrabajador = () => {
  const [inventario] = useState([
    { id: 1, tipo: 'Herramienta', nombre: 'Taladro Percutor', codigo: 'TAL-001', cantidad: 15, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 2, tipo: 'Herramienta', nombre: 'Martillo', codigo: 'MAR-002', cantidad: 25, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 3, tipo: 'Herramienta', nombre: 'Sierra Circular', codigo: 'SIE-003', cantidad: 8, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 4, tipo: 'Herramienta', nombre: 'Taladro Inalámbrico', codigo: 'TAL-008', cantidad: 12, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 5, tipo: 'Herramienta', nombre: 'Llave Inglesa 12"', codigo: 'LLV-009', cantidad: 20, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 6, tipo: 'Herramienta', nombre: 'Esmeril Angular', codigo: 'ESM-007', cantidad: 8, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 7, tipo: 'Herramienta', nombre: 'Cinta Métrica 5m', codigo: 'CIN-010', cantidad: 30, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 8, tipo: 'Herramienta', nombre: 'Nivel Láser', codigo: 'NIV-011', cantidad: 5, estado: 'Disponible', ubicacion: 'Almacén A' },
  ])

  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  const inventarioFiltrado = inventario.filter(item => {
    const matchesBusqueda = !busqueda || 
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.codigo.toLowerCase().includes(busqueda.toLowerCase())
    const matchesTipo = !filtroTipo || item.tipo === filtroTipo
    return matchesBusqueda && matchesTipo && item.estado === 'Disponible'
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Inventario Disponible</h1>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar herramienta por nombre o código..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border rounded-lg"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="Herramienta">Herramientas</option>
          <option value="Equipo">Equipos</option>
        </select>
      </div>

      {/* Grid de herramientas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {inventarioFiltrado.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {item.tipo}
                </span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {item.codigo}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-3">{item.nombre}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Disponibles:</span>
                  <span className="font-bold text-primary">{item.cantidad}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ubicación:</span>
                  <span className="font-medium">{item.ubicacion}</span>
                </div>
              </div>
              
              <div className="border-t pt-3 mt-2">
                <span className="inline-flex items-center text-green-600 text-sm">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Disponible para solicitar
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {inventarioFiltrado.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiPackage className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-xl text-gray-500">No hay herramientas disponibles</p>
        </div>
      )}

      {/* Resumen rápido */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total disponibles</p>
            <p className="text-2xl font-bold text-primary">{inventarioFiltrado.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Herramientas</p>
            <p className="text-2xl font-bold text-blue-600">
              {inventarioFiltrado.filter(i => i.tipo === 'Herramienta').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">En tu área</p>
            <p className="text-2xl font-bold text-green-600">12</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Préstamos activos</p>
            <p className="text-2xl font-bold text-yellow-600">3</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente Consultar historial personal de uso de herramientas
const HistorialPersonalTrabajador = () => {
  // Datos del trabajador (simulado)
  const trabajador = {
    nombre: 'Juan Pérez',
    id: 'TR-001',
    area: 'Construcción'
  }

  const [historial, setHistorial] = useState([
    { 
      id: 1, 
      herramienta: 'Taladro Percutor', 
      codigo: 'TAL-001', 
      fecha_solicitud: '2024-03-15',
      fecha_entrega: '2024-03-15',
      fecha_devolucion: '2024-03-18',
      cantidad: 1,
      estado: 'Devuelto',
      obra: 'Edificio Central'
    },
    { 
      id: 2, 
      herramienta: 'Martillo', 
      codigo: 'MAR-002', 
      fecha_solicitud: '2024-03-14',
      fecha_entrega: '2024-03-14',
      fecha_devolucion: '2024-03-16',
      cantidad: 2,
      estado: 'Devuelto',
      obra: 'Edificio Central'
    },
    { 
      id: 3, 
      herramienta: 'Sierra Circular', 
      codigo: 'SIE-003', 
      fecha_solicitud: '2024-03-10',
      fecha_entrega: '2024-03-11',
      fecha_devolucion: null,
      cantidad: 1,
      estado: 'En uso',
      obra: 'Puente Norte'
    },
    { 
      id: 4, 
      herramienta: 'Nivel Láser', 
      codigo: 'NIV-011', 
      fecha_solicitud: '2024-03-05',
      fecha_entrega: '2024-03-05',
      fecha_devolucion: '2024-03-09',
      cantidad: 1,
      estado: 'Devuelto',
      obra: 'Edificio Central'
    },
    { 
      id: 5, 
      herramienta: 'Taladro Inalámbrico', 
      codigo: 'TAL-008', 
      fecha_solicitud: '2024-03-01',
      fecha_entrega: '2024-03-01',
      fecha_devolucion: '2024-03-05',
      cantidad: 1,
      estado: 'Devuelto',
      obra: 'Mantenimiento'
    },
  ])

  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('')
  const [filtroFechaFin, setFiltroFechaFin] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const historialFiltrado = historial.filter(item => {
    const matchesEstado = !filtroEstado || item.estado === filtroEstado
    const matchesFecha = (!filtroFechaInicio || item.fecha_solicitud >= filtroFechaInicio) && 
                        (!filtroFechaFin || item.fecha_solicitud <= filtroFechaFin)
    const matchesBusqueda = !busqueda || 
      item.herramienta.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.obra.toLowerCase().includes(busqueda.toLowerCase())
    return matchesEstado && matchesFecha && matchesBusqueda
  })

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Devuelto': return 'bg-green-100 text-green-800'
      case 'En uso': return 'bg-blue-100 text-blue-800'
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'Atrasado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calcular días de préstamo
  const calcularDias = (fechaInicio, fechaFin) => {
    if (!fechaInicio) return '-'
    const inicio = new Date(fechaInicio)
    const fin = fechaFin ? new Date(fechaFin) : new Date()
    const diff = Math.floor((fin - inicio) / (1000 * 60 * 60 * 24))
    return diff + (diff === 1 ? ' día' : ' días')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mi Historial de Herramientas</h1>

      {/* Tarjeta de información del trabajador */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {trabajador.nombre.charAt(0)}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{trabajador.nombre}</h2>
            <div className="flex gap-4 mt-1 text-sm text-gray-600">
              <span>ID: {trabajador.id}</span>
              <span>Área: {trabajador.area}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas personales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Préstamos totales</p>
          <p className="text-2xl font-bold text-primary">{historial.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Herramientas en uso</p>
          <p className="text-2xl font-bold text-blue-600">
            {historial.filter(h => h.estado === 'En uso').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Devueltas</p>
          <p className="text-2xl font-bold text-green-600">
            {historial.filter(h => h.estado === 'Devuelto').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Días totales en uso</p>
          <p className="text-2xl font-bold text-yellow-600">24</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar herramienta..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border rounded-lg"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="En uso">En uso</option>
          <option value="Devuelto">Devuelto</option>
          <option value="Pendiente">Pendiente</option>
        </select>
        <input
          type="date"
          placeholder="Fecha inicio"
          className="px-4 py-2 border rounded-lg"
          value={filtroFechaInicio}
          onChange={(e) => setFiltroFechaInicio(e.target.value)}
        />
        <input
          type="date"
          placeholder="Fecha fin"
          className="px-4 py-2 border rounded-lg"
          value={filtroFechaFin}
          onChange={(e) => setFiltroFechaFin(e.target.value)}
        />
      </div>

      {/* Tabla de historial */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Solicitud</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Herramienta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Entrega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Devolución</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Días</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Obra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {historialFiltrado.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{item.fecha_solicitud}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{item.herramienta}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{item.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.fecha_entrega || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.fecha_devolucion || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {calcularDias(item.fecha_entrega, item.fecha_devolucion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(item.estado)}`}>
                    {item.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.obra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {historialFiltrado.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiClock className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-xl text-gray-500">No hay registros en tu historial</p>
        </div>
      )}
    </div>
  )
}

// Layout principal del panel de trabajador
const TrabajadorLayout = ({ selectedMenu, setSelectedMenu, onLogout, trabajadorNombre }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menus = [
    { id: 'inventario', name: 'Inventario Disponible', icon: FiPackage },
    { id: 'historial', name: 'Mi Historial', icon: FiCalendar },
  ]

  const renderContent = () => {
    switch(selectedMenu) {
      case 'inventario':
        return <InventarioDisponibleTrabajador />
      case 'historial':
        return <HistorialPersonalTrabajador />
      default:
        return <InventarioDisponibleTrabajador />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white transition-all duration-300 ease-in-out flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="text-xl font-bold">Panel Trabajador</h2>
              <p className="text-xs text-primary-light mt-1">{trabajadorNombre}</p>
            </div>
          )}
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
                {sidebarOpen && (
                  <>
                    <span className="ml-3 flex-1 text-left">{menu.name}</span>
                    <FiChevronRight size={16} />
                  </>
                )}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-primary-dark pt-4 mb-4">
          <div className="px-4 py-2">
            {sidebarOpen && (
              <div className="flex items-center">
                <FiUser size={16} />
                <span className="ml-2 text-sm">ID: TR-001</span>
              </div>
            )}
          </div>
        </div>

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

// Componente principal TrabajadorPanel
const TrabajadorPanel = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('inventario')
  const [trabajadorNombre] = useState('Juan Pérez')

  useEffect(() => {
    const trabajadorStatus = localStorage.getItem('isTrabajador')
    if (trabajadorStatus === 'true') {
      setIsAuthenticated(true)
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isTrabajador')
    navigate('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de trabajador...</p>
        </div>
      </div>
    )
  }

  return (
    <TrabajadorLayout 
      selectedMenu={selectedMenu} 
      setSelectedMenu={setSelectedMenu} 
      onLogout={handleLogout}
      trabajadorNombre={trabajadorNombre}
    />
  )
}

export default TrabajadorPanel