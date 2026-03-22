import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import EmpleadoDashboard from './pages/EmpleadoDashboard';
import EmpleadoSolicitudes from './pages/EmpleadoSolicitudes';
import EncargadoAreaDashboard from './pages/EncargadoAreaDashboard';
import EncargadoOficinaDashboard from './pages/EncargadoOficinaDashboard';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminStock from './pages/AdminStock';
import AdminControl from './pages/AdminControl';
import AdminCompras from './pages/AdminCompras';
import OficinaStock from './pages/OficinaStock';

// Placeholder Pages
const NotImplemented = () => <div className="p-8 bg-white rounded-xl shadow text-center"><h2 className="text-2xl font-bold text-gray-700">Página en Construcción</h2><p className="text-gray-500 mt-2">Esta vista será implementada en el siguiente paso.</p></div>;

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const RoleBasedIndex = () => {
    const { user } = useContext(AuthContext);
    if (user?.rol === 'ADMIN') return <AdminDashboard />;
    if (user?.rol === 'ENCARGADO_OFICINA') return <EncargadoOficinaDashboard />;
    if (user?.rol === 'ENCARGADO_AREA') return <EncargadoAreaDashboard />;
    if (user?.rol === 'EMPLEADO') return <EmpleadoDashboard />;
    return <NotImplemented />;
};

// We will map the components to roles later. For now, we will route everything to NotImplemented to test the navigation.
export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/" element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<RoleBasedIndex />} />
                        
                        {/* Admin Routes */}
                        <Route path="stock" element={<AdminStock />} />
                        <Route path="control" element={<AdminControl />} />
                        <Route path="compras" element={<AdminCompras />} />
                        <Route path="usuarios" element={<AdminUsuarios />} />
                        <Route path="encargado-oficina" element={<EncargadoOficinaDashboard />} />
                        <Route path="encargado-area" element={<EncargadoAreaDashboard />} />
                        <Route path="empleado-stock" element={<EmpleadoDashboard />} />
                        
                        {/* Oficina Routes */}
                        <Route path="entregas" element={<RoleBasedIndex />} />
                        <Route path="recepcion" element={<RoleBasedIndex />} />
                        <Route path="oficina-stock" element={<OficinaStock />} />
                        
                        {/* Empleado Routes */}
                        <Route path="mis-solicitudes" element={<EmpleadoSolicitudes />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}