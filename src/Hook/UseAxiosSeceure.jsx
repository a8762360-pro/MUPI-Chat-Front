import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import useAuth from './UseAuth';

const axiosSecure = axios.create({
    baseURL: "http://localhost:3000"
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut, token } = useAuth();
    console.log(token)

    useEffect(() => {
        // Request Interceptor
        const requestInterceptor = axiosSecure.interceptors.request.use((config) => {
            // const token = localStorage.getItem('IDtoken');
            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        // Response Interceptor
        const responseInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response;
        }, async (error) => {
            const status = error.response ? error.response.status : null;
            if (status === 401 || status === 403) {
                await logOut();
                navigate('/login');
            }
            return Promise.reject(error);
        });

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate, logOut]);

    return axiosSecure;
};

export default useAxiosSecure;