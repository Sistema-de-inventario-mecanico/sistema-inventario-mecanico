import React, { useState } from 'react'
import { FiSearch, FiShoppingCart } from 'react-icons/fi'

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')

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
      price: 25.99,
      category: 'herramientas',
      image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      description: 'Martillo de acero forjado con mango ergonómico'
    },
    {
      id: 2,
      name: 'Taladro Percutor',
      price: 89.99,
      category: 'herramientas',
      image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      description: 'Taladro percutor 500W con velocidad variable'
    },
    {
      id: 3,
      name: 'Cemento Gris',
      price: 12.50,
      category: 'construccion',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
      description: 'Saco de cemento gris 50kg'
    },
    {
      id: 4,
      name: 'Cable Eléctrico',
      price: 45.99,
      category: 'electricidad',
      image: 'https://images.unsplash.com/photo-1555421693-d5c9a5d9c5b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      description: 'Cable THW calibre 12, rollo 100m'
    },
    {
      id: 5,
      name: 'Llave Inglesa',
      price: 34.99,
      category: 'herramientas',
      image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      description: 'Llave inglesa ajustable 12 pulgadas'
    },
    {
      id: 6,
      name: 'Pintura Blanca',
      price: 28.99,
      category: 'pinturas',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      description: 'Pintura vinílica blanca 4L'
    },
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <section id="productos" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Nuestros <span className="text-primary">Productos</span></h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra las mejores marcas y la más amplia variedad para tus proyectos
          </p>
        </div>

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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                  <button className="bg-primary text-white p-3 rounded-lg hover:bg-opacity-90 transition-colors">
                    <FiShoppingCart />
                  </button>
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
    </section>
  )
}

export default Products