import React from 'react'
import { FiAward, FiUsers, FiTruck, FiClock } from 'react-icons/fi'

const About = () => {
  const features = [
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Calidad Garantizada',
      description: 'Trabajamos con las mejores marcas del mercado'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Equipo Profesional',
      description: 'Personal capacitado para asesorarte en tus proyectos'
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: 'Entrega Rápida',
      description: 'Llevamos tus materiales donde los necesites'
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: 'Experiencia',
      description: 'Más de 20 años sirviendo a nuestros clientes'
    }
  ]

  return (
    <section id="nosotros" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-primary">Acerca</span> de Nosotros
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Somos una empresa con más de 20 años de experiencia en el sector ferretero, 
              comprometidos con ofrecer productos de la más alta calidad y un servicio 
              excepcional a nuestros clientes.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Nuestra misión es ser el aliado estratégico de nuestros clientes en cada 
              proyecto, brindando asesoría profesional, productos de calidad y los mejores 
              precios del mercado.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary">Conocer más</button>
              <button className="btn-secondary">Contáctanos</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <img 
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="Ferretería 1"
              className="rounded-lg shadow-lg h-48 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1586864387634-2f33030b3c96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="Ferretería 2"
              className="rounded-lg shadow-lg h-48 object-cover mt-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About