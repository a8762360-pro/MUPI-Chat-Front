import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import useAuth from './UseAuth';
import { getAuth } from 'firebase/auth'; // ✅ Firebase Auth ইমপোর্ট করুন

const axiosSecure = axios.create({
    baseURL: "http://localhost:3000"
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth();

    useEffect(() => {
        // Request Interceptor
        const requestInterceptor = axiosSecure.interceptors.request.use(async (config) => {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                // ✅ Firebase-এর মাধ্যমে প্রতি রিকোয়েস্টের আগে ফ্রেশ টোকেন আনা হচ্ছে
                // (Firebase অটোমেটিক টোকেন রিফ্রেশ করে মেমোরিতে রাখে)
                const freshToken = await currentUser.getIdToken();
                config.headers.authorization = `Bearer ${freshToken}`;
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