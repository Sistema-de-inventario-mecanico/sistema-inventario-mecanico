import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { 
    CheckBadgeIcon, 
    ArrowPathIcon, 
    InboxArrowDownIcon,
    ExclamationTriangleIcon,
    ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { PortalModal, useToast } from '../components/Toast';

export default function EncargadoOficinaDashboard() {
    const { user } = useContext(AuthContext);
    const { showToast, ToastContainer } = useToast();
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('entregar'); // 'entregar' | 'recibir'
    const [selectedSol, setSelectedSol] = useState(null);
    const [form, setForm] = useState({ 
        estado_devolucion: 'BUENO', 
        motivo_devolucion: '', 
        cantidad_devuelta: 0 
    });

    const load = async () => {
        try {
            const res = await api.get('solicitudes/');
            setSolicitudes(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        load();
        const intervalId = setInterval(load, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleAction = async (sol, action) => {
        try {
            await api.post(`solicitudes/${sol.id}/${action}/`);
            showToast(`Solicitud ${action === 'entregar' ? 'entregada' : 'procesada'}`, 'success');
            load();
        } catch (err) {
            const msg = err.response?.data?.error || 'Error al procesar';
            showToast(msg, 'error');
        }
    };

    const handleSelectDevolver = (sol) => {
        setSelectedSol(sol);
        const initialCant = sol.cantidad_aviso_devolucion || sol.cantidad;
        setForm({
            estado_devolucion: 'BUENO',
            motivo_devolucion: '',
            cantidad_devuelta: initialCant,
            cantidad_buena_devuelta: initialCant,
            cantidad_mala_devuelta: 0
        });
    };

    const handleDevolver = async (e) => {
        e.preventDefault();
        
        if (selectedSol.material_detalle.categoria === 'HERRAMIENTA' && form.estado_devolucion === 'MALO' && !form.motivo_devolucion) {
            return showToast('Se requiere un motivo para material en mal estado.', 'warning');
        }

        if (selectedSol.material_detalle.categoria === 'UNIDAD') {
            const total = (parseInt(form.cantidad_buena_devuelta, 10) || 0) + (parseInt(form.cantidad_mala_devuelta, 10) || 0);
            const maxAllowed = parseInt(selectedSol.cantidad_aviso_devolucion || selectedSol.cantidad, 10);
            if (total > maxAllowed) {
                return showToast(`El total (${total}) no puede superar los ${maxAllowed} reportados.`, 'warning');
            }
            if (form.cantidad_mala_devuelta > 0 && !form.motivo_devolucion) {
                return showToast('Indica por qué hay material en mal estado.', 'warning');
            }
        }

        if (selectedSol.material_detalle.categoria === 'CONSUMIBLE') {
            const val = parseInt(form.cantidad_devuelta, 10) || 0;
            const maxAllowed = parseInt(selectedSol.cantidad_aviso_devolucion || selectedSol.cantidad, 10);
            if (val > maxAllowed) {
                return showToast(`No puedes recibir más de los ${maxAllowed} reportados.`, 'warning');
            }
        }

        try {
            await api.post(`solicitudes/${selectedSol.id}/devolver/`, form);
            showToast('Devolución registrada correctamente.', 'success');
            setSelectedSol(null);
            load();
        } catch (err) {
            const msg = err.response?.data?.error || 'Error en devolución';
            showToast(msg, 'error');
        }
    };

    // Filter logic
    const porEntregar = solicitudes.filter(s => s.estado === 'APROBADA');
    
    // Items to receive back: either ENTREGADA tools/units, or ENTREGADA consumables with extra aviso
    const porRecibir = solicitudes.filter(s => {
        if (s.estado !== 'ENTREGADA') return false;
        
        const isTool = s.material_detalle.categoria === 'HERRAMIENTA';
        const hasAviso = s.aviso_devolucion;
        
        return isTool || hasAviso;
    });

    if (loading) return <div className="p-10 text-center">Cargando panel...</div>;

    return (
        <div className="space-y-6">
            <ToastContainer />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Panel de Oficina</h2>
                    <p className="text-gray-500 text-sm">Gestiona la salida y entrada física de materiales.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setTab('entregar')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${tab === 'entregar' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <InboxArrowDownIcon className="w-4 h-4" />
                        Por Entregar ({porEntregar.length})
                    </button>
                    <button 
                        onClick={() => setTab('recibir')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${tab === 'recibir' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        Por Recibir ({porRecibir.length})
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {tab === 'entregar' ? (
                    porEntregar.length === 0 ? (
                        <EmptyState icon={<CheckBadgeIcon className="w-12 h-12 text-gray-300"/>} text="No hay materiales por entregar." />
                    ) : (
                        porEntregar.map(sol => (
                            <ItemCard key={sol.id} sol={sol} actionText="Entregar Material" onAction={() => handleAction(sol, 'entregar')} type="entregar" />
                        ))
                    )
                ) : (
                    porRecibir.length === 0 ? (
                        <EmptyState icon={<ArrowPathIcon className="w-12 h-12 text-gray-300"/>} text="No hay materiales por recibir de vuelta." />
                    ) : (
                        porRecibir.map(sol => (
                            <ItemCard key={sol.id} sol={sol} actionText="Registrar Devolución" onAction={() => handleSelectDevolver(sol)} type="recibir" />
                        ))
                    )
                )}
            </div>

            {selectedSol && (
                <PortalModal title={`Recibir Devolución: ${selectedSol.material_detalle.nombre}`} onClose={() => setSelectedSol(null)}>
                    <form onSubmit={handleDevolver} className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                            <p><strong>Empleado:</strong> {selectedSol.empleado_detalle.username}</p>
                            <p><strong>Cant. Entregada:</strong> {selectedSol.cantidad} ui</p>
                            {selectedSol.aviso_devolucion && (
                                <p className="text-indigo-600 font-bold mt-1 animate-pulse">
                                    ⚠️ Aviso: El empleado reportó que regresará {selectedSol.cantidad_aviso_devolucion} ui
                                </p>
                            )}
                        </div>

                        {selectedSol.material_detalle.categoria === 'HERRAMIENTA' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">¿En qué estado regresa?</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['BUENO', 'REGULAR', 'MALO'].map(est => (
                                        <button 
                                            key={est}
                                            type="button"
                                            onClick={() => setForm({...form, estado_devolucion: est})}
                                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${form.estado_devolucion === est ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-500'}`}
                                        >
                                            {est}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedSol.material_detalle.categoria === 'CONSUMIBLE' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Cantidad Física Recibida (Consumible)</label>
                                <div className="relative">
                                    <input 
                                        className="form-input font-bold text-lg" 
                                        type="number" 
                                        min="0" 
                                        max={selectedSol.cantidad_aviso_devolucion} 
                                        value={form.cantidad_devuelta} 
                                        onChange={(e) => setForm({...form, cantidad_devuelta: parseInt(e.target.value, 10)})} 
                                    />
                                </div>
                            </div>
                        )}

                        {selectedSol.material_detalle.categoria === 'UNIDAD' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-green-600 mb-1">Cantidad BUENA</label>
                                    <input 
                                        className="form-input font-bold border-green-200 focus:ring-green-500" 
                                        type="number" 
                                        min="0" 
                                        max={selectedSol.cantidad_aviso_devolucion} 
                                        value={form.cantidad_buena_devuelta} 
                                        onChange={(e) => setForm({...form, cantidad_buena_devuelta: parseInt(e.target.value, 10)})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-red-600 mb-1">Cantidad MALA</label>
                                    <input 
                                        className="form-input font-bold border-red-200 focus:ring-red-500" 
                                        type="number" 
                                        min="0" 
                                        max={selectedSol.cantidad_aviso_devolucion} 
                                        value={form.cantidad_mala_devuelta} 
                                        onChange={(e) => setForm({...form, cantidad_mala_devuelta: parseInt(e.target.value, 10)})} 
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Observaciones { (form.estado_devolucion === 'MALO' || form.cantidad_mala_devuelta > 0) && '(Requerido)'}
                            </label>
                            <textarea 
                                className={`form-input focus:ring-primary ${ (form.estado_devolucion === 'MALO' || form.cantidad_mala_devuelta > 0) ? 'border-red-300' : ''}`}
                                rows={2}
                                value={form.motivo_devolucion}
                                onChange={(e) => setForm({...form, motivo_devolucion: e.target.value})}
                                placeholder="Ej: Rayado, incompleto, contaminado, etc."
                            />
                        </div>

                        {(form.estado_devolucion === 'MALO' || form.cantidad_mala_devuelta > 0) && (
                            <div className="flex gap-2 items-start bg-red-50 p-3 rounded-lg border border-red-100">
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 shrink-0" />
                                <p className="text-[11px] text-red-700 leading-tight">
                                    La cantidad marcada como <strong>MALA</strong> NO será agregada al stock actual y se enviará al historial de desperfectos.
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setSelectedSol(null)} className="cancel-btn flex-1">Cerrar</button>
                            <button type="submit" className="login-btn flex-1">Confirmar Devolución</button>
                        </div>
                    </form>
                </PortalModal>
            )}
        </div>
    );
}

function ItemCard({ sol, actionText, onAction, type }) {
    const isAvise = sol.aviso_devolucion;
    return (
        <div className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-gray-300 transition-all ${isAvise ? 'ring-2 ring-indigo-100 border-indigo-200' : ''}`}>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-gray-400">#{sol.id}</span>
                    <h3 className="font-bold text-lg text-gray-900">{sol.material_detalle.nombre}</h3>
                    {isAvise && <span className="bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">Sobrado</span>}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1 font-medium">Solicitado: <strong>{sol.cantidad} {sol.material_detalle.unidad || 'ui'}</strong></span>
                    <span className="flex items-center gap-1">Pide: {sol.empleado_detalle.username}</span>
                    {type === 'recibir' && <span className="text-xs italic bg-gray-50 px-2 py-0.5 rounded">Cat: {sol.material_detalle.categoria}</span>}
                </div>
            </div>
            <button 
                onClick={onAction}
                className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all text-sm flex items-center justify-center gap-2 ${type === 'entregar' ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
                {type === 'recibir' ? <ArrowPathIcon className="w-4 h-4" /> : <CheckBadgeIcon className="w-4 h-4" />}
                {actionText}
            </button>
        </div>
    );
}

function EmptyState({ icon, text }) {
    return (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
            <div className="mx-auto mb-3 flex justify-center">{icon}</div>
            <p className="text-gray-500 font-medium">{text}</p>
        </div>
    );
}
