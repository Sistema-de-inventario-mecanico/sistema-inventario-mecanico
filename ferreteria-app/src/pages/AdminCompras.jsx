import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';
import { PortalModal, useToast } from '../components/Toast';

export default function AdminCompras() {
    const { showToast, ToastContainer } = useToast();
    const [materiales, setMateriales] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewMoreItem, setViewMoreItem] = useState(null);
    const [form, setForm] = useState({ material: '', cantidad: 1, proveedor: '', notas: '' });

    const load = async () => {
        try {
            const [mat, mov] = await Promise.all([api.get('materiales/'), api.get('movimientos/')]);
            setMateriales(mat.data);
            setMovimientos(mov.data.filter(m => m.tipo === 'INGRESO'));
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
        const notas = [form.proveedor && `Proveedor: ${form.proveedor}`, form.notas].filter(Boolean).join(' | ');

        try {
            await api.post(`materiales/${mat.id}/ajustar_stock/`, {
                tipo: 'INGRESO',
                cantidad,
                notas,
            });
            setShowModal(false);
            showToast(`Compra registrada. Stock de "${mat.nombre}" actualizado.`, 'success');
            setForm({ material: '', cantidad: 1, proveedor: '', notas: '' });
            load();
        } catch (err) {
            showToast('Error al registrar compra.', 'error');
            console.error(err);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando...</div>;

    return (
        <div className="space-y-6">
            <ToastContainer />
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark">Compras de Material</h2>
                    <p className="text-gray-500 text-sm mt-1">Registra nuevas compras para reponer el inventario.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-colors font-medium text-sm">
                    <ShoppingCartIcon className="w-5 h-5" />
                    <span>Nueva Compra</span>
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {materiales.slice(0, 4).map(m => (
                    <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide truncate">{m.nombre}</p>
                        <p className={`text-3xl font-bold mt-1 ${m.stock_actual <= m.stock_min ? 'text-red-500' : 'text-dark'}`}>{m.stock_actual}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Mín: {m.stock_min}</p>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-dark">Historial de Compras</h3>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Material</th>
                            <th className="px-6 py-4">Cantidad</th>
                            <th className="px-6 py-4">Registrado por</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Notas / Proveedor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {movimientos.map(mov => (
                            <tr key={mov.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-gray-900">{mov.material_detalle?.nombre || `Material #${mov.material}`}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 text-green-700 font-bold">
                                        <CheckIcon className="w-4 h-4" />+{mov.cantidad}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-gray-600">{mov.usuario_detalle?.username || '—'}</td>
                                <td className="px-6 py-4 text-gray-500 text-xs">{new Date(mov.fecha).toLocaleString('es-MX')}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm max-w-xs truncate">{mov.notas || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {movimientos.length === 0 && (
                    <div className="text-center py-12 text-gray-400">Sin compras registradas aún.</div>
                )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                <h3 className="font-bold text-gray-900 px-1">Historial de Compras</h3>
                {movimientos.map(mov => (
                    <div key={mov.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-gray-900">{mov.material_detalle?.nombre || `Material #${mov.material}`}</p>
                                <p className="text-xs text-gray-500">{new Date(mov.fecha).toLocaleDateString('es-MX')}</p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2 py-1 rounded">
                                <CheckIcon className="w-4 h-4" />+{mov.cantidad}
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
                        <p className="font-medium">Sin compras registradas aún.</p>
                    </div>
                )}
            </div>

            {/* View More Modal */}
            {viewMoreItem && (
                <PortalModal title="Detalle de Compra" onClose={() => setViewMoreItem(null)}>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Material</p>
                            <p className="font-bold text-gray-900">{viewMoreItem.material_detalle?.nombre || `Material #${viewMoreItem.material}`}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Cantidad</p>
                                <p className="font-bold text-green-700">+{viewMoreItem.cantidad} unidades</p>
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
                            <p className="text-sm text-gray-500 mb-1">Notas / Proveedor</p>
                            <p className="text-sm text-gray-800">{viewMoreItem.notas || 'Sin notas adicionales.'}</p>
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
                <PortalModal title="Registrar Nueva Compra" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Material a reabastecer</label>
                            <select className="form-input bg-white" name="material" required value={form.material} onChange={handleChange}>
                                <option value="">-- Seleccionar material --</option>
                                {materiales.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.nombre} — Stock actual: {m.stock_actual} {m.stock_actual <= m.stock_min ? '⚠ BAJO' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad comprada</label>
                            <input className="form-input" type="number" name="cantidad" min="1" required value={form.cantidad} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor (opcional)</label>
                            <input className="form-input" type="text" name="proveedor" placeholder="Ej. Ferretería el Torno S.A." value={form.proveedor} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                            <textarea className="form-input" name="notas" rows={2} placeholder="Número de factura, observaciones..." value={form.notas} onChange={handleChange} />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancelar</button>
                            <button type="submit" className="login-btn">Registrar Compra</button>
                        </div>
                    </form>
                </PortalModal>
            )}
        </div>
    );
}
