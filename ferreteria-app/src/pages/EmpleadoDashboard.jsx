import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { PlusIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useToast, PortalModal } from '../components/Toast';

export default function EmpleadoDashboard() {
    const { user } = useContext(AuthContext);
    const { showToast, ToastContainer } = useToast();
    const [materiales, setMateriales] = useState([]);
    const [loading, setLoading] = useState(true);
    // Track selected quantities per material (for CONSUMIBLE and UNIDAD)
    const [cantidades, setCantidades] = useState({});

    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const loadData = () => {
        api.get('materiales/')
            .then(r => setMateriales(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
        const intervalId = setInterval(loadData, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const getCantidad = (mat) => cantidades[mat.id] || 1;

    const openConfirmModal = (mat) => {
        const cantidad = getCantidad(mat);
        if (cantidad < 1 || cantidad > mat.stock_actual) {
            showToast(`Cantidad inválida. Stock disponible: ${mat.stock_actual}`, 'warning');
            return;
        }
        setSelectedMaterial({ mat, cantidad });
    };

    const confirmarSolicitud = async () => {
        if (!selectedMaterial) return;
        const { mat, cantidad } = selectedMaterial;
        try {
            await api.post('solicitudes/', { material: mat.id, cantidad });
            showToast(`¡Solicitud de ${cantidad} × "${mat.nombre}" enviada! Revisa el estado en "Mis Solicitudes".`, 'success');
            setSelectedMaterial(null);
            loadData();
        } catch (error) {
            showToast('Error al enviar la solicitud. Inténtalo de nuevo.', 'error');
            console.error(error);
        }
    };

    const catColors = {
        HERRAMIENTA: 'bg-blue-100 text-blue-800',
        CONSUMIBLE: 'bg-orange-100 text-orange-800',
        UNIDAD: 'bg-purple-100 text-purple-800',
    };

    if (loading) return <div className="text-center p-10 text-gray-500">Cargando catálogo...</div>;

    return (
        <div className="space-y-6">
            <ToastContainer />

            <div>
                <h2 className="text-2xl font-bold tracking-tight text-dark">Catálogo de Herramientas y Materiales</h2>
                <p className="text-gray-500 mt-1 text-sm">Selecciona el material que necesitas y especifica la cantidad.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {materiales.map((mat) => {
                    const cantidad = getCantidad(mat);
                    const canSelectQty = mat.categoria === 'CONSUMIBLE' || mat.categoria === 'UNIDAD';
                    const agotado = mat.stock_actual <= 0;

                    return (
                        <div key={mat.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catColors[mat.categoria]}`}>
                                    {mat.categoria}
                                </span>
                                <span className={`text-sm font-bold ${agotado ? 'text-red-500' : 'text-green-600'}`}>
                                    {agotado ? 'Agotado' : `${mat.stock_actual} disp.`}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{mat.nombre}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 flex-grow mb-4">{mat.descripcion || 'Sin descripción.'}</p>

                            {/* Quantity selector for CONSUMIBLE and UNIDAD */}
                            {canSelectQty && !agotado && (
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-3 border border-gray-200">
                                    <span className="text-xs text-gray-500 font-medium">Cantidad:</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCantidades(prev => ({ ...prev, [mat.id]: Math.max(1, (prev[mat.id] || 1) - 1) }))}
                                            className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center justify-center font-bold text-sm transition-colors"
                                        >−</button>
                                        <span className="w-6 text-center font-bold text-dark text-sm">{cantidad}</span>
                                        <button
                                            onClick={() => setCantidades(prev => ({ ...prev, [mat.id]: Math.min(mat.stock_actual, (prev[mat.id] || 1) + 1) }))}
                                            className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center justify-center font-bold text-sm transition-colors"
                                        >+</button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => openConfirmModal(mat)}
                                disabled={agotado}
                                className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                                    agotado
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                }`}
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>
                                    {canSelectQty
                                        ? `Solicitar ${cantidad} ${mat.categoria === 'UNIDAD' ? 'pcs.' : 'u.'}`
                                        : 'Solicitar'}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {materiales.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <ClockIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No hay materiales disponibles.</p>
                    <p className="text-sm">El Administrador aún no ha registrado materiales en el sistema.</p>
                </div>
            )}

            {selectedMaterial && (
                <PortalModal title="Confirmar Solicitud" onClose={() => setSelectedMaterial(null)}>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            ¿Estás seguro de que deseas solicitar <strong>{selectedMaterial.cantidad} {selectedMaterial.mat.categoria === 'UNIDAD' ? 'pcs.' : 'u.'}</strong> de <strong>{selectedMaterial.mat.nombre}</strong>?
                        </p>
                        <div className="flex gap-3 pt-4">
                            <button onClick={() => setSelectedMaterial(null)} className="cancel-btn">Cancelar</button>
                            <button onClick={confirmarSolicitud} className="login-btn bg-primary hover:bg-primary-dark">
                                Confirmar Solicitud
                            </button>
                        </div>
                    </div>
                </PortalModal>
            )}
        </div>
    );
}
