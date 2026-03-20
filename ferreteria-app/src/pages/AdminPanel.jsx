import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FiMonitor, 
  FiTool, 
  FiPackage, 
  FiUsers, 
  FiLogOut,
  FiMenu,
  FiX,
  FiUserPlus,
  FiSearch,
  FiChevronRight,
  FiUpload,
  FiDownload,
  FiRefreshCw,
  FiArchive,
  FiCalendar,
  FiBriefcase,
  FiUser,
  FiHash,
  FiTag,
  FiFileText,
  FiClock
} from 'react-icons/fi'

// ==================== COMPONENTES DE ADMIN ====================

// Componente Monitoreo
const Monitoreo = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Monitoreo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Préstamos del Día</h3>
          <p className="text-3xl font-bold text-primary">156</p>
          <p className="text-sm text-gray-500 mt-2">23 herramientas prestadas</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Herramientas en Uso</h3>
          <p className="text-3xl font-bold text-primary">89</p>
          <p className="text-sm text-gray-500 mt-2">42 trabajadores</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Stock Bajo</h3>
          <p className="text-3xl font-bold text-red-600">8</p>
          <p className="text-sm text-gray-500 mt-2">Productos por reabastecer</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Préstamos Recientes</h3>
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Préstamo #{i}234</p>
                <p className="text-sm text-gray-500">Juan Pérez - Taladro Percutor</p>
              </div>
              <p className="text-sm text-gray-500">Hace {i} hora(s)</p>
            </div>
          ))}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numero de serie</th>
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
      <h1 className="text-3xl font-bold mb-8">Inventario Completo</h1>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en inventario..."
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
          <option value="activo">Activo</option>
          <option value="en uso">En uso</option>
          <option value="en reparación">En reparación</option>
          <option value="dado de baja">Dado de baja</option>
        </select>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
          + Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numero de serie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
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
                <td className="px-6 py-4 whitespace-nowrap">
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

// Componente Usuario (con ABM completo)
const Usuario = () => {
  const [usuarios, setUsuarios] = useState(() => {
    const saved = localStorage.getItem('usuarios')
    const usuariosPorDefecto = [
      { 
        id: 1, 
        nombre: 'Administrador', 
        email: 'admin@ferreteria.com', 
        username: 'admin', 
        password: 'admin123',
        tipo: 'admin', 
        area: '',
        estado: 'Activo',
        fechaRegistro: '2024-01-01'
      },
      { 
        id: 2, 
        nombre: 'Carlos Ruiz', 
        email: 'carlos@ferreteria.com', 
        username: 'oficina', 
        password: 'oficina123',
        tipo: 'oficina', 
        area: '',
        estado: 'Activo',
        fechaRegistro: '2024-01-15'
      },
      { 
        id: 3, 
        nombre: 'Ana López', 
        email: 'ana@ferreteria.com', 
        username: 'area', 
        password: 'area123',
        tipo: 'area', 
        area: 'construccion',
        estado: 'Activo',
        fechaRegistro: '2024-01-20'
      },
      { 
        id: 4, 
        nombre: 'Juan Pérez', 
        email: 'juan@ferreteria.com', 
        username: 'trabajador', 
        password: 'trabajador123',
        tipo: 'trabajador', 
        area: '',
        estado: 'Activo',
        fechaRegistro: '2024-02-01'
      },
    ]
    return saved ? JSON.parse(saved) : usuariosPorDefecto
  })

  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    username: '',
    password: '',
    tipo: 'trabajador',
    area: '',
    estado: 'Activo'
  })

  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
  }, [usuarios])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      username: '',
      password: '',
      tipo: 'trabajador',
      area: '',
      estado: 'Activo'
    })
    setEditingUser(null)
  }

  const handleEdit = (usuario) => {
    setEditingUser(usuario)
    setFormData({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      username: usuario.username || '',
      password: '',
      tipo: usuario.tipo || 'trabajador',
      area: usuario.area || '',
      estado: usuario.estado || 'Activo'
    })
    setShowUserModal(true)
  }

  const handleDelete = (usuario) => {
    setUserToDelete(usuario)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      if (userToDelete.username === 'admin') {
        alert('No se puede eliminar al administrador principal')
        setShowDeleteConfirm(false)
        setUserToDelete(null)
        return
      }

      const nuevosUsuarios = usuarios.filter(u => u.id !== userToDelete.id)
      setUsuarios(nuevosUsuarios)
      setShowDeleteConfirm(false)
      setUserToDelete(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.nombre || !formData.email || !formData.username) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingresa un email válido')
      return
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return
    }

    const usernameExists = usuarios.some(u => 
      u.username === formData.username && u.id !== (editingUser?.id || -1)
    )
    if (usernameExists) {
      alert('El nombre de usuario ya existe')
      return
    }

    if (editingUser) {
      const updatedUser = {
        ...editingUser,
        nombre: formData.nombre,
        email: formData.email,
        username: formData.username,
        tipo: formData.tipo,
        area: formData.area,
        estado: formData.estado,
        password: formData.password || editingUser.password
      }

      setUsuarios(usuarios.map(u => 
        u.id === editingUser.id ? updatedUser : u
      ))
      alert('Usuario actualizado exitosamente')
    } else {
      const nuevoUsuario = {
        id: usuarios.length + 1,
        ...formData,
        password: formData.password,
        fechaRegistro: new Date().toISOString().split('T')[0]
      }
      setUsuarios([...usuarios, nuevoUsuario])
      alert('Usuario creado exitosamente')
    }

    setShowUserModal(false)
    resetForm()
  }

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchesSearch = !searchTerm || 
      usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTipo = !filtroTipo || usuario.tipo === filtroTipo
    const matchesEstado = !filtroEstado || usuario.estado === filtroEstado
    
    return matchesSearch && matchesTipo && matchesEstado
  })

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'oficina': return 'bg-blue-100 text-blue-800'
      case 'area': return 'bg-green-100 text-green-800'
      case 'trabajador': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoNombre = (tipo) => {
    switch(tipo) {
      case 'admin': return 'Administrador'
      case 'oficina': return 'Oficina'
      case 'area': return 'Encargado de Área'
      case 'trabajador': return 'Trabajador'
      default: return tipo
    }
  }

  const getAreaNombre = (area) => {
    const areas = {
      'construccion': 'Construcción',
      'electricidad': 'Electricidad',
      'plomeria': 'Plomería',
      'pintura': 'Pintura',
      'mantenimiento': 'Mantenimiento'
    }
    return areas[area] || area
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={() => {
            resetForm()
            setShowUserModal(true)
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <FiUserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o usuario..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border rounded-lg"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="admin">Administradores</option>
          <option value="oficina">Oficina</option>
          <option value="area">Encargados de Área</option>
          <option value="trabajador">Trabajadores</option>
        </select>
        <select 
          className="px-4 py-2 border rounded-lg"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Activo">Activos</option>
          <option value="Inactivo">Inactivos</option>
          <option value="Bloqueado">Bloqueados</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Registro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuariosFiltrados.map(usuario => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {usuario.nombre?.charAt(0) || usuario.username?.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                      <div className="text-sm text-gray-500">@{usuario.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTipoColor(usuario.tipo)}`}>
                    {getTipoNombre(usuario.tipo)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {usuario.area ? getAreaNombre(usuario.area) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    usuario.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                    usuario.estado === 'Inactivo' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {usuario.estado || 'Activo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {usuario.fechaRegistro || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => handleEdit(usuario)}
                    className="text-primary hover:text-primary-dark mr-3"
                    title="Editar"
                  >
                    Editar
                  </button>
                  {usuario.username !== 'admin' && (
                    <button 
                      onClick={() => handleDelete(usuario)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuariosFiltrados.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Modal de Usuario */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button 
                onClick={() => {
                  setShowUserModal(false)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Usuario *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  {editingUser ? 'Nueva Contraseña (dejar en blanco para mantener)' : 'Contraseña *'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  minLength={editingUser && !formData.password ? 0 : 6}
                  required={!editingUser}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tipo de Usuario *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="trabajador">Trabajador</option>
                  <option value="area">Encargado de Área</option>
                  <option value="oficina">Encargado de Oficina</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {formData.tipo === 'area' && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Área de Trabajo *</label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Seleccionar área</option>
                    <option value="construccion">Construcción</option>
                    <option value="electricidad">Electricidad</option>
                    <option value="plomeria">Plomería</option>
                    <option value="pintura">Pintura</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </select>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Bloqueado">Bloqueado</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas eliminar al usuario <strong>{userToDelete?.nombre}</strong>?
            </p>
            <div className="flex gap-2">
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2 rounded-lg">
                Eliminar
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== COMPONENTES DE OFICINA (COMPLETOS) ====================

// Registrar Entradas (Oficina)
const RegistrarEntradasOficina = () => {
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Serie</th>
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
    </div>
  )
}

// Registrar Salidas (Oficina)
const RegistrarSalidasOficina = () => {
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-xl font-bold mb-4">Registrar Salida</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Nombre" className="w-full mb-2 p-2 border rounded" 
                onChange={(e) => setNuevaSalida({...nuevaSalida, nombre: e.target.value})} required />
              <input type="text" placeholder="Marca" className="w-full mb-2 p-2 border rounded"
                onChange={(e) => setNuevaSalida({...nuevaSalida, marca: e.target.value})} required />
              <input type="text" placeholder="Número de Serie" className="w-full mb-2 p-2 border rounded"
                onChange={(e) => setNuevaSalida({...nuevaSalida, numeroSerie: e.target.value})} required />
              <select className="w-full mb-2 p-2 border rounded" onChange={(e) => setNuevaSalida({...nuevaSalida, estado: e.target.value})}>
                {estados.map(est => <option key={est}>{est}</option>)}
              </select>
              <input type="text" placeholder="Trabajador" className="w-full mb-2 p-2 border rounded"
                onChange={(e) => setNuevaSalida({...nuevaSalida, trabajador: e.target.value})} required />
              <textarea placeholder="Observaciones" className="w-full mb-2 p-2 border rounded"
                onChange={(e) => setNuevaSalida({...nuevaSalida, observaciones: e.target.value})} />
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Guardar</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Marca</th>
              <th className="px-4 py-2">N° Serie</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Trabajador</th>
            </tr>
          </thead>
          <tbody>
            {salidas.map(s => (
              <tr key={s.id}>
                <td className="border px-4 py-2">{s.nombre}</td>
                <td className="border px-4 py-2">{s.marca}</td>
                <td className="border px-4 py-2">{s.numeroSerie}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(s.estado)}`}>
                    {s.estado}
                  </span>
                </td>
                <td className="border px-4 py-2">{s.trabajador}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Actualizar Estado Herramientas (Oficina)
const ActualizarEstadoOficina = () => {
  const [herramientas, setHerramientas] = useState([
    { id: 1, nombre: 'Taladro Percutor', codigo: 'TAL-001', estado: 'activo', ubicacion: 'Almacén A' },
    { id: 2, nombre: 'Martillo', codigo: 'MAR-002', estado: 'en reparación', ubicacion: 'Taller' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [herramientaEdit, setHerramientaEdit] = useState(null)

  const estados = ['activo', 'en uso', 'en reparación', 'dado de baja']

  const handleEdit = (herramienta) => {
    setHerramientaEdit(herramienta)
    setShowForm(true)
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
      <h1 className="text-3xl font-bold mb-8">Actualizar Estado de Herramientas</h1>

      <div className="mb-4 flex gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar herramienta..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
      </div>

      {showForm && herramientaEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-xl font-bold mb-4">Actualizar Estado</h2>
            <select className="w-full mb-4 p-2 border rounded" 
              onChange={(e) => setHerramientaEdit({...herramientaEdit, estado: e.target.value})}>
              {estados.map(est => <option key={est}>{est}</option>)}
            </select>
            <button className="bg-primary text-white px-4 py-2 rounded">Guardar</button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Numero de serie</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {herramientas.map(h => (
            <tr key={h.id}>
              <td className="border px-4 py-2">{h.codigo}</td>
              <td className="border px-4 py-2">{h.nombre}</td>
              <td className="border px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(h.estado)}`}>
                  {h.estado}
                </span>
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(h)} className="text-primary">Actualizar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Consultar Inventario (Oficina) - Reutilizamos el componente Inventario de admin
const ConsultarInventarioOficina = Inventario

// Consultar Historial (Oficina)
const ConsultarHistorialOficina = () => {
  const [movimientos] = useState([
    { id: 1, tipo: 'Entrada', fecha: '2024-01-15', concepto: 'Compra', item: 'Taladro Percutor', cantidad: 5, responsable: 'Carlos Ruiz' },
    { id: 2, tipo: 'Salida', fecha: '2024-01-15', concepto: 'Préstamo', item: 'Martillo', cantidad: 2, responsable: 'Juan Pérez' },
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Historial de Movimientos</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Concepto</th>
            <th className="px-4 py-2">Producto</th>
            <th className="px-4 py-2">Cantidad</th>
            <th className="px-4 py-2">Responsable</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map(m => (
            <tr key={m.id}>
              <td className="border px-4 py-2">{m.fecha}</td>
              <td className="border px-4 py-2">{m.tipo}</td>
              <td className="border px-4 py-2">{m.concepto}</td>
              <td className="border px-4 py-2">{m.item}</td>
              <td className="border px-4 py-2">{m.cantidad}</td>
              <td className="border px-4 py-2">{m.responsable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ==================== COMPONENTES DE ÁREA ====================

// Inventario Disponible (Área)
const InventarioArea = () => {
  const [inventario] = useState([
    { id: 1, nombre: 'Taladro Percutor', codigo: 'TAL-001', cantidad: 15, estado: 'disponible' },
    { id: 2, nombre: 'Martillo', codigo: 'MAR-002', cantidad: 25, estado: 'disponible' },
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Inventario Disponible - Mi Área</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {inventario.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold">{item.nombre}</h3>
            <p className="text-gray-600">Numero de serie: {item.codigo}</p>
            <p className="text-2xl font-bold text-primary mt-4">{item.cantidad} disponibles</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Registrar Salidas (Área)
const SalidasArea = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Registrar Salidas - Mi Área</h1>
      <p className="text-gray-600">Formulario para registrar salidas del área...</p>
    </div>
  )
}

// Historial (Área)
const HistorialArea = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Historial de Mi Área</h1>
      <p className="text-gray-600">Historial de movimientos del área...</p>
    </div>
  )
}

// ==================== COMPONENTES DE TRABAJADOR ====================

// Inventario Trabajador
const InventarioTrabajador = () => {
  const [inventario] = useState([
    { id: 1, nombre: 'Taladro Percutor', codigo: 'TAL-001', disponible: 15 },
    { id: 2, nombre: 'Martillo', codigo: 'MAR-002', disponible: 25 },
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Inventario Disponible</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {inventario.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold">{item.nombre}</h3>
            <p className="text-gray-600">Numero de serie: {item.codigo}</p>
            <p className="text-2xl font-bold text-primary mt-4">{item.disponible} disponibles</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Historial Personal Trabajador
const HistorialPersonal = () => {
  const [historial] = useState([
    { id: 1, herramienta: 'Taladro Percutor', fecha: '2024-01-15', estado: 'Devuelto' },
    { id: 2, herramienta: 'Martillo', fecha: '2024-01-14', estado: 'En uso' },
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mi Historial Personal</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Herramienta</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {historial.map(h => (
            <tr key={h.id}>
              <td className="border px-4 py-2">{h.herramienta}</td>
              <td className="border px-4 py-2">{h.fecha}</td>
              <td className="border px-4 py-2">{h.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ==================== LAYOUT PRINCIPAL ====================

const AdminLayout = ({ selectedMenu, setSelectedMenu, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Menús organizados por categoría (sin Módulos)
  const menus = [
    { 
      category: 'Administración',
      items: [
        { id: 'monitoreo', name: 'Monitoreo', icon: FiMonitor },
        { id: 'material-herramientas', name: 'Material/Herramientas', icon: FiTool },
        { id: 'inventario', name: 'Inventario', icon: FiPackage },
        { id: 'usuarios', name: 'Usuarios', icon: FiUsers },
      ]
    },
    {
      category: 'Oficina',
      items: [
        { id: 'oficina-entradas', name: 'Registrar Entradas', icon: FiUpload },
        { id: 'oficina-salidas', name: 'Registrar Salidas', icon: FiDownload },
        { id: 'oficina-estado', name: 'Actualizar Estado', icon: FiRefreshCw },
        { id: 'oficina-inventario', name: 'Consultar Inventario', icon: FiArchive },
        { id: 'oficina-historial', name: 'Consultar Historial', icon: FiCalendar },
      ]
    },
    {
      category: 'Área',
      items: [
        { id: 'area-inventario', name: 'Inventario Disponible', icon: FiBriefcase },
        { id: 'area-salidas', name: 'Registrar Salidas', icon: FiDownload },
        { id: 'area-historial', name: 'Historial del Área', icon: FiCalendar },
      ]
    },
    {
      category: 'Trabajador',
      items: [
        { id: 'trabajador-inventario', name: 'Inventario Disponible', icon: FiPackage },
        { id: 'trabajador-historial', name: 'Mi Historial', icon: FiUser },
      ]
    }
  ]

  const renderContent = () => {
    switch(selectedMenu) {
      // Admin
      case 'monitoreo': return <Monitoreo />
      case 'material-herramientas': return <MaterialHerramientas />
      case 'inventario': return <Inventario />
      case 'usuarios': return <Usuario />
      
      // Oficina
      case 'oficina-entradas': return <RegistrarEntradasOficina />
      case 'oficina-salidas': return <RegistrarSalidasOficina />
      case 'oficina-estado': return <ActualizarEstadoOficina />
      case 'oficina-inventario': return <ConsultarInventarioOficina />
      case 'oficina-historial': return <ConsultarHistorialOficina />
      
      // Área
      case 'area-inventario': return <InventarioArea />
      case 'area-salidas': return <SalidasArea />
      case 'area-historial': return <HistorialArea />
      
      // Trabajador
      case 'trabajador-inventario': return <InventarioTrabajador />
      case 'trabajador-historial': return <HistorialPersonal />
      
      default: return <Monitoreo />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-primary text-white transition-all duration-300 ease-in-out flex flex-col overflow-y-auto`}>
        <div className="p-4 flex items-center justify-between sticky top-0 bg-primary">
          {sidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-primary-dark rounded-lg">
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-4 pb-8">
          {menus.map((category, idx) => (
            <div key={idx} className="mb-6">
              {sidebarOpen && (
                <div className="px-4 py-2 text-xs font-semibold text-primary-light uppercase tracking-wider">
                  {category.category}
                </div>
              )}
              {category.items.map(menu => {
                const Icon = menu.icon
                return (
                  <button
                    key={menu.id}
                    onClick={() => setSelectedMenu(menu.id)}
                    className={`w-full flex items-center px-4 py-2 mb-1 transition-colors ${
                      selectedMenu === menu.id 
                        ? 'bg-primary-dark border-l-4 border-white' 
                        : 'hover:bg-primary-dark'
                    }`}
                    title={!sidebarOpen ? menu.name : ''}
                  >
                    <Icon size={20} />
                    {sidebarOpen && (
                      <>
                        <span className="ml-3 flex-1 text-left text-sm">{menu.name}</span>
                        <FiChevronRight size={16} />
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <button onClick={onLogout} className="flex items-center px-4 py-3 hover:bg-primary-dark transition-colors sticky bottom-0 bg-primary">
          <FiLogOut size={20} />
          {sidebarOpen && <span className="ml-3">Cerrar Sesión</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {renderContent()}
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
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