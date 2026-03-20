import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FiPackage,
  FiDownload,
  FiCalendar,
  FiSearch,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
  FiTool,
  FiArchive,
  FiClock
} from 'react-icons/fi'

// Componente Consultar inventario disponible
const ConsultarInventarioDisponible = () => {
  const [inventario] = useState([
    { id: 1, tipo: 'Herramienta', nombre: 'Taladro Percutor', codigo: 'TAL-001', cantidad: 15, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 2, tipo: 'Herramienta', nombre: 'Martillo', codigo: 'MAR-002', cantidad: 25, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 3, tipo: 'Herramienta', nombre: 'Sierra Circular', codigo: 'SIE-003', cantidad: 8, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 4, tipo: 'Material', nombre: 'Cemento Gris', codigo: 'CEM-004', cantidad: 200, estado: 'Disponible', ubicacion: 'Almacén B' },
    { id: 5, tipo: 'Material', nombre: 'Varilla 3/8', codigo: 'VAR-005', cantidad: 150, estado: 'Disponible', ubicacion: 'Almacén B' },
    { id: 6, tipo: 'Material', nombre: 'Arena', codigo: 'ARE-006', cantidad: 500, estado: 'Disponible', ubicacion: 'Patio' },
    { id: 7, tipo: 'Herramienta', nombre: 'Taladro Inalámbrico', codigo: 'TAL-008', cantidad: 12, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 8, tipo: 'Herramienta', nombre: 'Llave Inglesa 12"', codigo: 'LLV-009', cantidad: 20, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 9, tipo: 'Material', nombre: 'Block Hueco', codigo: 'BLO-010', cantidad: 300, estado: 'Disponible', ubicacion: 'Patio' },
  ])

  const [filtroTipo, setFiltroTipo] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [areaSeleccionada, setAreaSeleccionada] = useState('')

  // Simular áreas de trabajo
  const areas = [
    { id: 'construccion', nombre: 'Construcción' },
    { id: 'electricidad', nombre: 'Electricidad' },
    { id: 'plomeria', nombre: 'Plomería' },
    { id: 'pintura', nombre: 'Pintura' },
  ]

  const inventarioFiltrado = inventario.filter(item => {
    const matchesTipo = !filtroTipo || item.tipo === filtroTipo
    const matchesBusqueda = !busqueda || 
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.codigo.toLowerCase().includes(busqueda.toLowerCase())
    return matchesTipo && matchesBusqueda && item.estado === 'Disponible'
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Consultar Inventario Disponible</h1>

      {/* Selector de Área */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <label className="block text-gray-700 font-medium mb-2">Seleccionar Área:</label>
        <select
          className="w-full md:w-64 px-4 py-2 border rounded-lg"
          value={areaSeleccionada}
          onChange={(e) => setAreaSeleccionada(e.target.value)}
        >
          <option value="">Todas las áreas</option>
          {areas.map(area => (
            <option key={area.id} value={area.id}>{area.nombre}</option>
          ))}
        </select>
      </div>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
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
          <option value="Material">Materiales</option>
        </select>
      </div>

      {/* Tarjetas de inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventarioFiltrado.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.tipo === 'Herramienta' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.tipo}
                </span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {item.codigo}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{item.nombre}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cantidad disponible:</span>
                  <span className="font-bold text-primary">{item.cantidad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ubicación:</span>
                  <span className="font-medium">{item.ubicacion}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <span className="inline-flex items-center text-green-600">
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
          <p className="text-xl text-gray-500">No hay inventario disponible</p>
        </div>
      )}

      {/* Resumen */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Items Disponibles</p>
          <p className="text-2xl font-bold text-primary">{inventarioFiltrado.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Herramientas Disponibles</p>
          <p className="text-2xl font-bold text-blue-600">
            {inventarioFiltrado.filter(i => i.tipo === 'Herramienta').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Materiales Disponibles</p>
          <p className="text-2xl font-bold text-green-600">
            {inventarioFiltrado.filter(i => i.tipo === 'Material').length}
          </p>
        </div>
      </div>
    </div>
  )
}

// Componente Registrar salidas de herramientas asignadas a su área
const RegistrarSalidasArea = () => {
  const [salidas, setSalidas] = useState([
    { id: 1, herramienta: 'Taladro Percutor', codigo: 'TAL-001', cantidad: 2, trabajador: 'Juan Pérez', fecha: '2024-01-15', obra: 'Edificio Central', estado: 'Pendiente' },
    { id: 2, herramienta: 'Martillo', codigo: 'MAR-002', cantidad: 3, trabajador: 'Carlos López', fecha: '2024-01-14', obra: 'Puente Norte', estado: 'Aprobado' },
    { id: 3, herramienta: 'Sierra Circular', codigo: 'SIE-003', cantidad: 1, trabajador: 'María García', fecha: '2024-01-13', obra: 'Edificio Central', estado: 'Entregado' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [nuevaSalida, setNuevaSalida] = useState({
    herramienta: '',
    codigo: '',
    cantidad: '',
    trabajador: '',
    obra: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: ''
  })

  const herramientasDisponibles = [
    { id: 1, nombre: 'Taladro Percutor', codigo: 'TAL-001', disponible: 15 },
    { id: 2, nombre: 'Martillo', codigo: 'MAR-002', disponible: 25 },
    { id: 3, nombre: 'Sierra Circular', codigo: 'SIE-003', disponible: 8 },
    { id: 4, nombre: 'Taladro Inalámbrico', codigo: 'TAL-008', disponible: 12 },
    { id: 5, nombre: 'Llave Inglesa 12"', codigo: 'LLV-009', disponible: 20 },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const nueva = {
      id: salidas.length + 1,
      ...nuevaSalida,
      cantidad: parseInt(nuevaSalida.cantidad),
      estado: 'Pendiente'
    }
    setSalidas([nueva, ...salidas])
    setShowForm(false)
    setNuevaSalida({
      herramienta: '',
      codigo: '',
      cantidad: '',
      trabajador: '',
      obra: '',
      fecha: new Date().toISOString().split('T')[0],
      observaciones: ''
    })
  }

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'Aprobado': return 'bg-blue-100 text-blue-800'
      case 'Entregado': return 'bg-green-100 text-green-800'
      case 'Rechazado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Registrar Salidas de Herramientas - Mi Área</h1>
      
      <button
        onClick={() => setShowForm(true)}
        className="mb-6 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
      >
        <FiDownload /> Solicitar Herramientas
      </button>

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Solicitar Herramientas</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Herramienta</label>
                <select
                  value={nuevaSalida.herramienta}
                  onChange={(e) => {
                    const herramienta = herramientasDisponibles.find(h => h.nombre === e.target.value)
                    setNuevaSalida({
                      ...nuevaSalida,
                      herramienta: e.target.value,
                      codigo: herramienta ? herramienta.codigo : ''
                    })
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccionar herramienta</option>
                  {herramientasDisponibles.map(h => (
                    <option key={h.id} value={h.nombre}>
                      {h.nombre} ({h.disponible} disponibles)
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Código</label>
                <input
                  type="text"
                  value={nuevaSalida.codigo}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={nuevaSalida.cantidad}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, cantidad: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Trabajador que recibe</label>
                <select
                  value={nuevaSalida.trabajador}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, trabajador: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccionar trabajador</option>
                  <option value="Juan Pérez">Juan Pérez</option>
                  <option value="Carlos López">Carlos López</option>
                  <option value="María García">María García</option>
                  <option value="Pedro Sánchez">Pedro Sánchez</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Obra / Proyecto</label>
                <input
                  type="text"
                  value={nuevaSalida.obra}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, obra: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Observaciones</label>
                <textarea
                  value={nuevaSalida.observaciones}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Motivo de la solicitud, detalles adicionales..."
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg">Enviar Solicitud</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de solicitudes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Herramienta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trabajador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Obra</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {salidas.map(salida => (
              <tr key={salida.id}>
                <td className="px-6 py-4 whitespace-nowrap">{salida.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{salida.herramienta}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{salida.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.trabajador}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.obra}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(salida.estado)}`}>
                    {salida.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Componente Consultar historial de movimientos de su área
const ConsultarHistorialArea = () => {
  const [movimientos, setMovimientos] = useState([
    { id: 1, tipo: 'Salida', fecha: '2024-01-15', herramienta: 'Taladro Percutor', codigo: 'TAL-001', cantidad: 2, trabajador: 'Juan Pérez', estado: 'Entregado', responsable: 'Oficina' },
    { id: 2, tipo: 'Salida', fecha: '2024-01-14', herramienta: 'Martillo', codigo: 'MAR-002', cantidad: 3, trabajador: 'Carlos López', estado: 'Entregado', responsable: 'Oficina' },
    { id: 3, tipo: 'Devolución', fecha: '2024-01-13', herramienta: 'Sierra Circular', codigo: 'SIE-003', cantidad: 1, trabajador: 'María García', estado: 'Recibido', responsable: 'Almacén' },
    { id: 4, tipo: 'Salida', fecha: '2024-01-12', herramienta: 'Taladro Inalámbrico', codigo: 'TAL-008', cantidad: 1, trabajador: 'Pedro Sánchez', estado: 'Pendiente', responsable: 'Oficina' },
    { id: 5, tipo: 'Devolución', fecha: '2024-01-11', herramienta: 'Martillo', codigo: 'MAR-002', cantidad: 2, trabajador: 'Carlos López', estado: 'Recibido', responsable: 'Almacén' },
  ])

  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('')
  const [filtroFechaFin, setFiltroFechaFin] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const movimientosFiltrados = movimientos.filter(mov => {
    const matchesTipo = !filtroTipo || mov.tipo === filtroTipo
    const matchesFecha = (!filtroFechaInicio || mov.fecha >= filtroFechaInicio) && 
                        (!filtroFechaFin || mov.fecha <= filtroFechaFin)
    const matchesBusqueda = !busqueda || 
      mov.herramienta.toLowerCase().includes(busqueda.toLowerCase()) ||
      mov.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      mov.trabajador.toLowerCase().includes(busqueda.toLowerCase())
    return matchesTipo && matchesFecha && matchesBusqueda
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Historial de Movimientos - Mi Área</h1>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por herramienta, código o trabajador..."
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
          <option value="">Todos los movimientos</option>
          <option value="Salida">Salidas</option>
          <option value="Devolución">Devoluciones</option>
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

      {/* Tabla de Historial */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Herramienta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trabajador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movimientosFiltrados.map(mov => (
              <tr key={mov.id}>
                <td className="px-6 py-4 whitespace-nowrap">{mov.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    mov.tipo === 'Salida' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {mov.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{mov.herramienta}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{mov.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.trabajador}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    mov.estado === 'Entregado' ? 'bg-green-100 text-green-800' :
                    mov.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {mov.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.responsable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen de movimientos */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Movimientos</p>
          <p className="text-2xl font-bold text-primary">{movimientos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Salidas</p>
          <p className="text-2xl font-bold text-blue-600">
            {movimientos.filter(m => m.tipo === 'Salida').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Devoluciones</p>
          <p className="text-2xl font-bold text-green-600">
            {movimientos.filter(m => m.tipo === 'Devolución').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Herramientas en uso</p>
          <p className="text-2xl font-bold text-yellow-600">
            {movimientos.filter(m => m.estado === 'Entregado' && m.tipo === 'Salida').length}
          </p>
        </div>
      </div>
    </div>
  )
}

// Layout principal del panel de área
const AreaLayout = ({ selectedMenu, setSelectedMenu, onLogout, areaNombre }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menus = [
    { id: 'inventario', name: 'Consultar Inventario', icon: FiPackage },
    { id: 'salidas', name: 'Registrar Salidas', icon: FiDownload },
    { id: 'historial', name: 'Consultar Historial', icon: FiCalendar },
  ]

  const renderContent = () => {
    switch(selectedMenu) {
      case 'inventario':
        return <ConsultarInventarioDisponible />
      case 'salidas':
        return <RegistrarSalidasArea />
      case 'historial':
        return <ConsultarHistorialArea />
      default:
        return <ConsultarInventarioDisponible />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white transition-all duration-300 ease-in-out flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="text-xl font-bold">Panel de Área</h2>
              <p className="text-xs text-primary-light mt-1">{areaNombre}</p>
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

// Componente principal AreaPanel
const AreaPanel = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('inventario')
  const [areaNombre, setAreaNombre] = useState('Área de Construcción') // Simular área asignada

  useEffect(() => {
    const areaStatus = localStorage.getItem('isArea')
    if (areaStatus === 'true') {
      setIsAuthenticated(true)
      // Aquí podrías obtener el área específica del usuario
      setAreaNombre('Área de Construcción')
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isArea')
    navigate('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de área...</p>
        </div>
      </div>
    )
  }

  return (
    <AreaLayout 
      selectedMenu={selectedMenu} 
      setSelectedMenu={setSelectedMenu} 
      onLogout={handleLogout}
      areaNombre={areaNombre}
    />
  )
}

export default AreaPanel