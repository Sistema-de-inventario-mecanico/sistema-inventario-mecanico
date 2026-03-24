import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { PortalModal } from '../components/Toast';

export default function EmpleadoSolicitudes() {
    const { user } = useContext(AuthContext);
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMoreSol, setViewMoreSol] = useState(null);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const res = await api.get('solicitudes/');
                const misSolicitudes = res.data.filter(s => s.empleado_detalle.id === user.id);
                setSolicitudes(misSolicitudes);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSolicitudes();
        const intervalId = setInterval(fetchSolicitudes, 5000);
        return () => clearInterval(intervalId);
    }, [user]);

    const getStatusStyle = (estado) => {
        switch (estado) {
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'APROBADA': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'RECHAZADA': return 'bg-red-100 text-red-800 border-red-200';
            case 'ENTREGADA': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DEVUELTA': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) return <div className="text-center p-10">Cargando solicitudes...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Mis Solicitudes</h2>
            
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Material</th>
                                <th className="px-6 py-4">Cantidad</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Fecha Solicitud</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {solicitudes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No has realizado ninguna solicitud aún.</td>
                                </tr>
                            ) : solicitudes.map((sol) => (
                                <tr key={sol.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-500">#{sol.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{sol.material_detalle.nombre}</td>
                                    <td className="px-6 py-4 text-gray-600">{sol.cantidad}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(sol.estado)}`}>
                                            {sol.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(sol.fecha_solicitud).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
                {solicitudes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
                        No has realizado ninguna solicitud aún.
                    </div>
                ) : solicitudes.map((sol) => (
                    <div key={sol.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="font-bold text-gray-900">{sol.material_detalle.nombre}</p>
                                <p className="text-xs text-gray-500">Fecha: {new Date(sol.fecha_solicitud).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(sol.estado)}`}>
                                {sol.estado}
                            </span>
                        </div>
                        <button 
                            onClick={() => setViewMoreSol(sol)}
                            className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-primary font-medium rounded-lg text-sm border border-gray-200 mt-1"
                        >
                            Ver Detalles
                        </button>
                    </div>
                ))}
            </div>

            {/* View More Modal */}
            {viewMoreSol && (
                <PortalModal title="Detalles de la Solicitud" onClose={() => setViewMoreSol(null)}>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                            <span className="text-xs font-mono text-gray-500 mb-1 block">ID: #{viewMoreSol.id}</span>
                            <h3 className="text-xl font-bold text-gray-900">{viewMoreSol.material_detalle.nombre}</h3>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(viewMoreSol.estado)}`}>
                                {viewMoreSol.estado}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Cantidad</p>
                                <p className="font-bold text-lg">{viewMoreSol.cantidad}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fecha</p>
                                <p className="font-medium">{new Date(viewMoreSol.fecha_solicitud).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="pt-2">
                            <button onClick={() => setViewMoreSol(null)} className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </PortalModal>
            )}
        </div>
    );
}
