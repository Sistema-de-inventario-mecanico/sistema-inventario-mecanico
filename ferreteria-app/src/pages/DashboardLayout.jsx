import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
    HomeIcon,
    ChartBarIcon,
    UsersIcon,
    WrenchIcon,
    InboxArrowDownIcon,
    ClipboardDocumentCheckIcon,
    ArrowRightOnRectangleIcon,
    ShoppingBagIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const ROLE_NAV_LINKS = {
    ADMIN: [
        { name: 'Monitoreo', path: '/', icon: ChartBarIcon },
        { name: 'Stock / Inventario', path: '/stock', icon: WrenchIcon },
        { name: 'Compras', path: '/compras', icon: ShoppingBagIcon },
        { name: 'Control Ingreso/Egreso', path: '/control', icon: InboxArrowDownIcon },
        { name: 'Usuarios', path: '/usuarios', icon: UsersIcon },
        { name: 'Entregar / Recibir', path: '/encargado-oficina', icon: ClipboardDocumentCheckIcon },
        { name: 'Aprobar Solicitudes', path: '/encargado-area', icon: ClipboardDocumentCheckIcon },
    ],
    ENCARGADO_OFICINA: [
        { name: 'Disposición del Stock', path: '/oficina-stock', icon: WrenchIcon },
        { name: 'Entregar Material', path: '/', icon: ClipboardDocumentCheckIcon },
        { name: 'Recibir/Devoluciones', path: '/recepcion', icon: InboxArrowDownIcon },
    ],
    ENCARGADO_AREA: [
        { name: 'Solicitudes Pendientes', path: '/', icon: ClipboardDocumentCheckIcon },
    ],
    EMPLEADO: [
        { name: 'Stock Disponible', path: '/', icon: WrenchIcon },
        { name: 'Mis Solicitudes', path: '/mis-solicitudes', icon: ClipboardDocumentCheckIcon },
    ]
};

export default function DashboardLayout() {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const links = user ? ROLE_NAV_LINKS[user.rol] : [];

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar upgraded with Secondary Color Theme and Responsive Slide */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-white flex flex-col shadow-2xl transition-transform duration-300 transform lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between border-b border-gray-700 px-6 mt-4 mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-lg">
                            <WrenchIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-wider">INVENTARIO</span>
                    </div>
                    <button 
                        className="lg:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-6 py-4 border-b border-gray-700">
                    <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Matrícula</p>
                    <p className="text-sm font-medium truncate mt-1 text-primary-light">{user.username}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user.rol.replace('_', ' ')}</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {links && links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-primary text-white shadow-md font-semibold'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <link.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium text-sm">{link.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors w-full"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header Navbar */}
                <header className="h-16 bg-white shadow-sm flex items-center px-4 md:px-8 shrink-0 z-10 relative">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 mr-4 text-gray-400 hover:bg-gray-100 rounded-lg lg:hidden"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-dark truncate">Panel de Control</h1>
                </header>

                {/* Dashboard View Area */}
                <div className="flex-1 overflow-auto bg-gray-50/50 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto animate-fade-in-up">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
