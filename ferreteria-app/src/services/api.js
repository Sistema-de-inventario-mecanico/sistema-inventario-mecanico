import axios from 'axios';

const api = axios.create({
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url.includes('token/')
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = sessionStorage.getItem('refresh_token');
                const response = await axios.post('/api/token/refresh/', {
                    refresh: refreshToken
                });
                const { access } = response.data;
                sessionStorage.setItem('access_token', access);
                
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (err) {
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
