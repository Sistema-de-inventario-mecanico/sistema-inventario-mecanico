import React, { useState } from 'react'
import { 
  FiSearch, 
  FiShoppingCart, 
  FiLogIn,
  FiHome,
  FiPackage,
  FiInfo,
  FiMenu,
  FiX,
  FiChevronRight
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: ''
  })

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'herramientas', name: 'Herramientas' },
    { id: 'construccion', name: 'Construcción' },
    { id: 'electricidad', name: 'Electricidad' },
    { id: 'plomeria', name: 'Plomería' },
    { id: 'pinturas', name: 'Pinturas' },
  ]

  const products = [
    {
      id: 1,
      name: 'Martillo Profesional',
      price: 'Disponible',
      category: 'herramientas',
      image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      description: 'Martillo de acero forjado con mango ergonómico'
    },
    {
      id: 2,
      name: 'Taladro Percutor',
      price: 'Disponible',
      category: 'herramientas',
      image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      description: 'Taladro percutor 500W con velocidad variable'
    },
    {
      id: 3,
      name: 'Cemento Gris',
      price: 'Disponible',
      category: 'construccion',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
      description: 'Saco de cemento gris 50kg'
    },
    {
      id: 4,
      name: 'Cable Eléctrico',
      price: 'Disponible',
      category: 'electricidad',
      image: 'https://images.unsplash.com/photo-1555421693-d5c9a5d9c5b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      description: 'Cable THW calibre 12, rollo 100m'
    },
    {
      id: 5,
      name: 'Llave Inglesa',
      price: 'Disponible',
      category: 'herramientas',
      image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      description: 'Llave inglesa ajustable 12 pulgadas'
    },
    {
      id: 6,
      name: 'Pintura Blanca',
      price: 'No Disponible',
      category: 'pinturas',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      description: 'Pintura vinílica blanca 4L'
    },
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginCredentials.username === 'admin' && loginCredentials.password === 'admin123') {
      localStorage.setItem('isAdmin', 'true')
      navigate('/admin')
    } else {
      alert('Credenciales incorrectas')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    switch(activeSection) {
      case 'inicio':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Taller Mecanico MODIFICADO</h1>
              <p className="text-xl mb-6">Las mejores herramientas y materiales para tus proyectos</p>
              <button 
                onClick={() => setActiveSection('productos')}
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Productos
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600">Productos Disponibles</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">2+</div>
                <div className="text-gray-600">Años de Experiencia</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-gray-600">Clientes Satisfechos</div>
              </div>
            </div>

            {/* Featured Products */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Productos Destacados</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.slice(0, 3).map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        product.price === 'Disponible' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'productos':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Products Vertical List */}
            <div className="flex flex-col gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div>
                        <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4 text-lg">{product.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <span className={`text-xl font-bold ${
                          product.price === 'Disponible' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {product.price === 'Disponible' ? '✓ ' : '✗ '}
                          {product.price}
                        </span>
                        <button 
                          className={`p-3 rounded-lg transition-colors ${
                            product.price === 'Disponible'
                              ? 'bg-primary text-white hover:bg-opacity-90'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={product.price !== 'Disponible'}
                        >
                          <FiShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No se encontraron productos</p>
              </div>
            )}
          </div>
        )
      
      case 'acerca-de':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-6">Acerca de Nosotros</h1>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-6">
                  Somos una ferretería con más de 15 años de experiencia en el mercado, 
                  comprometidos con ofrecer productos de la más alta calidad y un servicio 
                  excepcional a nuestros clientes.
                </p>
                
                <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
                <p className="text-gray-700 mb-6">
                  Proveer a nuestros clientes las mejores herramientas y materiales para 
                  la construcción, garantizando calidad, durabilidad y los mejores precios 
                  del mercado.
                </p>
                
                <h2 className="text-2xl font-semibold mb-4">Nuestra Visión</h2>
                <p className="text-gray-700 mb-6">
                  Ser la ferretería líder en la región, reconocida por nuestra excelencia 
                  en el servicio, variedad de productos y compromiso con la satisfacción 
                  del cliente.
                </p>
                
                <h2 className="text-2xl font-semibold mb-4">Valores</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Calidad en cada producto</li>
                  <li>Atención personalizada</li>
                  <li>Compromiso con el cliente</li>
                  <li>Integridad y honestidad</li>
                  <li>Innovación constante</li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-primary text-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Contáctanos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-2">Dirección:</p>
                  <p>Av. Principal #123, Centro</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Teléfono:</p>
                  <p>(123) 456-7890</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Email:</p>
                  <p>info@ferreteria.com</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Horario:</p>
                  <p>Lun-Vie: 8am - 6pm, Sáb: 8am - 2pm</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Button */}
      <button
        onClick={() => setShowLoginModal(true)}
        className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 z-50"
      >
        <FiLogIn />
        <span>Admin</span>
      </button>

      {/* Sidebar Toggle Button (mobile) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 bg-primary text-white p-3 rounded-lg z-50 md:hidden"
      >
        <FiMenu size={20} />
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-0
      `}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-8">Bienvenidos</h2>
          
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveSection('inicio')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === 'inicio' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiHome size={20} />
              <span>Inicio</span>
              {activeSection === 'inicio' && <FiChevronRight className="ml-auto" />}
            </button>

            <button
              onClick={() => {
                setActiveSection('productos')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === 'productos' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiPackage size={20} />
              <span>Productos</span>
              {activeSection === 'productos' && <FiChevronRight className="ml-auto" />}
            </button>

            <button
              onClick={() => {
                setActiveSection('acerca-de')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === 'acerca-de' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiInfo size={20} />
              <span>Acerca de</span>
              {activeSection === 'acerca-de' && <FiChevronRight className="ml-auto" />}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-center">Login Administrador</h2>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Usuario</label>
                <input 
                  type="text"
                  value={loginCredentials.username}
                  onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="admin"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Contraseña</label>
                <input 
                  type="password"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="admin123"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors mb-2"
              >
                Iniciar Sesión
              </button>
            </form>
            
            <p className="text-xs text-gray-500 text-center">
              Usa: admin / admin123
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home