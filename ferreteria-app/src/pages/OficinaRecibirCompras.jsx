import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { InboxArrowDownIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { PortalModal, useToast, useConfirm } from '../components/Toast';

export default function OficinaRecibirCompras() {
    const { showToast, ToastContainer } = useToast();
    const { confirmDialog, ConfirmDialogContainer } = useConfirm();
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [form, setForm] = useState({
        cantidad_llegada: 0,
        cantidad_buena: 0,
        cantidad_regular: 0,
        cantidad_mala: 0,
        comentario_malo: ''
    });

    const load = async () => {
        try {
            const res = await api.get('compras/');
            // Only show pending ones for the reception view
            setCompras(res.data.filter(c => c.estado === 'PENDIENTE'));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        const intervalId = setInterval(load, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSelect = (compra) => {
        setSelectedCompra(compra);
        setForm({
            cantidad_llegada: compra.cantidad_pedida,
            cantidad_buena: compra.cantidad_pedida,
            cantidad_regular: 0,
            cantidad_mala: 0,
            comentario_malo: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'comentario_malo' ? value : parseInt(value, 10) || 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const totalAsignado = form.cantidad_buena + form.cantidad_regular + form.cantidad_mala;
        if (totalAsignado > form.cantidad_llegada) {
            return showToast('Las cantidades de estado superan la cantidad llegada.', 'error');
        }
        if (form.cantidad_mala > 0 && !form.comentario_malo) {
            return showToast('Debes agregar un comentario para el material malo.', 'warning');
        }

        const ok = await confirmDialog(
            'Confirmar Recepción',
            `¿Confirmas la recepción de ${form.cantidad_llegada} unidades de ${selectedCompra.material_nombre}? El stock será actualizado.`
        );
        if (!ok) return;

        try {
            await api.post(`compras/${selectedCompra.id}/recibir/`, form);
            showToast('Compra recibida y stock actualizado.', 'success');
            setSelectedCompra(null);
            load();
        } catch (err) {
            const msg = err.response?.data?.error || 'Error al recibir compra';
            showToast(msg, 'error');
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando compras pendientes...</div>;

    return (
        <div className="space-y-6">
            <ToastContainer />
            <ConfirmDialogContainer />
            <div>
                <h2 className="text-2xl font-bold text-dark text-slate-800">Recibir Compras</h2>
                <p className="text-gray-500 text-sm mt-1">Confirma la llegada de material pedido por administración.</p>
            </div>

            <div className="grid gap-4">
                {compras.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
                        <InboxArrowDownIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No hay compras pendientes de recibir.</p>
                    </div>
                ) : (
                    compras.map(compra => (
                        <div key={compra.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{compra.material_nombre}</h3>
                                <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <InboxArrowDownIcon className="w-4 h-4" />
                                        Pedido: <strong>{compra.cantidad_pedida} unidades</strong>
                                    </span>
                                    <span>Proveedor: {compra.proveedor || 'N/A'}</span>
                                    <span>Fecha: {new Date(compra.fecha_compra).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleSelect(compra)}
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-bold shadow-sm transition-colors w-full md:w-auto"
                            >
                                Registrar Recepción
                            </button>
                        </div>
                    ))
                )}
            </div>

            {selectedCompra && (
                <PortalModal title={`Recibir: ${selectedCompra.material_nombre}`} onClose={() => setSelectedCompra(null)}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                            <p className="text-sm text-blue-700 font-medium">
                                Se pidieron <strong>{selectedCompra.cantidad_pedida}</strong> unidades. 
                                Por favor indica cuántas llegaron físicamente y en qué estado se encuentran.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Cantidad que llegó físicamente</label>
                            <input 
                                className="form-input text-lg font-bold" 
                                type="number" 
                                name="cantidad_llegada" 
                                min="1" 
                                required 
                                value={form.cantidad_llegada} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <label className="block text-[10px] uppercase font-bold text-green-600">Estado Bueno</label>
                                <input 
                                    className="form-input border-green-200 focus:ring-green-500" 
                                    type="number" 
                                    name="cantidad_buena" 
                                    min="0" 
                                    value={form.cantidad_buena} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] uppercase font-bold text-yellow-600">Estado Regular</label>
                                <input 
                                    className="form-input border-yellow-200 focus:ring-yellow-500" 
                                    type="number" 
                                    name="cantidad_regular" 
                                    min="0" 
                                    value={form.cantidad_regular} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] uppercase font-bold text-red-600">Estado Malo</label>
                                <input 
                                    className="form-input border-red-200 focus:ring-red-500" 
                                    type="number" 
                                    name="cantidad_mala" 
                                    min="0" 
                                    value={form.cantidad_mala} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {form.cantidad_mala > 0 && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-bold text-gray-700 mb-1">¿Por qué está malo? (Comentario)</label>
                                <textarea 
                                    className="form-input border-red-200" 
                                    name="comentario_malo" 
                                    rows={2} 
                                    required
                                    placeholder="Ej: Empaque roto, material oxidado, piezas faltantes..."
                                    value={form.comentario_malo} 
                                    onChange={handleChange} 
                                />
                            </div>
                        )}

                        <div className="pt-2 flex gap-3">
                            <button type="button" onClick={() => setSelectedCompra(null)} className="cancel-btn flex-1">Cancelar</button>
                            <button type="submit" className="login-btn flex-1">Confirmar Recepción</button>
                        </div>
                    </form>
                </PortalModal>
            )}
        </div>
    );
}
