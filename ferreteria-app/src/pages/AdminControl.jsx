import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import { PortalModal, useToast } from '../components/Toast';

export default function AdminControl() {
    const { showToast, ToastContainer } = useToast();
    const [movimientos, setMovimientos] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewMoreItem, setViewMoreItem] = useState(null);
    const [tipo, setTipo] = useState('INGRESO');
    const [form, setForm] = useState({ material: '', cantidad: 1, notas: '' });

    const load = async () => {
        try {
            const [mov, mat] = await Promise.all([api.get('movimientos/'), api.get('materiales/')]);
            setMovimientos(mov.data);
            setMateriales(mat.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        load();
        const intervalId = setInterval(load, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mat = materiales.find(m => m.id === parseInt(form.material));
        if (!mat) return showToast('Selecciona un material.', 'warning');

        const cantidad = parseInt(form.cantidad, 10);
        if (tipo === 'EGRESO' && mat.stock_actual < cantidad) {
            showToast(`Stock insuficiente. Solo hay ${mat.stock_actual} unidades de "${mat.nombre}".`, 'error');
            return;
        }

        try {
            // Use the new ajustar_stock action that registers the movement AND updates stock atomically
            const res = await api.post(`materiales/${mat.id}/ajustar_stock/`, {
                tipo,
                cantidad,
                notas: form.notas
            });

            setShowModal(false);
            setForm({ material: '', cantidad: 1, notas: '' });
            showToast(`${tipo} registrado. Nuevo stock de "${mat.nombre}": ${res.data.nuevo_stock}`, 'success');
            load();
        } catch (err) {
            const detail = err.response?.data?.error;
            showToast(detail || 'Error al registrar movimiento.', 'error');
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando movimientos...</div>;

    return (
        <div className="space-y-6">
            <ToastContainer />
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark">Control de Ingresos / Egresos</h2>
                    <p className="text-gray-500 text-sm mt-1">Historial de todos los movimientos de stock y ajustes manuales.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { setTipo('INGRESO'); setShowModal(true); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-colors font-medium text-sm">
                        <ArrowDownCircleIcon className="w-5 h-5" />
                        <span>Ingreso</span>
                    </button>
                    <button onClick={() => { setTipo('EGRESO'); setShowModal(true); }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-colors font-medium text-sm">
                        <ArrowUpCircleIcon className="w-5 h-5" />
                        <span>Egreso</span>
                    </button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Tipo</th>
                            <th className="px-6 py-4">Material</th>
                            <th className="px-6 py-4">Cantidad</th>
                            <th className="px-6 py-4">Registrado por</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Notas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {movimientos.map(mov => (
                            <tr key={mov.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${mov.tipo === 'INGRESO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {mov.tipo === 'INGRESO' ? '▼ Ingreso' : '▲ Egreso'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{mov.material_detalle?.nombre || `Material #${mov.material}`}</td>
                                <td className="px-6 py-4 font-bold text-gray-700">{mov.cantidad}</td>
                                <td className="px-6 py-4 text-gray-600 font-mono text-xs">{mov.usuario_detalle?.username || '—'}</td>
                                <td className="px-6 py-4 text-gray-500 text-xs">{new Date(mov.fecha).toLocaleString('es-MX')}</td>
                                <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">{mov.notas || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {movimientos.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-lg font-medium">Sin movimientos aún.</p>
                        <p className="text-sm">Los movimientos aparecerán aquí cuando se registren ingresos, egresos o entregas.</p>
                    </div>
                )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                <h3 className="font-bold text-gray-900 px-1">Historial de Movimientos</h3>
                {movimientos.map(mov => (
                    <div key={mov.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`inline-block mb-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${mov.tipo === 'INGRESO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {mov.tipo}
                                </span>
                                <p className="font-bold text-gray-900">{mov.material_detalle?.nombre || `Material #${mov.material}`}</p>
                                <p className="text-xs text-gray-500">{new Date(mov.fecha).toLocaleDateString('es-MX')}</p>
                            </div>
                            <span className={`text-xl font-bold ${mov.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-500'}`}>
                                {mov.cantidad}
                            </span>
                        </div>
                        <button 
                            onClick={() => setViewMoreItem(mov)}
                            className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-primary font-medium rounded-lg text-sm border border-gray-200"
                        >
                            Ver Detalles
                        </button>
                    </div>
                ))}
                {movimientos.length === 0 && (
                    <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-gray-100">
                        <p className="font-medium">Sin movimientos aún.</p>
                    </div>
                )}
            </div>

            {/* View More Modal */}
            {viewMoreItem && (
                <PortalModal title={`Detalle de ${viewMoreItem.tipo}`} onClose={() => setViewMoreItem(null)}>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Material</p>
                            <p className="font-bold text-gray-900">{viewMoreItem.material_detalle?.nombre || `Material #${viewMoreItem.material}`}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Cantidad</p>
                                <p className={`font-bold ${viewMoreItem.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-500'}`}>
                                    {viewMoreItem.cantidad} unidades
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fecha</p>
                                <p className="font-medium">{new Date(viewMoreItem.fecha).toLocaleString('es-MX')}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Registrado por</p>
                            <p className="font-medium text-gray-900">{viewMoreItem.usuario_detalle?.username || '—'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Notas</p>
                            <p className="text-sm text-gray-800">{viewMoreItem.notas || 'Sin notas.'}</p>
                        </div>
                        <div className="pt-2">
                            <button onClick={() => setViewMoreItem(null)} className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </PortalModal>
            )}

            {showModal && (
                <PortalModal title={`Registrar ${tipo}`} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                            <select className="form-input bg-white" name="material" required value={form.material} onChange={handleChange}>
                                <option value="">-- Selecciona --</option>
                                {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre} (Stock: {m.stock_actual})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                            <input className="form-input" type="number" name="cantidad" min="1" required value={form.cantidad} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
                            <textarea className="form-input" name="notas" rows={2} value={form.notas} onChange={handleChange} placeholder="Motivo o proveedor..." />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancelar</button>
                            <button type="submit" style={{ background: tipo === 'EGRESO' ? '#ef4444' : '#16a34a' }} className="login-btn">
                                Registrar {tipo}
                            </button>
                        </div>
                    </form>
                </PortalModal>
            )}
        </div>
    );
}
