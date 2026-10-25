import axios from 'axios';
import { Search, MessageSquarePlus, Sparkles, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import UseAuth from '../../Hook/UseAuth';
import useAxiosSecure from '../../Hook/UseAxiosSeceure';
import Navigate from './Navigate/Navigate';
import Profile from './Profile/Profile';
// import Profile from './Profile/Profile';

const Inbox = () => {
    const { user } = UseAuth();
    const [ groups, setGroups ] = useState([]);
    const [ searchTerm, setSearchTerm ] = useState("");
    const axiosSeceure = useAxiosSecure();

    useEffect(() => {
        if (!user?.email) return;
        axiosSeceure.get(`/allGroups/user/${user?.email}`)
            .then(res => {
                setGroups(res.data);
            })
            .catch(err => {
                console.error("Error fetching user groups:", err);
            });
    }, [ user?.email ]);

    const filteredGroups = groups.filter(group =>
        group.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <aside className="h-[calc(100vh-5rem)] max-h-screen bg-slate-50 flex flex-col rounde border border-slate-200/80  backdrop-blur-xl p-4 shadow-xl shadow-slate-100 transition-all">

            {/* Header Section */}
            <div className="mb-4 flex items-center justify-between px-2 pt-1">
                <div>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                        <Sparkles size={14} className="animate-pulse" />
                        <p className="text-[11px] font-bold uppercase tracking-widest">Campus Chat</p>
                    </div>
                    <h2 className="mt-0.5 text-2xl font-black tracking-tight text-slate-800">
                        Messages
                        {/* <span className="ml-2 inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            {filteredGroups.length}
                        </span> */}
                    </h2>
                </div>

                {/*  */}
                <Profile></Profile>
            </div>

            {/* Search Box */}
            <div className="relative mb-5">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" size={18} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search groups or channels..."
                    className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/80 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
            </div>

            {/* Group List Container */}
            <div className="flex-1 space-y-2  overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((d, index) => (
                        <NavLink
                            to={`chating/${encodeURIComponent(d.groupId)}`}
                            key={d._id || index}
                            className={({ isActive }) =>
                                `group relative flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-emerald-600/25 scale-[1.01]'
                                    : 'hover:bg-slate-50 text-slate-700 hover:shadow-sm'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active Indicator Bar */}
                                    {isActive && (
                                        <span className="absolute -left-1 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-r-full bg-amber-400 shadow-sm" />
                                    )}

                                    {/* Group Avatar */}
                                    <div className="relative shrink-0">
                                        {d.photo || d.imageName ? (
                                            <img
                                                className={`h-12 w-12 rounded-2xl object-cover ring-2 transition-transform duration-300 group-hover:scale-105 ${isActive ? 'ring-white/40' : 'ring-slate-100'
                                                    }`}
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
                                            className={`h-12 w-12 rounded-2xl items-center justify-center font-bold text-lg shadow-inner transition-transform duration-300 group-hover:scale-105 ${isActive
                                                ? 'bg-white/20 text-white backdrop-blur-md'
                                                : 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800'
                                                }`}
                                            style={{ display: (d.photo || d.imageName) ? "none" : "flex" }}
                                        >
                                            {d.name ? d.name.charAt(0).toUpperCase() : "G"}
                                        </div>

                                        {/* Online Indicator */}
                                        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                    </div>

                                    {/* Group Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h1 className="font-bold text-sm truncate capitalize tracking-wide">
                                                {d.name}
                                            </h1>
                                        </div>
                                        <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                                            Click to open conversation
                                        </p>
                                    </div>
                                </>
                            )}
                        </NavLink>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                            <MessageSquarePlus size={22} />
                        </div>
                        <p className="text-sm font-semibold text-slate-600">No conversations found</p>
                        <p className="text-xs text-slate-400 mt-1">Try searching with a different name</p>
                    </div>
                )}
            </div>
            {/* <Navigate></Navigate> */}
        </aside>

    );
};

export default Inbox;