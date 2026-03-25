import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const loginDate = localStorage.getItem('login_date');

        if (token && loginDate) {
            const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
            const now = new Date().getTime();
            const then = parseInt(loginDate, 10);

            if (now - then > ONE_WEEK) {
                logout();
            } else {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch {
                        localStorage.removeItem('user');
                    }
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
            const now = new Date().getTime();

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('login_date', now.toString());

            // Step 2: Fetch the current user's profile using the /me endpoint
            const meResp = await api.get('usuarios/me/');
            const currentUser = meResp.data;

            localStorage.setItem('user', JSON.stringify(currentUser));
            setUser(currentUser);
            navigate('/');
            return { success: true };
        } catch (error) {
            // Clean up if login fails
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            localStorage.removeItem('login_date');

            let msg = 'Error de conexión con el servidor';
            if (error.response) {
                if (error.response.status === 401) {
                    msg = 'Matrícula o contraseña incorrecta';
                } else {
                    msg = \`Error del servidor (\${error.response.status})\`;
                }
            }
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('login_date');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
