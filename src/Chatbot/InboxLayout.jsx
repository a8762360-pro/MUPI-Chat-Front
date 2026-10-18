import React from 'react';
import { Outlet } from 'react-router';
import Inbox from './Inbox/Inbox';
import Navbar from './Navbar/Navbar';

const InboxLayout = () => {
    
    return (
        <div className='bg-white '>
            <Navbar></Navbar>
            <section className="max-w-6xl  mx-auto grid grid-cols-12 gap-4">
                <div className="col-span-4">
                    <Inbox />
                </div>

                <div className=" col-span-8 border">
                    <Outlet />
                </div>
            </section>

        </div>
    );
};

export default InboxLayout;