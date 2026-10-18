import { createUserWithEmailAndPassword, getIdToken, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { auth } from '../Firebase/Firebase';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const EmailPassLogin = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Firebase ID Token নেওয়া
                    const idToken = await getIdToken(currentUser);
                    setToken(idToken);

                    // Backend (MongoDB) থেকে ইউজার ডাটা আনা
                    const res = await axios.get(`http://localhost:3000/users/${currentUser.email}`, {
                        headers: {
                            authorization: `Bearer ${idToken}`
                        }
                    });

                    console.log("MongoDB User Data:", res.data);
                    setUser(res.data); // MongoDB Profile Data
                } catch (error) {
                    console.error("Failed to fetch user profile from DB:", error);
                    // যদি DB-তে না পাওয়া যায়, তবে ব্যাকআপ হিসেবে Firebase user রাখা
                    setUser(currentUser); 
                } finally {
                    // 🟢 ডাটাবেজ থেকে ফেচ হওয়া শেষ হলে তারপর setLoading false করতে হবে
                    setLoading(false); 
                }
            } else {
                setUser(null);
                setToken("");
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const AuthValue = {
        createUser,
        EmailPassLogin,
        loading,
        setLoading,
        user,
        setUser,
        logOut,
        token,
        setToken
    };

    return (
        <AuthContext.Provider value={AuthValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;