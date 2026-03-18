import React from 'react'
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Ferretería</h3>
            <p className="text-gray-300 mb-4">
              Tu mejor opción en herramientas, materiales de construcción y asesoría profesional.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#inicio" className="text-gray-300 hover:text-primary transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#productos" className="text-gray-300 hover:text-primary transition-colors">
                  Productos
                </a>
              </li>
              <li>
                <a href="#nosotros" className="text-gray-300 hover:text-primary transition-colors">
                  Acerca de
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-300">
                <FiPhone />
                <span>+52 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <FiMail />
                <span>info@ferreteria.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <FiMapPin />
                <span>Av. Principal #123, Ciudad</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Horario</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Lunes a Viernes: 8:00 - 19:00</li>
              <li>Sábados: 9:00 - 14:00</li>
              <li>Domingos: Cerrado</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Ferretería. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer