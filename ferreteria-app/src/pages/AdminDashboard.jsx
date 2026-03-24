import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { PortalModal } from '../components/Toast';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        materials: [],
        requests: []
    });
    const [viewMoreAlert, setViewMoreAlert] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matRes, reqRes] = await Promise.all([
                    api.get('materiales/'),
                    api.get('solicitudes/')
                ]);
                setStats({ materials: matRes.data, requests: reqRes.data });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <div className="text-center p-10">Cargando métricas...</div>;

    // Data Processing for Charts
    const stockMinAlerts = stats.materials.filter(m => m.stock_actual <= m.stock_min);
    
    // Most requested items
    const requestCount = {};
    stats.requests.forEach(req => {
        const name = req.material_detalle.nombre;
        requestCount[name] = (requestCount[name] || 0) + req.cantidad;
    });

    const popularData = {
        labels: Object.keys(requestCount).slice(0, 5),
        datasets: [{
            label: 'Unidades Solicitadas',
            data: Object.values(requestCount).slice(0, 5),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 6
        }]
    };

    const statusCount = { PENDIENTE: 0, APROBADA: 0, ENTREGADA: 0, DEVUELTA: 0, RECHAZADA: 0 };
    stats.requests.forEach(req => {
        if (statusCount[req.estado] !== undefined) {
            statusCount[req.estado]++;
        }
    });

    const statusData = {
        labels: Object.keys(statusCount),
        datasets: [{
            data: Object.values(statusCount),
            backgroundColor: [
                '#f59e0b', // Pendiente - yellow
                '#3b82f6', // Aprobada - blue
                '#8b5cf6', // Entregada - purple
                '#10b981', // Devuelta - green
                '#ef4444'  // Rechazada - red
            ],
            borderWidth: 0,
        }]
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Monitoreo General</h2>
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Materiales</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.materials.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
                        📦
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Solicitudes Activas</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {stats.requests.filter(r => r.estado !== 'DEVUELTA' && r.estado !== 'RECHAZADA').length}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-2xl">
                        📝
                    </div>
                </div>
                <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-red-600">Stock Crítico</p>
                        <p className="text-3xl font-bold text-red-700 mt-2">{stockMinAlerts.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl">
                        ⚠️
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Material Más Solicitado</h3>
                    <div className="h-64">
                        <Bar 
                            data={popularData} 
                            options={{ responsive: true, maintainAspectRatio: false }} 
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Estado de Solicitudes</h3>
                    <div className="h-64 flex justify-center">
                        <Pie 
                            data={statusData} 
                            options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    </div>
                </div>
            </div>

            {/* Critical Stock Alert Table */}
            {stockMinAlerts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-red-50">
                        <h3 className="text-lg font-bold text-red-800">Alertas de Stock Mínimo</h3>
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Material</th>
                                    <th className="px-6 py-3">Categoría</th>
                                    <th className="px-6 py-3">Stock Actual</th>
                                    <th className="px-6 py-3">Mínimo Requerido</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stockMinAlerts.map(mat => (
                                    <tr key={mat.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{mat.nombre}</td>
                                        <td className="px-6 py-4 text-gray-500">{mat.categoria}</td>
                                        <td className="px-6 py-4 font-bold text-red-600">{mat.stock_actual}</td>
                                        <td className="px-6 py-4 text-gray-500">{mat.stock_min}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="md:hidden p-4 space-y-4">
                        {stockMinAlerts.map(mat => (
                            <div key={mat.id} className="bg-white p-4 rounded-xl shadow-sm border border-red-200 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900">{mat.nombre}</p>
                                        <p className="text-xs text-gray-500">{mat.categoria}</p>
                                    </div>
                                    <span className="text-xl font-bold text-red-600">
                                        {mat.stock_actual}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => setViewMoreAlert(mat)}
                                    className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg text-sm transition-colors mt-1 border border-red-100"
                                >
                                    Ver Alerta
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* View More Modal */}
            {viewMoreAlert && (
                <PortalModal title="Detalle de Alerta" onClose={() => setViewMoreAlert(null)}>
                    <div className="space-y-4">
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                            <h3 className="text-xl font-bold text-red-900">{viewMoreAlert.nombre}</h3>
                            <p className="text-sm font-semibold text-red-700 mt-1">Requiere reabastecimiento urgente</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Stock Actual</p>
                                <p className="font-bold text-2xl text-red-600">{viewMoreAlert.stock_actual}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Mínimo Permitido</p>
                                <p className="font-medium text-xl text-gray-700">{viewMoreAlert.stock_min}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500">Categoría</p>
                                <p className="font-medium">{viewMoreAlert.categoria}</p>
                            </div>
                        </div>
                        <div className="pt-2">
                            <button onClick={() => setViewMoreAlert(null)} className="w-full py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                                Entendido
                            </button>
                        </div>
                    </div>
                </PortalModal>
            )}
        </div>
    );
}
