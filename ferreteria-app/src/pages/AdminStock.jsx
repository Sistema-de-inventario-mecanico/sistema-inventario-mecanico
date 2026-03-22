import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PlusIcon, PencilSquareIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { PortalModal, useToast, useConfirm } from '../components/Toast';

const CATEGORIAS = ['HERRAMIENTA', 'CONSUMIBLE', 'UNIDAD'];

export default function AdminStock() {
    const { showToast, ToastContainer } = useToast();
    const { confirmDialog, ConfirmDialogContainer } = useConfirm();
    const [materiales, setMateriales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewMoreItem, setViewMoreItem] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ nombre: '', descripcion: '', clave: '', categoria: 'HERRAMIENTA', stock_actual: 0, stock_min: 5, stock_max: 100 });

    const loadMateriales = async () => {
        try { setMateriales((await api.get('materiales/')).data); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        loadMateriales();
        const intervalId = setInterval(loadMateriales, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const openModal = (item = null) => {
        setEditingItem(item);
        setForm(item ? { nombre: item.nombre, descripcion: item.descripcion, clave: item.clave || '', categoria: item.categoria, stock_actual: item.stock_actual, stock_min: item.stock_min, stock_max: item.stock_max } : { nombre: '', descripcion: '', clave: '', categoria: 'HERRAMIENTA', stock_actual: 0, stock_min: 5, stock_max: 100 });
        setShowModal(true);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Cast numeric fields to integers to satisfy Django IntegerField
        const payload = {
            ...form,
            clave: form.clave.trim() || null,
            stock_actual: parseInt(form.stock_actual, 10),
            stock_min: parseInt(form.stock_min, 10),
            stock_max: parseInt(form.stock_max, 10),
        };

        if (payload.stock_min > payload.stock_max) {
            showToast('El stock mínimo no puede superar al stock máximo.', 'error');
            return;
        }

        try {
            if (editingItem) {
                await api.patch(`materiales/${editingItem.id}/`, payload);
            } else {
                await api.post('materiales/', payload);
            }
            setShowModal(false);
            loadMateriales();
        } catch (err) {
            const detail = err.response?.data;
            let msg = 'Verifica tu conexión con el servidor.';
            if (detail) {
                if (detail.clave) {
                    msg = 'Ya existe un material registrado con esta clave/código.';
                } else {
                    msg = JSON.stringify(detail);
                }
            }
            showToast('Error al guardar material: ' + msg, 'error');
            console.error(err);
        }
    };

    const handleDelete = async (id, nombre) => {
        const ok = await confirmDialog(
            `¿Eliminar "${nombre}"?`,
            'Esto puede afectar solicitudes existentes vinculadas a este material.'
        );
        if (!ok) return;
        try { await api.delete(`materiales/${id}/`); showToast('Material eliminado.', 'success'); loadMateriales(); }
        catch { showToast('No se pudo eliminar el material.', 'error'); }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando inventario...</div>;

    const stockBajo = materiales.filter(m => m.stock_actual <= m.stock_min);

    return (
        <div className="space-y-6">
            <ToastContainer />
            <ConfirmDialogContainer />
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark">Stock e Inventario</h2>
                    <p className="text-gray-500 text-sm mt-1">Gestiona el catálogo de herramientas y materiales disponibles.</p>
                </div>
                <button onClick={() => openModal()} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-colors font-medium text-sm">
                    <PlusIcon className="w-5 h-5" />
                    <span>Nuevo Material</span>
                </button>
            </div>

            {stockBajo.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-semibold text-red-800 text-sm">⚠ Alerta de Stock Bajo</p>
                        <p className="text-red-600 text-sm mt-1">
                            {stockBajo.map(m => m.nombre).join(', ')} — están por debajo del mínimo.
                        </p>
                    </div>
                </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Clave</th>
                            <th className="px-6 py-4">Material</th>
                            <th className="px-6 py-4">Categoría</th>
                            <th className="px-6 py-4">Stock Actual</th>
                            <th className="px-6 py-4">Mín / Máx</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {materiales.map(m => {
                            const isLow = m.stock_actual <= m.stock_min;
                            const pct = Math.min(100, Math.round((m.stock_actual / m.stock_max) * 100));
                            return (
                                <tr key={m.id} className={isLow ? 'bg-red-50/40' : 'hover:bg-gray-50/50'}>
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{m.clave || '—'}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{m.nombre}</p>
                                        {m.descripcion && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{m.descripcion}</p>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700">{m.categoria}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-lg font-bold ${isLow ? 'text-red-600' : 'text-gray-800'}`}>{m.stock_actual}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{m.stock_min} / {m.stock_max}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${isLow ? 'bg-red-400' : pct > 50 ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-xs text-gray-400">{pct}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => openModal(m)} className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm">
                                            <PencilSquareIcon className="w-4 h-4" /> Editar
                                        </button>
                                        <button onClick={() => handleDelete(m.id, m.nombre)} className="text-red-400 hover:text-red-600 flex items-center gap-1 text-sm">
                                            <TrashIcon className="w-4 h-4" /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {materiales.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-lg font-medium">No hay materiales registrados.</p>
                        <p className="text-sm">Da clic en "Nuevo Material" para agregar el primer artículo.</p>
                    </div>
                )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {materiales.map(m => {
                    const isLow = m.stock_actual <= m.stock_min;
                    return (
                        <div key={m.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-900">{m.nombre}</p>
                                    <p className="text-xs text-gray-500 font-mono mb-1">{m.clave || 'Sin clave'}</p>
                                    <p className="text-xs text-gray-500">{m.categoria}</p>
                                </div>
                                <span className={`text-lg font-bold ${isLow ? 'text-red-600' : 'text-gray-800'}`}>
                                    {m.stock_actual} ud.
                                </span>
                            </div>
                            <button 
                                onClick={() => setViewMoreItem(m)}
                                className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-primary font-medium rounded-lg text-sm border border-gray-200"
                            >
                                Ver Info
                            </button>
                        </div>
                    );
                })}
                {materiales.length === 0 && (
                    <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-gray-100">
                        <p className="font-medium">No hay materiales registrados.</p>
                    </div>
                )}
            </div>

            {viewMoreItem && (
                <PortalModal title="Detalles del Material" onClose={() => setViewMoreItem(null)}>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Nombre</p>
                            <p className="font-bold text-gray-900">{viewMoreItem.nombre}</p>
                            {viewMoreItem.clave && <p className="text-sm text-gray-500 font-mono mt-1">Clave: {viewMoreItem.clave}</p>}
                            {viewMoreItem.descripcion && <p className="text-sm text-gray-600 mt-1">{viewMoreItem.descripcion}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Categoría</p>
                                <p className="font-medium">{viewMoreItem.categoria}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Estado de Stock</p>
                                <p className={`font-bold ${viewMoreItem.stock_actual <= viewMoreItem.stock_min ? 'text-red-600' : 'text-green-600'}`}>
                                    {viewMoreItem.stock_actual} / {viewMoreItem.stock_max}
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex gap-3">
                            <button onClick={() => { setViewMoreItem(null); openModal(viewMoreItem); }} className="flex-1 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <PencilSquareIcon className="w-4 h-4" /> Editar
                            </button>
                            <button onClick={() => { setViewMoreItem(null); handleDelete(viewMoreItem.id, viewMoreItem.nombre); }} className="flex-1 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <TrashIcon className="w-4 h-4" /> Eliminar
                            </button>
                        </div>
                    </div>
                </PortalModal>
            )}

            {showModal && (
                <PortalModal title={editingItem ? 'Editar Material' : 'Nuevo Material'} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Material</label>
                                <input className="form-input" type="text" name="nombre" required value={form.nombre} onChange={handleChange} placeholder="Ej. Llave de impacto 1/2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Clave</label>
                                <input className="form-input" type="text" name="clave" value={form.clave} onChange={handleChange} placeholder="Opcional" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                            <textarea className="form-input" name="descripcion" rows={2} value={form.descripcion} onChange={handleChange} placeholder="Detalles adicionales..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select className="form-input bg-white" name="categoria" value={form.categoria} onChange={handleChange}>
                                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Actual</label>
                                <input className="form-input" type="number" name="stock_actual" min="0" value={form.stock_actual} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mín</label>
                                <input className="form-input" type="number" name="stock_min" min="0" value={form.stock_min} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Máx</label>
                                <input className="form-input" type="number" name="stock_max" min="1" value={form.stock_max} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancelar</button>
                            <button type="submit" className="login-btn">{editingItem ? 'Guardar Cambios' : 'Crear Material'}</button>
                        </div>
                    </form>
                </PortalModal>
            )}
        </div>
    );
}
