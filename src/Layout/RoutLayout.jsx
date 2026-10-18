import React from 'react';
import { Outlet } from 'react-router';
import Home from '../Home/Home';

const RoutLayout = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default RoutLayout;