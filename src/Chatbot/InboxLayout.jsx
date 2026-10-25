import React from 'react';
import { Outlet } from 'react-router';
import Inbox from './Inbox/Inbox';
import Navbar from './Navbar/Navbar';

const InboxLayout = () => {
    
    return (
        <div className='bg-slate-100'>
            <Navbar></Navbar>
            <section className="mt-2 mx-20 grid grid-cols-12 gap-2">
                <div className="col-span-4">
                    <Inbox />
                </div>

                <div className=" col-span-8">
                    <Outlet />
                </div>
            </section>

        </div>
    );
};

export default InboxLayout;