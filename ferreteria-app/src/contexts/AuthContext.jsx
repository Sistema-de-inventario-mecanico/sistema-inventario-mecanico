import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            // Try to restore user from sessionStorage first (fast)
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    sessionStorage.removeItem('user');
                }
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Step 1: Get JWT tokens
            const response = await api.post('token/', { username, password });
            const { access, refresh } = response.data;
            sessionStorage.setItem('access_token', access);
            sessionStorage.setItem('refresh_token', refresh);

            // Step 2: Fetch the current user's profile using the /me endpoint
            const meResp = await api.get('usuarios/me/');
            const currentUser = meResp.data;

            sessionStorage.setItem('user', JSON.stringify(currentUser));
            setUser(currentUser);
            navigate('/');
            return { success: true };
        } catch (error) {
            // Clean up if login fails
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            sessionStorage.removeItem('user');

            let msg = 'Error de conexión con el servidor';
            if (error.response) {
                if (error.response.status === 401) {
                    msg = 'Matrícula o contraseña incorrecta';
                } else {
                    msg = `Error del servidor (${error.response.status})`;
                }
            }
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
