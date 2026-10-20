import axios from 'axios';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import UseAuth from '../../Hook/UseAuth';
import useAxiosSecure from '../../Hook/UseAxiosSeceure';

const Inbox = () => {
    const { user } = UseAuth();
    const [ groups, setGroups ] = useState([]);
    const axiosSeceure = useAxiosSecure()

    useEffect(() => {
        if (!user?.email) return;
        axiosSeceure.get(`http://localhost:3000/allGroups/user/${user.email}`)
            .then(res => {
                console.log(res.data);
                setGroups(res.data);
            })
            .catch(err => {
                console.error("Error fetching user groups:", err);
            });
    }, [ user?.email ]);

    return (
        <aside className="h-[calc(100vh-2rem)] max-h-screen overflow-y-auto rounded-3xl text-slate-800 border border-slate-200 bg-white p-4 shadow-sm scrollbar-none">
            {/* ইনবক্স হেডার */}
            <div className="mb-4 flex items-center justify-between px-2">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Inbox</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">Messages</h2>
                </div>
            </div>

            {/* সার্চ বক্স */}
            <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div className="space-y-2">
                {groups.map((d, index) => (
                    <NavLink
                        to={`chating/${encodeURIComponent(d._id)}`}
                        key={d._id || index}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]'
                                : 'hover:bg-slate-100/80 text-slate-700'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className="relative shrink-0">
                                    {d.photo || d.imageName ? (
                                        <img
                                            className="h-12 w-12 rounded-full object-cover border-2 border-white/20 shadow-sm"
                                            src={d.photo || d.imageName}
                                            alt={d.name}
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                const fallbackEl = e.currentTarget.nextElementSibling;
                                                if (fallbackEl) fallbackEl.style.display = "flex";
                                            }}
                                        />
                                    ) : null}

                                    <div
                                        className={`h-12 w-12 rounded-full items-center justify-center font-bold text-lg shadow-inner ${isActive ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
                                            }`}
                                        style={{ display: (d.photo || d.imageName) ? "none" : "flex" }}
                                    >
                                        {d.name ? d.name.charAt(0).toUpperCase() : "G"}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h1 className="font-semibold text-base truncate capitalize tracking-wide">
                                        {d.name}
                                    </h1>

                                </div>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default Inbox;