import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { WrenchScrewdriverIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';

export default function Login() {
    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        // Matricula can be "admin" or exactly 6 chars, mostly uppercase logic depending on user.
        // We will pass the matricula raw to DB to support custom superusers like 'arturo'
        const result = await login(matricula.trim(), password);
        
        setLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden font-sans">
            {/* Background design */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl relative z-10 border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
                        <WrenchScrewdriverIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-dark tracking-tight">Acceso al Sistema</h2>
                    <p className="text-gray-500 mt-2 text-sm text-center">Ferretería & Inventario Mecánico</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-6 text-sm font-medium flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Matrícula</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                required
                                maxLength="10"
                                className="pl-10 w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-3 transition-colors bg-gray-50"
                                placeholder="Ej: JD0426"
                                value={matricula}
                                onChange={(e) => setMatricula(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                className="pl-10 w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-3 transition-colors bg-gray-50"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span>Ingresar</span>
                        )}
                    </button>
                    
                    <p className="text-xs text-gray-400 text-center mt-6">
                        El acceso es restringido a personal autorizado.
                    </p>
                </form>
            </div>
        </div>
    );
}
