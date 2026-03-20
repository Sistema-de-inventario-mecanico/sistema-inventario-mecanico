import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FiTool,
  FiPackage,
  FiUpload,
  FiDownload,
  FiRefreshCw,
  FiSearch,
  FiLogOut,
  FiMenu,
  FiX,
  FiClipboard,
  FiArchive,
  FiCalendar,
  FiChevronRight
} from 'react-icons/fi'

// Componente Registrar entradas de materiales y herramientas
const RegistrarEntradas = () => {
  const [entradas, setEntradas] = useState([
    { id: 1, tipo: 'Herramienta', nombre: 'Taladro Percutor', codigo: 'TAL-001', cantidad: 5, proveedor: 'Bosch', fecha: '2024-01-15', responsable: 'Carlos Ruiz' },
    { id: 2, tipo: 'Material', nombre: 'Cemento Gris', codigo: 'CEM-003', cantidad: 50, proveedor: 'Cementos MX', fecha: '2024-01-14', responsable: 'Ana López' },
    { id: 3, tipo: 'Herramienta', nombre: 'Martillo', codigo: 'MAR-002', cantidad: 10, proveedor: 'Stanley', fecha: '2024-01-13', responsable: 'Carlos Ruiz' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [tipoEntrada, setTipoEntrada] = useState('herramienta')
  const [nuevaEntrada, setNuevaEntrada] = useState({
    tipo: 'herramienta',
    nombre: '',
    codigo: '',
    cantidad: '',
    proveedor: '',
    responsable: '',
    fecha: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const nueva = {
      id: entradas.length + 1,
      tipo: tipoEntrada === 'herramienta' ? 'Herramienta' : 'Material',
      ...nuevaEntrada,
      cantidad: parseInt(nuevaEntrada.cantidad)
    }
    setEntradas([nueva, ...entradas])
    setShowForm(false)
    setNuevaEntrada({
      tipo: 'herramienta',
      nombre: '',
      codigo: '',
      cantidad: '',
      proveedor: '',
      responsable: '',
      fecha: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Registrar Entradas de Materiales y Herramientas</h1>
      
      <button
        onClick={() => setShowForm(true)}
        className="mb-6 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
      >
        <FiUpload /> Registrar Nueva Entrada
      </button>

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Registrar Entrada</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setTipoEntrada('herramienta')}
                className={`flex-1 py-2 rounded-lg ${tipoEntrada === 'herramienta' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Herramienta
              </button>
              <button
                onClick={() => setTipoEntrada('material')}
                className={`flex-1 py-2 rounded-lg ${tipoEntrada === 'material' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Material
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={nuevaEntrada.nombre}
                  onChange={(e) => setNuevaEntrada({...nuevaEntrada, nombre: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Código</label>
                <input
                  type="text"
                  value={nuevaEntrada.codigo}
                  onChange={(e) => setNuevaEntrada({...nuevaEntrada, codigo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  value={nuevaEntrada.cantidad}
                  onChange={(e) => setNuevaEntrada({...nuevaEntrada, cantidad: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Proveedor</label>
                <input
                  type="text"
                  value={nuevaEntrada.proveedor}
                  onChange={(e) => setNuevaEntrada({...nuevaEntrada, proveedor: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Responsable</label>
                <select
                  value={nuevaEntrada.responsable}
                  onChange={(e) => setNuevaEntrada({...nuevaEntrada, responsable: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Carlos Ruiz">Carlos Ruiz</option>
                  <option value="Ana López">Ana López</option>
                  <option value="Pedro Sánchez">Pedro Sánchez</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg">Guardar</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de Entradas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entradas.map(entrada => (
              <tr key={entrada.id}>
                <td className="px-6 py-4 whitespace-nowrap">{entrada.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    entrada.tipo === 'Herramienta' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {entrada.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{entrada.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entrada.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entrada.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entrada.proveedor}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entrada.responsable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Componente Registrar salidas de materiales y herramientas
const RegistrarSalidas = () => {
  const [salidas, setSalidas] = useState([
    { id: 1, tipo: 'Herramienta', nombre: 'Taladro Percutor', codigo: 'TAL-001', cantidad: 2, trabajador: 'Juan Pérez', obra: 'Edificio Central', fecha: '2024-01-15', autorizado: 'Carlos Ruiz' },
    { id: 2, tipo: 'Material', nombre: 'Cemento Gris', codigo: 'CEM-003', cantidad: 10, trabajador: 'Carlos López', obra: 'Puente Norte', fecha: '2024-01-14', autorizado: 'Ana López' },
    { id: 3, tipo: 'Herramienta', nombre: 'Martillo', codigo: 'MAR-002', cantidad: 3, trabajador: 'María García', obra: 'Edificio Central', fecha: '2024-01-13', autorizado: 'Carlos Ruiz' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [tipoSalida, setTipoSalida] = useState('herramienta')
  const [nuevaSalida, setNuevaSalida] = useState({
    tipo: 'herramienta',
    nombre: '',
    codigo: '',
    cantidad: '',
    trabajador: '',
    obra: '',
    autorizado: '',
    fecha: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const nueva = {
      id: salidas.length + 1,
      tipo: tipoSalida === 'herramienta' ? 'Herramienta' : 'Material',
      ...nuevaSalida,
      cantidad: parseInt(nuevaSalida.cantidad)
    }
    setSalidas([nueva, ...salidas])
    setShowForm(false)
    setNuevaSalida({
      tipo: 'herramienta',
      nombre: '',
      codigo: '',
      cantidad: '',
      trabajador: '',
      obra: '',
      autorizado: '',
      fecha: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Registrar Salidas de Materiales y Herramientas</h1>
      
      <button
        onClick={() => setShowForm(true)}
        className="mb-6 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
      >
        <FiDownload /> Registrar Nueva Salida
      </button>

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Registrar Salida</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setTipoSalida('herramienta')}
                className={`flex-1 py-2 rounded-lg ${tipoSalida === 'herramienta' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Herramienta
              </button>
              <button
                onClick={() => setTipoSalida('material')}
                className={`flex-1 py-2 rounded-lg ${tipoSalida === 'material' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Material
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={nuevaSalida.nombre}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, nombre: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Código</label>
                <input
                  type="text"
                  value={nuevaSalida.codigo}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, codigo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  value={nuevaSalida.cantidad}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, cantidad: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Trabajador</label>
                <select
                  value={nuevaSalida.trabajador}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, trabajador: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Juan Pérez">Juan Pérez</option>
                  <option value="Carlos López">Carlos López</option>
                  <option value="María García">María García</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Obra</label>
                <input
                  type="text"
                  value={nuevaSalida.obra}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, obra: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Autorizado por</label>
                <select
                  value={nuevaSalida.autorizado}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, autorizado: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Carlos Ruiz">Carlos Ruiz</option>
                  <option value="Ana López">Ana López</option>
                  <option value="Pedro Sánchez">Pedro Sánchez</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg">Guardar</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de Salidas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trabajador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Obra</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autorizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {salidas.map(salida => (
              <tr key={salida.id}>
                <td className="px-6 py-4 whitespace-nowrap">{salida.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    salida.tipo === 'Herramienta' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {salida.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{salida.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.trabajador}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.obra}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.autorizado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Componente Actualizar el estado de herramientas
const ActualizarEstadoHerramientas = () => {
  const [herramientas, setHerramientas] = useState([
    { id: 1, nombre: 'Taladro Percutor', codigo: 'TAL-001', estado: 'Bueno', ubicacion: 'Almacén A', ultimoMantenimiento: '2024-01-10', observaciones: '' },
    { id: 2, nombre: 'Martillo', codigo: 'MAR-002', estado: 'Mantenimiento', ubicacion: 'Taller', ultimoMantenimiento: '2024-01-05', observaciones: 'Requiere cambio de mango' },
    { id: 3, nombre: 'Sierra Circular', codigo: 'SIE-003', estado: 'Bueno', ubicacion: 'Almacén A', ultimoMantenimiento: '2024-01-12', observaciones: '' },
    { id: 4, nombre: 'Esmeril Angular', codigo: 'ESM-004', estado: 'Dañado', ubicacion: 'Taller', ultimoMantenimiento: '2023-12-20', observaciones: 'Motor quemado' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [herramientaEdit, setHerramientaEdit] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const estados = ['Bueno', 'Mantenimiento', 'Dañado', 'En reparación', 'Obsoleto']

  const handleEdit = (herramienta) => {
    setHerramientaEdit(herramienta)
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setHerramientas(herramientas.map(h => h.id === herramientaEdit.id ? herramientaEdit : h))
    setShowForm(false)
    setHerramientaEdit(null)
  }

  const herramientasFiltradas = herramientas.filter(h => {
    const matchesEstado = !filtroEstado || h.estado === filtroEstado
    const matchesBusqueda = !busqueda || 
      h.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      h.codigo.toLowerCase().includes(busqueda.toLowerCase())
    return matchesEstado && matchesBusqueda
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Actualizar Estado de Herramientas</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
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
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {estados.map(est => <option key={est}>{est}</option>)}
        </select>
      </div>

      {/* Formulario Modal */}
      {showForm && herramientaEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Actualizar Estado de Herramienta</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Herramienta</label>
                <input 
                  type="text" 
                  value={herramientaEdit.nombre} 
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100" 
                  readOnly 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Código</label>
                <input 
                  type="text" 
                  value={herramientaEdit.codigo} 
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100" 
                  readOnly 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Estado</label>
                <select
                  value={herramientaEdit.estado}
                  onChange={(e) => setHerramientaEdit({...herramientaEdit, estado: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {estados.map(est => <option key={est}>{est}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Ubicación</label>
                <input
                  type="text"
                  value={herramientaEdit.ubicacion}
                  onChange={(e) => setHerramientaEdit({...herramientaEdit, ubicacion: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Fecha último mantenimiento</label>
                <input
                  type="date"
                  value={herramientaEdit.ultimoMantenimiento}
                  onChange={(e) => setHerramientaEdit({...herramientaEdit, ultimoMantenimiento: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Observaciones</label>
                <textarea
                  value={herramientaEdit.observaciones}
                  onChange={(e) => setHerramientaEdit({...herramientaEdit, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg">Guardar</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de Herramientas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Herramienta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Mantenimiento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {herramientasFiltradas.map(herramienta => (
              <tr key={herramienta.id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{herramienta.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{herramienta.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    herramienta.estado === 'Bueno' ? 'bg-green-100 text-green-800' :
                    herramienta.estado === 'Mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                    herramienta.estado === 'Dañado' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {herramienta.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{herramienta.ubicacion}</td>
                <td className="px-6 py-4 whitespace-nowrap">{herramienta.ultimoMantenimiento}</td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{herramienta.observaciones}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => handleEdit(herramienta)}
                    className="bg-primary text-white px-3 py-1 rounded-lg text-sm hover:bg-opacity-90"
                  >
                    Actualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen de estados */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {estados.map(estado => {
          const count = herramientas.filter(h => h.estado === estado).length
          return (
            <div key={estado} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">{estado}</p>
              <p className="text-2xl font-bold text-primary">{count}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente Consultar inventario completo
const ConsultarInventario = () => {
  const [inventario] = useState([
    { id: 1, tipo: 'Herramienta', nombre: 'Taladro Percutor', codigo: 'TAL-001', cantidad: 15, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 2, tipo: 'Herramienta', nombre: 'Martillo', codigo: 'MAR-002', cantidad: 25, estado: 'Disponible', ubicacion: 'Almacén A' },
    { id: 3, tipo: 'Herramienta', nombre: 'Sierra Circular', codigo: 'SIE-003', cantidad: 8, estado: 'Mantenimiento', ubicacion: 'Taller' },
    { id: 4, tipo: 'Material', nombre: 'Cemento Gris', codigo: 'CEM-004', cantidad: 200, estado: 'Disponible', ubicacion: 'Almacén B' },
    { id: 5, tipo: 'Material', nombre: 'Varilla 3/8', codigo: 'VAR-005', cantidad: 150, estado: 'Disponible', ubicacion: 'Almacén B' },
    { id: 6, tipo: 'Material', nombre: 'Arena', codigo: 'ARE-006', cantidad: 500, estado: 'Disponible', ubicacion: 'Patio' },
    { id: 7, tipo: 'Herramienta', nombre: 'Esmeril Angular', codigo: 'ESM-007', cantidad: 5, estado: 'Dañado', ubicacion: 'Taller' },
    { id: 8, tipo: 'Herramienta', nombre: 'Taladro Inalámbrico', codigo: 'TAL-008', cantidad: 12, estado: 'Disponible', ubicacion: 'Almacén A' },
  ])

  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const inventarioFiltrado = inventario.filter(item => {
    const matchesTipo = !filtroTipo || item.tipo === filtroTipo
    const matchesEstado = !filtroEstado || item.estado === filtroEstado
    const matchesBusqueda = !busqueda || 
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.codigo.toLowerCase().includes(busqueda.toLowerCase())
    return matchesTipo && matchesEstado && matchesBusqueda
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Consultar Inventario Completo</h1>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <select 
          className="px-4 py-2 border rounded-lg"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Mantenimiento">Mantenimiento</option>
          <option value="Dañado">Dañado</option>
        </select>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventarioFiltrado.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.tipo === 'Herramienta' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {item.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{item.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{item.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                    item.estado === 'Mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.ubicacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen de inventario */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-2xl font-bold text-primary">{inventario.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Herramientas</p>
          <p className="text-2xl font-bold text-blue-600">
            {inventario.filter(i => i.tipo === 'Herramienta').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Materiales</p>
          <p className="text-2xl font-bold text-green-600">
            {inventario.filter(i => i.tipo === 'Material').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Items en Mantenimiento</p>
          <p className="text-2xl font-bold text-yellow-600">
            {inventario.filter(i => i.estado === 'Mantenimiento' || i.estado === 'Dañado').length}
          </p>
        </div>
      </div>
    </div>
  )
}

// Componente Consultar historial de movimientos
const ConsultarHistorial = () => {
  const [movimientos, setMovimientos] = useState([
    { id: 1, tipo: 'Entrada', fecha: '2024-01-15', concepto: 'Compra a proveedor', item: 'Taladro Percutor', cantidad: 5, responsable: 'Carlos Ruiz', observaciones: 'Factura #1234' },
    { id: 2, tipo: 'Salida', fecha: '2024-01-15', concepto: 'Asignación a obra', item: 'Martillo', cantidad: 2, responsable: 'Juan Pérez', observaciones: 'Obra Edificio Central' },
    { id: 3, tipo: 'Entrada', fecha: '2024-01-14', concepto: 'Devolución', item: 'Taladro Percutor', cantidad: 1, responsable: 'Carlos López', observaciones: 'Equipo en buen estado' },
    { id: 4, tipo: 'Salida', fecha: '2024-01-14', concepto: 'Préstamo', item: 'Cemento Gris', cantidad: 10, responsable: 'María García', observaciones: 'Obra Puente Norte' },
    { id: 5, tipo: 'Entrada', fecha: '2024-01-13', concepto: 'Compra a proveedor', item: 'Varilla 3/8', cantidad: 50, responsable: 'Ana López', observaciones: 'Factura #5678' },
    { id: 6, tipo: 'Salida', fecha: '2024-01-13', concepto: 'Mantenimiento', item: 'Sierra Circular', cantidad: 1, responsable: 'Taller', observaciones: 'Envío a mantenimiento' },
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
      mov.item.toLowerCase().includes(busqueda.toLowerCase()) ||
      mov.concepto.toLowerCase().includes(busqueda.toLowerCase()) ||
      mov.responsable.toLowerCase().includes(busqueda.toLowerCase())
    return matchesTipo && matchesFecha && matchesBusqueda
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Consultar Historial de Movimientos</h1>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por item, concepto o responsable..."
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
          <option value="Entrada">Entradas</option>
          <option value="Salida">Salidas</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movimientosFiltrados.map(mov => (
              <tr key={mov.id}>
                <td className="px-6 py-4 whitespace-nowrap">{mov.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    mov.tipo === 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {mov.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.concepto}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{mov.item}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.responsable}</td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{mov.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen de movimientos */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Movimientos</p>
          <p className="text-2xl font-bold text-primary">{movimientos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Entradas</p>
          <p className="text-2xl font-bold text-green-600">
            {movimientos.filter(m => m.tipo === 'Entrada').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Salidas</p>
          <p className="text-2xl font-bold text-blue-600">
            {movimientos.filter(m => m.tipo === 'Salida').length}
          </p>
        </div>
      </div>
    </div>
  )
}

// Layout principal del panel de oficina
const OficinaLayout = ({ selectedMenu, setSelectedMenu, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menus = [
    { id: 'entradas', name: 'Registrar Entradas', icon: FiUpload },
    { id: 'salidas', name: 'Registrar Salidas', icon: FiDownload },
    { id: 'estado-herramientas', name: 'Actualizar Estado Herramientas', icon: FiRefreshCw },
    { id: 'inventario', name: 'Consultar Inventario', icon: FiArchive },
    { id: 'historial', name: 'Consultar Historial', icon: FiCalendar },
  ]

  const renderContent = () => {
    switch(selectedMenu) {
      case 'entradas':
        return <RegistrarEntradas />
      case 'salidas':
        return <RegistrarSalidas />
      case 'estado-herramientas':
        return <ActualizarEstadoHerramientas />
      case 'inventario':
        return <ConsultarInventario />
      case 'historial':
        return <ConsultarHistorial />
      default:
        return <ConsultarInventario />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white transition-all duration-300 ease-in-out flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">Panel Oficina</h2>}
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

// Componente principal OficinaPanel
const OficinaPanel = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState('inventario')

  useEffect(() => {
    const oficinaStatus = localStorage.getItem('isOficina')
    if (oficinaStatus === 'true') {
      setIsAuthenticated(true)
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isOficina')
    navigate('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de oficina...</p>
        </div>
      </div>
    )
  }

  return (
    <OficinaLayout 
      selectedMenu={selectedMenu} 
      setSelectedMenu={setSelectedMenu} 
      onLogout={handleLogout} 
    />
  )
}

export default OficinaPanel