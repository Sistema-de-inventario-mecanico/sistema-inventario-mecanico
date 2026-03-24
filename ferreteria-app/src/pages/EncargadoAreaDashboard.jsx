import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToast, useConfirm } from '../components/Toast';

export default function EncargadoAreaDashboard() {
    const { showToast, ToastContainer } = useToast();
    const { confirmDialog, ConfirmDialogContainer } = useConfirm();
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadSolicitudes = async () => {
        try {
            const res = await api.get('solicitudes/');
            const pendientes = res.data.filter(s => s.estado === 'PENDIENTE');
            setSolicitudes(pendientes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSolicitudes();
        const intervalId = setInterval(loadSolicitudes, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleAprobar = async (id) => {
        try {
            await api.post(`solicitudes/${id}/aprobar/`);
            showToast('Solicitud aprobada. El Encargado de Oficina recibirá la petición.', 'success');
            loadSolicitudes();
        } catch (error) {
            showToast('Error al aprobar la solicitud.', 'error');
        }
    };

    const handleRechazar = async (id) => {
        const ok = await confirmDialog('Rechazar esta solicitud', '`¿Estas seguro? El empleado será notificado del rechazo.');
        if (!ok) return;
        try {
            await api.post(`solicitudes/${id}/rechazar/`);
            showToast('Solicitud rechazada.', 'warning');
            loadSolicitudes();
        } catch (error) {
            showToast('Error al rechazar la solicitud.', 'error');
        }
    };

    if (loading) return <div className="text-center p-10 text-gray-500">Cargando datos...</div>;

    return (
        <div className="space-y-6">
            <ToastContainer />
            <ConfirmDialogContainer />
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Validación de Solicitudes</h2>
                <p className="text-gray-500">Autoriza el material requerido por los empleados para sus reparaciones.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solicitudes.length === 0 ? (
                    <div className="col-span-full p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                        <p className="text-gray-500 font-medium">No hay solicitudes pendientes por revisar.</p>
                    </div>
                ) : solicitudes.map((sol) => (
                    <div key={sol.id} className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] border border-gray-100 p-6 flex flex-col transition-all hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-800 rounded uppercase tracking-wider">
                                {sol.estado}
                            </span>
                            <span className="text-sm text-gray-400 font-mono">#{sol.id}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{sol.material_detalle.nombre}</h3>
                        <p className="text-sm text-gray-500 mb-4 bg-gray-50 px-3 py-2 rounded-lg">
                            Categoría: <span className="font-semibold text-gray-700">{sol.material_detalle.categoria}</span>
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Empleado</p>
                                    <p className="font-medium text-gray-800">{sol.empleado_detalle.username}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Cantidad</p>
                                    <p className="font-bold text-gray-900 text-lg">{sol.cantidad}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleRechazar(sol.id)}
                                    className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors font-medium text-sm"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                    <span>Denegar</span>
                                </button>
                                <button
                                    onClick={() => handleAprobar(sol.id)}
                                    className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark shadow shadow-primary/30 transition-all font-medium text-sm"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                    <span>Aprobar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
