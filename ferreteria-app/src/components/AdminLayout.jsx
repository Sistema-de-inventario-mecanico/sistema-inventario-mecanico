import React, { useState } from 'react'
import { 
  FiMonitor, 
  FiTool, 
  FiPackage, 
  FiUsers, 
  FiGrid, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi'

const AdminLayout = ({ onLogout }) => {
  const [selectedMenu, setSelectedMenu] = useState('monitoreo')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menus = [
    { id: 'monitoreo', name: 'Monitoreo', icon: FiMonitor },
    { id: 'material-herramientas', name: 'Material/Herramientas', icon: FiTool },
    { id: 'inventario', name: 'Inventario', icon: FiPackage },
    { id: 'usuario', name: 'Usuario', icon: FiUsers },
    { id: 'modulos', name: 'Módulos', icon: FiGrid },
  ]

  // ... (los mismos componentes Monitoreo, MaterialHerramientas, etc.)

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white transition-all duration-300 ease-in-out flex flex-col`}>
        {/* ... (código del sidebar) */}

        {/* Logout Button */}
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

export default AdminLayout