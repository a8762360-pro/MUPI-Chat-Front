import React from 'react';
import { Navigate } from 'react-router';
import UseAuth from '../Hook/UseAuth';

const PrivateRoutes = ({children}) => {
    const { user, loading } = UseAuth()

    if (loading) {
        return <div className='flex justify-center items-center'>
            <span className="loading loading-ring loading-xl"></span>
        </div>
    }
    if(!user){
        return <Navigate to="/login"></Navigate>
    }
    return children;
};

export default PrivateRoutes;