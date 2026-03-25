import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShoppingCartIcon, CheckIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PortalModal, useToast, useConfirm } from '../components/Toast';

export default function AdminCompras() {
    const { showToast, ToastContainer } = useToast();
    const { confirmDialog, ConfirmDialogContainer } = useConfirm();
    const [materiales, setMateriales] = useState([]);
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewMoreItem, setViewMoreItem] = useState(null);
    const [form, setForm] = useState({ material: '', cantidad_pedida: 1, proveedor: '', notas: '' });

    const load = async () => {
        try {
            const [mat, com] = await Promise.all([api.get('materiales/'), api.get('compras/')]);
            setMateriales(mat.data);
            setCompras(com.data);
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

        const ok = await confirmDialog(
            'Confirmar Compra',
            \`¿Estás seguro de registrar esta orden de compra por \${form.cantidad_pedida} unidades de \${mat.nombre}?\`
        );
        if (!ok) return;

        try {
            await api.post('compras/', {
                material: mat.id,
                cantidad_pedida: parseInt(form.cantidad_pedida, 10),
                proveedor: form.proveedor,
                notas: form.notas,
            });
            setShowModal(false);
            showToast(\`Orden de compra para "\${mat.nombre}" registrada. Pendiente de recibir por oficina.\`, 'success');
            setForm({ material: '', cantidad_pedida: 1, proveedor: '', notas: '' });
            load();
        } catch (err) {
            showToast('Error al registrar orden de compra.', 'error');
            console.error(err);
        }
    };

    const handleCancelar = async (id, nombre) => {
        const ok = await confirmDialog(
            'Cancelar Orden',
            \`¿Estás seguro de cancelar la orden de compra de "\${nombre}"? Esta acción no se puede deshacer.\`
        );
        if (!ok) return;

        try {
            await api.post(\`compras/\${id}/cancelar/\`);
            showToast('Orden de compra cancelada.', 'success');
            load();
        } catch (err) {
            showToast('Error al cancelar la orden.', 'error');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDIENTE': return 'bg-amber-100 text-amber-700 font-bold';
            case 'RECIBIDA': return 'bg-green-100 text-green-700 font-bold';
            case 'CANCELADA': return 'bg-red-100 text-red-700 font-bold';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando compras...</div>;

    return (
        <div className="space-y-6">
            <ToastContainer />
            <ConfirmDialogContainer />
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark">Gestión de Compras</h2>
                    <p className="text-gray-500 text-sm mt-1">Crea órdenes de compra que el encargado de oficina recibirá físicamente.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-colors font-medium text-sm">
                    <ShoppingCartIcon className="w-5 h-5" />
                    <span>Nueva Orden de Compra</span>
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {materiales.slice(0, 4).map(m => (
                    <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide truncate">{m.nombre}</p>
                        <p className={\`text-3xl font-bold mt-1 \${m.stock_actual <= m.stock_min ? 'text-red-500' : 'text-dark'}\`}>{m.stock_actual}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Mín: {m.stock_min}</p>
                    </div>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-dark">Historial de Órdenes</h3>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Material</th>
                            <th className="px-6 py-4">Cantidad Pedida</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Fecha Pedido</th>
                            <th className="px-6 py-4">Proveedor / Notas</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {compras.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{c.material_nombre}</td>
                                <td className="px-6 py-4 font-bold text-gray-700">{c.cantidad_pedida}</td>
                                <td className="px-6 py-4 text-xs font-bold">
                                    <span className={\`px-2 py-1 rounded-full text-[10px] \${getStatusStyle(c.estado)}\`}>
                                        {c.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">{new Date(c.fecha_compra).toLocaleString('es-MX')}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm max-w-xs truncate">{c.proveedor || '—'} {c.notes && \` | \${c.notes}\`}</td>
                                <td className="px-6 py-4 text-center">
                                    {c.estado === 'PENDIENTE' && (
                                        <button 
                                            onClick={() => handleCancelar(c.id, c.material_nombre)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Cancelar Compra"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {compras.length === 0 && <div className="text-center py-12 text-gray-400">Sin órdenes registradas.</div>}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                <h3 className="font-bold text-gray-900 px-1">Historial de Órdenes</h3>
                {compras.map(c => (
                    <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-gray-900">{c.material_nombre}</p>
                                <p className="text-xs text-gray-500">{new Date(c.fecha_compra).toLocaleDateString('es-MX')}</p>
                            </div>
                            <span className={\`px-2 py-1 rounded-full text-[10px] \${getStatusStyle(c.estado)}\`}>
                                {c.estado}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Cantidad: <span className="text-dark font-bold">{c.cantidad_pedida} ui</span></span>
                            {c.estado === 'PENDIENTE' && (
                                <button 
                                    onClick={() => handleCancelar(c.id, c.material_nombre)}
                                    className="text-red-500 text-xs font-bold border border-red-100 px-3 py-1 rounded-lg hover:bg-red-50"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {compras.length === 0 && (
                    <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-gray-100">
                        <p className="font-medium">Sin compras registradas aún.</p>
                    </div>
                )}
            </div>

            {showModal && (
                <PortalModal title="Nueva Orden de Compra" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Material a pedir</label>
                            <select className="form-input bg-white" name="material" required value={form.material} onChange={handleChange}>
                                <option value="">-- Seleccionar material --</option>
                                {materiales.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.nombre} (Stock: {m.stock_actual})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad a comprar</label>
                            <input className="form-input" type="number" name="cantidad_pedida" min="1" required value={form.cantidad_pedida} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor sugerido</label>
                            <input className="form-input" type="text" name="proveedor" placeholder="Nombre de la ferretería" value={form.proveedor} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas para almacén</label>
                            <textarea className="form-input" name="notas" rows={2} placeholder="Número de presupuesto, urgencia, etc." value={form.notas} onChange={handleChange} />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)} className="cancel-btn flex-1">Cancelar</button>
                            <button type="submit" className="login-btn flex-1">Crear Orden</button>
                        </div>
                    </form>
                </PortalModal>
            )}
        </div>
    );
}
