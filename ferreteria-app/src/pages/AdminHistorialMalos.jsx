import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ExclamationTriangleIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function AdminHistorialMalos() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const res = await api.get('historial-malos/');
            setHistorial(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando historial de desperfectos...</div>;

    // Basic stats
    const totalPiezasMalas = historial.reduce((acc, current) => acc + current.cantidad, 0);
    const materialMasDefectuoso = historial.reduce((acc, curr) => {
        acc[curr.material_nombre] = (acc[curr.material_nombre] || 0) + curr.cantidad;
        return acc;
    }, {});
    
    const sortedMaterials = Object.entries(materialMasDefectuoso).sort((a, b) => b[1] - a[1]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Historial de Material Defectuoso</h2>
                <p className="text-gray-500 text-sm mt-1">Monitorea los desperfectos reportados en recepciones y devoluciones.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-bold text-gray-700">Total Piezas Malas</h3>
                    </div>
                    <p className="text-4xl font-black text-red-600">{totalPiezasMalas}</p>
                    <p className="text-xs text-gray-400 mt-2">Acumulado total de incidentes</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <ChartBarIcon className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="font-bold text-gray-700">Materiales más Defectuosos</h3>
                    </div>
                    <div className="space-y-3">
                        {sortedMaterials.slice(0, 3).map(([name, count]) => (
                            <div key={name} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">{name}</span>
                                <div className="flex items-center gap-2 flex-1 mx-4">
                                    <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
                                        <div 
                                            className="h-full bg-red-500 rounded-full" 
                                            style={{ width: `${(count / totalPiezasMalas) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-900 w-8">{count}</span>
                                </div>
                            </div>
                        ))}
                        {sortedMaterials.length === 0 && <p className="text-sm text-gray-400">Sin datos registrados.</p>}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-slate-800">Registro Detallado de Incidentes</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Material</th>
                                <th className="px-6 py-4">Cantidad</th>
                                <th className="px-6 py-4">Origen</th>
                                <th className="px-6 py-4">Reportado Por</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Comentario</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {historial.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">No se han registrado productos malos aún.</td>
                                </tr>
                            ) : historial.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{item.material_nombre}</p>
                                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-gray-500 uppercase">{item.material_categoria}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">-{item.cantidad}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.solicitud ? (
                                            <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-[10px] font-bold">DEVOLUCIÓN #{item.solicitud}</span>
                                        ) : item.compra ? (
                                            <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-[10px] font-bold">COMPRA #{item.compra}</span>
                                        ) : (
                                            <span className="text-gray-400">Manual</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{item.reportado_por_detalle?.username}</td>
                                    <td className="px-6 py-4 text-gray-500 flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3" />
                                        {new Date(item.fecha).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 italic max-w-xs">{item.comentario || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
