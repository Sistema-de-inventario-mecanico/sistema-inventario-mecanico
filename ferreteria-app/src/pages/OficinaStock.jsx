import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PortalModal } from '../components/Toast';

/**
 * Stock view for Encargado de Oficina.
 * Shows read-only stock state with material conditions and categories.
 */
export default function OficinaStock() {
    const [materiales, setMateriales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('TODOS');
    const [viewMoreItem, setViewMoreItem] = useState(null);

    useEffect(() => {
        const fetchMateriales = () => {
            api.get('materiales/')
                .then(r => setMateriales(r.data))
                .catch(console.error)
                .finally(() => setLoading(false));
        };
        fetchMateriales();
        const intervalId = setInterval(fetchMateriales, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const categorias = ['TODOS', 'HERRAMIENTA', 'CONSUMIBLE', 'UNIDAD'];
    const filtered = filtro === 'TODOS' ? materiales : materiales.filter(m => m.categoria === filtro);

    const catColors = {
        HERRAMIENTA: 'bg-blue-100 text-blue-700',
        CONSUMIBLE: 'bg-yellow-100 text-yellow-700',
        UNIDAD: 'bg-purple-100 text-purple-700',
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando inventario...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-dark">Inventario en Almacén</h2>
                <p className="text-gray-500 text-sm mt-1">Consulta el estado actual del inventario del taller.</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total materiales', value: materiales.length, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Con stock bajo', value: materiales.filter(m => m.stock_actual <= m.stock_min).length, color: 'bg-red-50 text-red-700' },
                    { label: 'Sin stock', value: materiales.filter(m => m.stock_actual === 0).length, color: 'bg-orange-50 text-orange-700' },
                ].map(c => (
                    <div key={c.label} className={`rounded-xl p-4 border border-gray-100 shadow-sm bg-white`}>
                        <p className="text-xs text-gray-500 font-semibold uppercase">{c.label}</p>
                        <p className={`text-3xl font-bold mt-1 ${c.color.split(' ')[1]}`}>{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {categorias.map(cat => (
                    <button key={cat} onClick={() => setFiltro(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filtro === cat ? 'bg-primary text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Material</th>
                            <th className="px-6 py-4">Categoría</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Nivel</th>
                            <th className="px-6 py-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(m => {
                            const isLow = m.stock_actual <= m.stock_min;
                            const isEmpty = m.stock_actual === 0;
                            const pct = Math.min(100, Math.round((m.stock_actual / Math.max(m.stock_max, 1)) * 100));
                            return (
                                <tr key={m.id} className={isEmpty ? 'bg-orange-50/30' : isLow ? 'bg-red-50/30' : 'hover:bg-gray-50/50'}>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{m.nombre}</p>
                                        {m.descripcion && <p className="text-xs text-gray-400 truncate max-w-xs">{m.descripcion}</p>}
                                    </td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${catColors[m.categoria]}`}>{m.categoria}</span></td>
                                    <td className="px-6 py-4">
                                        <span className={`text-lg font-bold ${isEmpty ? 'text-orange-600' : isLow ? 'text-red-600' : 'text-dark'}`}>{m.stock_actual}</span>
                                        <span className="text-xs text-gray-400 ml-1">/ {m.stock_max}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all ${isEmpty ? 'bg-orange-400' : isLow ? 'bg-red-400' : pct > 50 ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEmpty ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Sin Stock</span>
                                        ) : isLow ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">⚠ Stock Bajo</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">✓ Normal</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-10 text-gray-400">No hay materiales en esta categoría.</div>
                )}
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
                {filtered.map(m => {
                    const isLow = m.stock_actual <= m.stock_min;
                    const isEmpty = m.stock_actual === 0;
                    return (
                        <div key={m.id} className={`bg-white p-4 rounded-xl shadow-sm border ${isEmpty ? 'border-orange-200 bg-orange-50/10' : isLow ? 'border-red-200 bg-red-50/10' : 'border-gray-100'} flex flex-col gap-3`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-900">{m.nombre}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{m.categoria}</p>
                                </div>
                                <span className={`text-xl font-bold ${isEmpty ? 'text-orange-600' : isLow ? 'text-red-600' : 'text-gray-900'}`}>
                                    {m.stock_actual}
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
                {filtered.length === 0 && (
                    <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-gray-100 shadow-sm">
                        No hay materiales en esta categoría.
                    </div>
                )}
            </div>

            {/* View More Modal */}
            {viewMoreItem && (
                <PortalModal title="Detalle de Stock" onClose={() => setViewMoreItem(null)}>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                            <h3 className="text-xl font-bold text-gray-900">{viewMoreItem.nombre}</h3>
                            {viewMoreItem.descripcion && <p className="text-sm text-gray-500 mt-2 italic">"{viewMoreItem.descripcion}"</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Categoría</p>
                                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${catColors[viewMoreItem.categoria]}`}>
                                    {viewMoreItem.categoria}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Estado de Stock</p>
                                <p className={`mt-1 font-bold ${viewMoreItem.stock_actual === 0 ? 'text-orange-600' : viewMoreItem.stock_actual <= viewMoreItem.stock_min ? 'text-red-600' : 'text-green-600'}`}>
                                    {viewMoreItem.stock_actual} / {viewMoreItem.stock_max}
                                </p>
                            </div>
                        </div>
                        <div className="pt-2">
                            <button onClick={() => setViewMoreItem(null)} className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </PortalModal>
            )}
        </div>
    );
}
