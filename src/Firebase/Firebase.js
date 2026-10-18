// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8BU6zxZnvaaUN26hyhOQV5qfIVJxYvdY",
    authDomain: "mupichat-8319a.firebaseapp.com",
    projectId: "mupichat-8319a",
    storageBucket: "mupichat-8319a.firebasestorage.app",
    messagingSenderId: "1044300915651",
    appId: "1:1044300915651:web:955e35e91153fd59cb1376"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);