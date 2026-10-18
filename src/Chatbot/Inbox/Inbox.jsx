import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import UseAuth from '../../Hook/UseAuth';

const Inbox = () => {
    const { user } = UseAuth()
    console.log(user)
    const [ userData, setUSerData ] = useState([]);
    const [ group, setGroup ] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:3000/users/${user.email}`)
            .then(res => {
                console.log(res.data)
                setUSerData(res.data)
                setGroup(res.data.group)
            })
    }, [])
    const departments = userData.group
    return (
        <aside className="h-165 rounded-3xl text-black border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Inbox</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">Messages</h2>
                </div>
                
            </div>

            <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Search conversations"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                />
            </div>
            {
                group.map(d =>
                    <NavLink  to={`chating/${encodeURIComponent(d.name)}`} key={d.code} >
                        <div className='bg-blue-600 text-white rounded-3xl px-3 my-3 py-5'>
                            {d.name}
                        </div>
                    </NavLink>)
            }

        </aside>

    );
};

export default Inbox;