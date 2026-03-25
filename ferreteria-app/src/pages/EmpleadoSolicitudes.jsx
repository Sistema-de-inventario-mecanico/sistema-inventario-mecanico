import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { PortalModal, useToast, useConfirm } from '../components/Toast';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function EmpleadoSolicitudes() {
    const { user } = useContext(AuthContext);
    const { showToast, ToastContainer } = useToast();
    const { confirmDialog, ConfirmDialogContainer } = useConfirm();
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMoreSol, setViewMoreSol] = useState(null);
    const [showAvisoModal, setShowAvisoModal] = useState(null);
    const [cantAviso, setCantAviso] = useState(1);

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

    useEffect(() => {
        fetchSolicitudes();
        const intervalId = setInterval(fetchSolicitudes, 5000);
        return () => clearInterval(intervalId);
    }, [user]);

    const handleCancelar = async (id) => {
        const ok = await confirmDialog(
            'Cancelar Solicitud',
            '¿Estás seguro de cancelar esta solicitud? Esta acción no se puede deshacer.'
        );
        if (!ok) return;
        
        try {
            await api.post(`solicitudes/${id}/cancelar/`);
            showToast('Solicitud cancelada correctamente.', 'success');
            fetchSolicitudes();
        } catch (err) {
            showToast('No se pudo cancelar la solicitud.', 'error');
        }
    };

    const handleAvisoDevolucion = async (e) => {
        e.preventDefault();
        try {
            await api.post(`solicitudes/${showAvisoModal.id}/avisar_devolucion/`, {
                cantidad_aviso: cantAviso
            });
            showToast('Aviso de devolución enviado al encargado.', 'success');
            setShowAvisoModal(null);
            fetchSolicitudes();
        } catch (err) {
            const msg = err.response?.data?.error || 'Error al enviar aviso';
            showToast(msg, 'error');
        }
    };

    const getStatusStyle = (estado) => {
        switch (estado) {
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'APROBADA': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'RECHAZADA': return 'bg-red-100 text-red-800 border-red-200';
            case 'ENTREGADA': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DEVUELTA': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELADA': return 'bg-gray-200 text-gray-500 border-gray-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) return <div className="text-center p-10">Cargando solicitudes...</div>;

    return (
        <div className="space-y-6">
            <ToastContainer />
            <ConfirmDialogContainer />
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
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {solicitudes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No has realizado ninguna solicitud aún.</td>
                                </tr>
                            ) : solicitudes.map((sol) => (
                                <tr key={sol.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-500">#{sol.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{sol.material_detalle.nombre}</td>
                                    <td className="px-6 py-4 text-gray-600 font-bold">{sol.cantidad}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(sol.estado)}`}>
                                                {sol.estado}
                                            </span>
                                            {sol.aviso_devolucion && (
                                                <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                                                    Aviso: devolver {sol.cantidad_aviso_devolucion} ui
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-xs text-mono">
                                        {new Date(sol.fecha_solicitud).toLocaleString('es-MX', { dateStyle: 'short' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            {sol.estado === 'PENDIENTE' && (
                                                <button 
                                                    onClick={() => handleCancelar(sol.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors title='Cancelar Pedido'"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            {sol.estado === 'ENTREGADA' && (sol.material_detalle.categoria === 'CONSUMIBLE' || sol.material_detalle.categoria === 'UNIDAD') && !sol.aviso_devolucion && (
                                                <button 
                                                    onClick={() => { setShowAvisoModal(sol); setCantAviso(1); }}
                                                    className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
                title='Avisar que sobró material'
                                                >
                                                    <ArrowPathIcon className="w-4 h-4" />
                                                    Sobrante
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View More Modal (mobile fallback/details) */}
            {viewMoreSol && (
                <PortalModal title="Detalles" onClose={() => setViewMoreSol(null)}>
                    {/* ... (existing details modal content, can be updated later) */}
                </PortalModal>
            )}

            {showAvisoModal && (
                <PortalModal title="Avisar Devolución de Sobrante" onClose={() => setShowAvisoModal(null)}>
                    <form onSubmit={handleAvisoDevolucion} className="space-y-4">
                        <p className="text-sm text-gray-500">
                            ¿Cuánto de <strong>{showAvisoModal.material_detalle.nombre}</strong> vas a entregar en oficina?
                        </p>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Cantidad a devolver</label>
                            <input 
                                className="form-input text-lg font-bold" 
                                type="number" 
                                min="1" 
                                max={showAvisoModal.cantidad} 
                                required 
                                value={cantAviso} 
                                onChange={(e) => setCantAviso(parseInt(e.target.value, 10))} 
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setShowAvisoModal(null)} className="cancel-btn flex-1">Cerrar</button>
                            <button type="submit" className="login-btn flex-1">Enviar Aviso</button>
                        </div>
                    </form>
                </PortalModal>
            )}
        </div>
    );
}
