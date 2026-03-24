import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useToast, PortalModal } from '../components/Toast';

export default function EncargadoOficinaDashboard() {
    const { showToast, ToastContainer } = useToast();
    const [solicitudes, setSolicitudes] = useState([]);
    const [tab, setTab] = useState('ENTREGAR');
    const [loading, setLoading] = useState(true);
    const [selectedSol, setSelectedSol] = useState(null);
    const [viewMoreSol, setViewMoreSol] = useState(null);
    const [estadoDev, setEstadoDev] = useState('BUENO');
    const [motivo, setMotivo] = useState('');

    const loadData = async () => {
        try {
            const res = await api.get('solicitudes/');
            setSolicitudes(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const intervalId = setInterval(loadData, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const pendientesEntregar = solicitudes.filter(s => s.estado === 'APROBADA');
    const pendientesRecibir = solicitudes.filter(s => s.estado === 'ENTREGADA' && s.material_detalle.categoria === 'HERRAMIENTA');

    const handleEntregar = async (id) => {
        try {
            await api.post(`solicitudes/${id}/entregar/`);
            showToast('Material entregado físicamente. Stock descontado.', 'success');
            loadData();
        } catch (error) {
            const msg = error.response?.data?.error || 'Error del servidor';
            showToast(`Error al entregar: ${msg}`, 'error');
        }
    };

    const handleDevolverSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`solicitudes/${selectedSol.id}/devolver/`, {
                estado_devolucion: estadoDev,
                motivo_devolucion: motivo
            });
            showToast('Devolución registrada exitosamente al inventario.', 'success');
            setSelectedSol(null);
            setMotivo('');
            loadData();
        } catch (error) {
            showToast('Error al procesar la devolución.', 'error');
        }
    };

    if (loading) return <div className="text-center p-10 text-gray-500">Cargando panel de oficina...</div>;

    return (
        <div className="space-y-6">
            <ToastContainer />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Control Físico de Materiales</h2>
            
            <div className="flex space-x-2 bg-gray-200/50 p-1.5 rounded-xl w-fit">
                <button 
                    onClick={() => setTab('ENTREGAR')}
                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${tab === 'ENTREGAR' ? 'bg-white text-primary' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    <div className="flex items-center space-x-2">
                        <ArrowUpTrayIcon className="w-4 h-4" />
                        <span>Para Entregar</span>
                        <span className="bg-primary/10 text-primary-dark ml-2 px-2 py-0.5 rounded-full text-xs">{pendientesEntregar.length}</span>
                    </div>
                </button>
                <button 
                    onClick={() => setTab('RECIBIR')}
                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${tab === 'RECIBIR' ? 'bg-white text-secondary' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    <div className="flex items-center space-x-2">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>Por Recibir (Devoluciones)</span>
                        <span className="bg-secondary/10 text-secondary ml-2 px-2 py-0.5 rounded-full text-xs">{pendientesRecibir.length}</span>
                    </div>
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                            <tr>
                                <th className="px-6 py-4">Empleado</th>
                                <th className="px-6 py-4">Material</th>
                                <th className="px-6 py-4">Cantidad</th>
                                <th className="px-6 py-4">Autorizado Por</th>
                                <th className="px-6 py-4 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(tab === 'ENTREGAR' ? pendientesEntregar : pendientesRecibir).length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No hay tareas pendientes en esta pestaña.
                                    </td>
                                </tr>
                            ) : (tab === 'ENTREGAR' ? pendientesEntregar : pendientesRecibir).map((sol) => (
                                <tr key={sol.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium">{sol.empleado_detalle.username}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800">{sol.material_detalle.nombre}</p>
                                        <p className="text-xs text-gray-500">Stock actual: {sol.material_detalle.stock_actual}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{sol.cantidad}</td>
                                    <td className="px-6 py-4 text-gray-500">{sol.encargado_area_detalle?.username}</td>
                                    <td className="px-6 py-4 text-center">
                                        {tab === 'ENTREGAR' ? (
                                            <button 
                                                onClick={() => handleEntregar(sol.id)}
                                                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-xs"
                                            >
                                                Dar Material Físico
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setSelectedSol(sol)}
                                                className="bg-secondary hover:bg-dark text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-xs"
                                            >
                                                Registrar Devolución
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {(tab === 'ENTREGAR' ? pendientesEntregar : pendientesRecibir).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
                        No hay tareas pendientes.
                    </div>
                ) : (tab === 'ENTREGAR' ? pendientesEntregar : pendientesRecibir).map((sol) => (
                    <div key={sol.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="font-bold text-gray-900">{sol.material_detalle.nombre}</p>
                                <p className="text-xs text-gray-500">Solicitante: <span className="font-medium text-gray-800">{sol.empleado_detalle.username}</span></p>
                            </div>
                            <span className="text-lg font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{sol.cantidad} ui</span>
                        </div>
                        <button 
                            onClick={() => setViewMoreSol(sol)}
                            className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-primary font-medium rounded-lg text-sm border border-gray-200 mt-1"
                        >
                            Ver Detalles y Acciones
                        </button>
                    </div>
                ))}
            </div>

            {/* View More Modal */}
            {viewMoreSol && (
                <PortalModal title="Detalles de la Solicitud" onClose={() => setViewMoreSol(null)}>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                            <h3 className="text-lg font-bold text-gray-900">{viewMoreSol.material_detalle.nombre}</h3>
                            <p className="text-sm text-gray-500 mt-1">Stock actual: {viewMoreSol.material_detalle.stock_actual}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Cantidad</p>
                                <p className="font-bold text-lg">{viewMoreSol.cantidad}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Empleado</p>
                                <p className="font-medium">{viewMoreSol.empleado_detalle.username}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500">Autorizado Por</p>
                                <p className="font-medium">{viewMoreSol.encargado_area_detalle?.username || '—'}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            {tab === 'ENTREGAR' ? (
                                <button 
                                    onClick={() => { setViewMoreSol(null); handleEntregar(viewMoreSol.id); }}
                                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow-sm transition-colors flex justify-center items-center gap-2"
                                >
                                    <ArrowUpTrayIcon className="w-5 h-5" /> Dar Material Físico
                                </button>
                            ) : (
                                <button 
                                    onClick={() => { setViewMoreSol(null); setSelectedSol(viewMoreSol); }}
                                    className="w-full py-3 bg-secondary hover:bg-dark text-white rounded-lg font-medium shadow-sm transition-colors flex justify-center items-center gap-2"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" /> Registrar Devolución
                                </button>
                            )}
                        </div>
                    </div>
                </PortalModal>
            )}

            {selectedSol && (
                <PortalModal title="Evaluar Devolución" onClose={() => setSelectedSol(null)}>
                    <p className="text-sm text-gray-500 mb-4">
                        Revisando <strong>{selectedSol.material_detalle.nombre}</strong> entregada por <strong>{selectedSol.empleado_detalle.username}</strong>.
                    </p>
                    <form onSubmit={handleDevolverSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado Físico al Regresar</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['BUENO', 'REGULAR', 'MALO'].map(estado => (
                                    <button
                                        key={estado}
                                        type="button"
                                        onClick={() => setEstadoDev(estado)}
                                        className={`py-2 rounded-lg border-2 font-semibold text-sm transition-all ${
                                            estadoDev === estado
                                                ? estado === 'BUENO' ? 'border-green-500 bg-green-50 text-green-700'
                                                  : estado === 'REGULAR' ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                                  : 'border-red-500 bg-red-50 text-red-700'
                                                : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                                        }`}
                                    >
                                        {estado === 'BUENO' ? '✓ Bueno' : estado === 'REGULAR' ? '~ Regular' : '✕ Malo'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(estadoDev === 'REGULAR' || estadoDev === 'MALO') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo / Descripción del daño <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    className="form-input h-20"
                                    placeholder="Describe qué daño tiene o por qué se reporta en ese estado..."
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setSelectedSol(null)} className="cancel-btn">Cancelar</button>
                            <button type="submit" className="login-btn">Confirmar Ingreso al Almacén</button>
                        </div>
                    </form>
                </PortalModal>
            )}
        </div>
    );
}
