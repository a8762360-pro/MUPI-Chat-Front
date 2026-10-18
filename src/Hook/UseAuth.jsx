import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

const UseAuth = () => {
    const authInfo = useContext(AuthContext);
    return authInfo;
};

export default UseAuth;