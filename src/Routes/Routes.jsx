import { createBrowserRouter } from "react-router";
import PrivateRoutes from "./PrivateRouter";
import Login from "../Login/Login";
import Home from "../Home/Home";
import RoutLayout from "../Layout/RoutLayout";
import Register from "../Register/Register";
import InboxLayout from "../Chatbot/InboxLayout";
import Navbar from "../Chatbot/Navbar/Navbar";
import Chating from "../Chatbot/chating/Chating";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RoutLayout></RoutLayout>,
        children: [ {
            index: true,
            element: <Home></Home>
        },
        {
            path: "/login",
            element: <Login></Login>
        },
        {
            path: "/register",
            element: <Register></Register>
        },
        ]
    },

    {
        path: "/inbox",
        element: <PrivateRoutes>
            <InboxLayout></InboxLayout>
        </PrivateRoutes>,
        children: [

            {
                path: "navbar",
                element: <PrivateRoutes>
                    <Navbar></Navbar>
                </PrivateRoutes>
            },
            {
                path: "chating/:groupId",
                element: <PrivateRoutes>
                    <Chating></Chating>
                </PrivateRoutes>
            }
        ]
    }
]);