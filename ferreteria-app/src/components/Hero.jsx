import React from 'react'

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-primary">Calidad</span> y{' '}
              <span className="text-secondary">Confianza</span>
              <br />
              para tus proyectos
            </h1>
            
            <p className="text-xl text-gray-600">
              Encuentra todo lo que necesitas en herramientas, materiales de construcción, 
              ferretería en general y asesoría profesional para tus obras.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                Ver Productos
              </button>
              <button 
                onClick={() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                Conocer más
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">20+</div>
                <div className="text-sm text-gray-500">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5000+</div>
                <div className="text-sm text-gray-500">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-500">Clientes satisfechos</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-3xl opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Ferretería"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero