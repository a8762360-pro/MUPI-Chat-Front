import React from 'react';
// import { NavLink } from 'react-router';
import { MessageSquare, LayoutGrid, Search, User } from 'lucide-react';
import { NavLink } from 'react-router';

const Navigate = () => {
    return (
        <div className="flex items-center justify-around border-b border-stone-200 bg-white py-3 px-4 shadow-sm">
            {/* Messages Tab */}
            <NavLink
                to="/inbox"
                className={({ isActive }) =>
                    `flex flex-col items-center gap-1 relative pb-2 transition-colors ${
                        isActive ? "text-blue-600 font-semibold" : "text-stone-500 hover:text-stone-800"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <MessageSquare size={22} className={isActive ? "fill-blue-600 text-blue-600" : ""} />
                        <span className="text-xs">Messages</span>
                        {isActive && (
                            <span className="absolute -bottom-3 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></span>
                        )}
                    </>
                )}
            </NavLink>

            {/* Channels Tab */}
            <NavLink
                to="/channels"
                className={({ isActive }) =>
                    `flex flex-col items-center gap-1 relative pb-2 transition-colors ${
                        isActive ? "text-blue-600 font-semibold" : "text-stone-500 hover:text-stone-800"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <LayoutGrid size={22} />
                        <span className="text-xs">Channels</span>
                        {isActive && (
                            <span className="absolute -bottom-3 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></span>
                        )}
                    </>
                )}
            </NavLink>

            {/* Search Tab */}
            <NavLink
                to="/search"
                className={({ isActive }) =>
                    `flex flex-col items-center gap-1 relative pb-2 transition-colors ${
                        isActive ? "text-blue-600 font-semibold" : "text-stone-500 hover:text-stone-800"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <Search size={22} />
                        <span className="text-xs">Search</span>
                        {isActive && (
                            <span className="absolute -bottom-3 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></span>
                        )}
                    </>
                )}
            </NavLink>

            {/* Profile Tab */}
            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    `flex flex-col items-center gap-1 relative pb-2 transition-colors ${
                        isActive ? "text-blue-600 font-semibold" : "text-stone-500 hover:text-stone-800"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <User size={22} />
                        <span className="text-xs">Profile</span>
                        {isActive && (
                            <span className="absolute -bottom-3 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></span>
                        )}
                    </>
                )}
            </NavLink>
        </div>
    );
};

export default Navigate;