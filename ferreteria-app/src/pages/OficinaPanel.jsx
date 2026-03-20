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
  FiArchive,
  FiCalendar,
  FiChevronRight,
  FiHash,
  FiTag,
  FiBriefcase,
  FiFileText
} from 'react-icons/fi'

// Componente Registrar entradas de materiales y herramientas
const RegistrarEntradas = () => {
  const [entradas, setEntradas] = useState([
    { 
      id: 1, 
      nombre: 'Taladro Percutor', 
      marca: 'Bosch', 
      numeroSerie: 'TAL-001-2024-001',
      fechaAlta: '2024-01-15',
      estado: 'activo',
      observaciones: 'Herramienta nueva en perfecto estado',
      responsable: 'Carlos Ruiz'
    },
    { 
      id: 2, 
      nombre: 'Martillo', 
      marca: 'Stanley', 
      numeroSerie: 'MAR-002-2024-015',
      fechaAlta: '2024-01-14',
      estado: 'activo',
      observaciones: '',
      responsable: 'Ana López'
    },
    { 
      id: 3, 
      nombre: 'Cemento Gris', 
      marca: 'Cementos MX', 
      numeroSerie: 'CEM-003-2024-089',
      fechaAlta: '2024-01-13',
      estado: 'activo',
      observaciones: 'Lote 2024-01, 50kg',
      responsable: 'Carlos Ruiz'
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [nuevaEntrada, setNuevaEntrada] = useState({
    nombre: '',
    marca: '',
    numeroSerie: '',
    fechaAlta: new Date().toISOString().split('T')[0],
    estado: 'activo',
    observaciones: '',
    responsable: ''
  })

  const estados = ['activo', 'en uso', 'en reparación', 'dado de baja']

  const handleSubmit = (e) => {
    e.preventDefault()
    const nueva = {
      id: entradas.length + 1,
      ...nuevaEntrada
    }
    setEntradas([nueva, ...entradas])
    setShowForm(false)
    setNuevaEntrada({
      nombre: '',
      marca: '',
      numeroSerie: '',
      fechaAlta: new Date().toISOString().split('T')[0],
      estado: 'activo',
      observaciones: '',
      responsable: ''
    })
  }

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'en uso': return 'bg-blue-100 text-blue-800'
      case 'en reparación': return 'bg-yellow-100 text-yellow-800'
      case 'dado de baja': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nombre *</label>
                <div className="relative">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={nuevaEntrada.nombre}
                    onChange={(e) => setNuevaEntrada({...nuevaEntrada, nombre: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Marca *</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={nuevaEntrada.marca}
                    onChange={(e) => setNuevaEntrada({...nuevaEntrada, marca: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div> 
 
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Número de Serie *</label>
                <div className="relative">
                  <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={nuevaEntrada.numeroSerie}
                    onChange={(e) => setNuevaEntrada({...nuevaEntrada, numeroSerie: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    required
                    placeholder="Ej: TAL-001-2024-001"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Fecha de Alta *</label>
                <input
                  type="date"
                  value={nuevaEntrada.fechaAlta}
                  onChange={(e) => setNuevaEntrada({...nuevaEntrada, fechaAlta: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Estado *</label>
                <select
                  value={nuevaEntrada.estado}
                  onChange={(e) => setNuevaEntrada({...nuevaEntrada, estado: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  {estados.map(est => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Responsable *</label>
                <select
                  value={nuevaEntrada.responsable}
                  onChange={(e) => setNuevaEntrada({...nuevaEntrada, responsable: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccionar responsable</option>
                  <option value="Carlos Ruiz">Carlos Ruiz</option>
                  <option value="Ana López">Ana López</option>
                  <option value="Pedro Sánchez">Pedro Sánchez</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Observaciones</label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={nuevaEntrada.observaciones}
                    onChange={(e) => setNuevaEntrada({...nuevaEntrada, observaciones: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    rows="3"
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-opacity-90">
                  Guardar
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
                  Cancelar
                </button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número de Serie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Alta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entradas.map(entrada => (
              <tr key={entrada.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{entrada.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{entrada.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entrada.marca}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{entrada.numeroSerie}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entrada.fechaAlta}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(entrada.estado)}`}>
                    {entrada.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{entrada.observaciones || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entrada.responsable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entradas.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No hay entradas registradas</p>
        </div>
      )}
    </div>
  )
}

// Componente Registrar salidas de materiales y herramientas
const RegistrarSalidas = () => {
  const [salidas, setSalidas] = useState([
    { 
      id: 1, 
      nombre: 'Taladro Percutor', 
      marca: 'Bosch', 
      numeroSerie: 'TAL-001-2024-001',
      fechaSalida: '2024-01-15',
      estado: 'en uso',
      observaciones: 'Asignado a obra Edificio Central',
      trabajador: 'Juan Pérez',
      autorizado: 'Carlos Ruiz'
    },
    { 
      id: 2, 
      nombre: 'Martillo', 
      marca: 'Stanley', 
      numeroSerie: 'MAR-002-2024-015',
      fechaSalida: '2024-01-14',
      estado: 'en uso',
      observaciones: '',
      trabajador: 'Carlos López',
      autorizado: 'Ana López'
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [nuevaSalida, setNuevaSalida] = useState({
    nombre: '',
    marca: '',
    numeroSerie: '',
    fechaSalida: new Date().toISOString().split('T')[0],
    estado: 'en uso',
    observaciones: '',
    trabajador: '',
    autorizado: ''
  })

  const estados = ['activo', 'en uso', 'en reparación', 'dado de baja']

  const handleSubmit = (e) => {
    e.preventDefault()
    const nueva = {
      id: salidas.length + 1,
      ...nuevaSalida
    }
    setSalidas([nueva, ...salidas])
    setShowForm(false)
    setNuevaSalida({
      nombre: '',
      marca: '',
      numeroSerie: '',
      fechaSalida: new Date().toISOString().split('T')[0],
      estado: 'en uso',
      observaciones: '',
      trabajador: '',
      autorizado: ''
    })
  }

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'en uso': return 'bg-blue-100 text-blue-800'
      case 'en reparación': return 'bg-yellow-100 text-yellow-800'
      case 'dado de baja': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nombre *</label>
                <div className="relative">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={nuevaSalida.nombre}
                    onChange={(e) => setNuevaSalida({...nuevaSalida, nombre: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Marca *</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={nuevaSalida.marca}
                    onChange={(e) => setNuevaSalida({...nuevaSalida, marca: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Número de Serie *</label>
                <div className="relative">
                  <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={nuevaSalida.numeroSerie}
                    onChange={(e) => setNuevaSalida({...nuevaSalida, numeroSerie: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    required
                    placeholder="Ej: TAL-001-2024-001"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Fecha de Salida *</label>
                <input
                  type="date"
                  value={nuevaSalida.fechaSalida}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, fechaSalida: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Estado *</label>
                <select
                  value={nuevaSalida.estado}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, estado: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  {estados.map(est => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Trabajador *</label>
                <select
                  value={nuevaSalida.trabajador}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, trabajador: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
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
                <label className="block text-gray-700 mb-2">Autorizado por *</label>
                <select
                  value={nuevaSalida.autorizado}
                  onChange={(e) => setNuevaSalida({...nuevaSalida, autorizado: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccionar autorizante</option>
                  <option value="Carlos Ruiz">Carlos Ruiz</option>
                  <option value="Ana López">Ana López</option>
                  <option value="Pedro Sánchez">Pedro Sánchez</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Observaciones</label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={nuevaSalida.observaciones}
                    onChange={(e) => setNuevaSalida({...nuevaSalida, observaciones: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    rows="3"
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-opacity-90">
                  Registrar Salida
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
                  Cancelar
                </button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número de Serie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Salida</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trabajador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autorizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {salidas.map(salida => (
              <tr key={salida.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{salida.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{salida.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.marca}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{salida.numeroSerie}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.fechaSalida}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(salida.estado)}`}>
                    {salida.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{salida.observaciones || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.trabajador}</td>
                <td className="px-6 py-4 whitespace-nowrap">{salida.autorizado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {salidas.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No hay salidas registradas</p>
        </div>
      )}
    </div>
  )
}

// Componente Actualizar el estado de herramientas
const ActualizarEstadoHerramientas = () => {
  const [herramientas, setHerramientas] = useState([
    { id: 1, nombre: 'Taladro Percutor', codigo: 'TAL-001', estado: 'activo', ubicacion: 'Almacén A', ultimoMantenimiento: '2024-01-10', observaciones: '' },
    { id: 2, nombre: 'Martillo', codigo: 'MAR-002', estado: 'en reparación', ubicacion: 'Taller', ultimoMantenimiento: '2024-01-05', observaciones: 'Requiere cambio de mango' },
    { id: 3, nombre: 'Sierra Circular', codigo: 'SIE-003', estado: 'activo', ubicacion: 'Almacén A', ultimoMantenimiento: '2024-01-12', observaciones: '' },
    { id: 4, nombre: 'Esmeril Angular', codigo: 'ESM-004', estado: 'dado de baja', ubicacion: 'Taller', ultimoMantenimiento: '2023-12-20', observaciones: 'Motor quemado' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [herramientaEdit, setHerramientaEdit] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const estados = ['activo', 'en uso', 'en reparación', 'dado de baja']

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

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'en uso': return 'bg-blue-100 text-blue-800'
      case 'en reparación': return 'bg-yellow-100 text-yellow-800'
      case 'dado de baja': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
            placeholder="Buscar herramienta por nombre o numero de serie..."
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
                <label className="block text-gray-700 mb-2">Numero serie</label>
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
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-opacity-90">Guardar</button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numero serie</th>
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
                  <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(herramienta.estado)}`}>
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
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {estados.map(estado => {
          const count = herramientas.filter(h => h.estado === estado).length
          return (
            <div key={estado} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500 capitalize">{estado}</p>
              <p className="text-2xl font-bold text-primary">{count}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente Consultar inventario completo (sin cambios)
const ConsultarInventario = () => {
  const [inventario] = useState([
    { id: 1, tipo: 'Herramienta', nombre: 'Taladro Percutor', codigo: 'TAL-001', cantidad: 15, estado: 'activo', ubicacion: 'Almacén A' },
    { id: 2, tipo: 'Herramienta', nombre: 'Martillo', codigo: 'MAR-002', cantidad: 25, estado: 'activo', ubicacion: 'Almacén A' },
    { id: 3, tipo: 'Herramienta', nombre: 'Sierra Circular', codigo: 'SIE-003', cantidad: 8, estado: 'en reparación', ubicacion: 'Taller' },
    { id: 4, tipo: 'Material', nombre: 'Cemento Gris', codigo: 'CEM-004', cantidad: 200, estado: 'activo', ubicacion: 'Almacén B' },
    { id: 5, tipo: 'Material', nombre: 'Varilla 3/8', codigo: 'VAR-005', cantidad: 150, estado: 'activo', ubicacion: 'Almacén B' },
    { id: 6, tipo: 'Material', nombre: 'Arena', codigo: 'ARE-006', cantidad: 500, estado: 'activo', ubicacion: 'Patio' },
    { id: 7, tipo: 'Herramienta', nombre: 'Esmeril Angular', codigo: 'ESM-007', cantidad: 5, estado: 'dado de baja', ubicacion: 'Taller' },
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

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'en uso': return 'bg-blue-100 text-blue-800'
      case 'en reparación': return 'bg-yellow-100 text-yellow-800'
      case 'dado de baja': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Consultar Inventario Completo</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o numero de serie..."
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
          {['activo', 'en uso', 'en reparación', 'dado de baja'].map(est => (
            <option key={est} value={est}>{est}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numero de Serie</th>
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
                  <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(item.estado)}`}>
                    {item.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.ubicacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Componente Consultar historial de movimientos (sin cambios)
const ConsultarHistorial = () => {
  const [movimientos, setMovimientos] = useState([
    { id: 1, tipo: 'Entrada', fecha: '2024-01-15', concepto: 'Compra a proveedor', item: 'Taladro Percutor', cantidad: 5, responsable: 'Carlos Ruiz', observaciones: 'Factura #1234' },
    { id: 2, tipo: 'Salida', fecha: '2024-01-15', concepto: 'Asignación a obra', item: 'Martillo', cantidad: 2, responsable: 'Juan Pérez', observaciones: 'Obra Edificio Central' },
    { id: 3, tipo: 'Entrada', fecha: '2024-01-14', concepto: 'Devolución', item: 'Taladro Percutor', cantidad: 1, responsable: 'Carlos López', observaciones: 'Equipo en buen estado' },
    { id: 4, tipo: 'Salida', fecha: '2024-01-14', concepto: 'Préstamo', item: 'Cemento Gris', cantidad: 10, responsable: 'María García', observaciones: 'Obra Puente Norte' },
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
          <option value="">Todos</option>
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
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