import { User, Mail, Shield, CreditCard, Building2, BookOpen, Calendar, LogOut } from 'lucide-react';
import React from 'react';
import UseAuth from '../../../Hook/UseAuth';
import { NavLink } from 'react-router';

const Profile = () => {
    const { user, logOut } = UseAuth();
    console.log("User Profile Data:", user);

    return (
        <div className="flex items-center h-10">
            {/* প্রোফাইল বাটন যা মডাল ওপেন করবে */}
            <NavLink 
                onClick={() => document.getElementById('user_profile_modal').showModal()}
                className='flex items-center gap-2 text-black   rounded-full bg--600  transition hover:shadow-xl'
            >
                {user?.imageName || user?.photoURL ? (
                    <img 
                        src={user.imageName || user.photoURL} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border border-white"
                    />
                ) : (
                    <User size={22} />
                )}
            </NavLink>

            {/* DaisyUI Modal */}
            <dialog id="user_profile_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white text-stone-800 p-6 rounded-2xl shadow-xl max-w-md w-full">
                    
                    {/* Header with Avatar & Name */}
                    <div className="flex flex-col items-center border-b border-stone-200 pb-5">
                        <div className="relative">
                            <img 
                                src={user?.imageName || user?.photoURL || "https://img.icons8.com/color/96/user-male-circle--v1.png"} 
                                alt="User Avatar" 
                                className="w-24 h-24 rounded-full object-cover  shado"
                            />
                            <span className="absolute bottom-0 right-0 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white" title="Active"></span>
                        </div>
                        
                        <h3 className="text-2xl font-bold mt-3 text-stone-900 capitalize">
                            {user?.name || "User Name"}
                        </h3>
                        <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                            <Mail size={14} /> {user?.email || "No email available"}
                        </p>
                    </div>

                    {/* User Details Grid / List */}
                    <div className="py-5 space-y-3">
                        {/* Role */}
                        <div className="flex items-center justify-between bg-stone-50 px-4 py-2.5 rounded-xl border border-stone-100">
                            <span className="flex items-center gap-2 text-sm font-medium text-stone-600">
                                <Shield size={16} className="text-blue-600" /> Role:
                            </span>
                            <span className="badge badge-primary uppercase font-semibold text-xs px-3 py-2">
                                {user?.role || "Student"}
                            </span>
                        </div>

                        {/* ID Card */}
                        <div className="flex items-center justify-between bg-stone-50 px-4 py-2.5 rounded-xl border border-stone-100">
                            <span className="flex items-center gap-2 text-sm font-medium text-stone-600">
                                <CreditCard size={16} className="text-blue-600" /> ID Card:
                            </span>
                            <span className="font-semibold text-stone-800">
                                {user?.idCard || "N/A"}
                            </span>
                        </div>

                        {/* Department */}
                        <div className="flex items-center justify-between bg-stone-50 px-4 py-2.5 rounded-xl border border-stone-100">
                            <span className="flex items-center gap-2 text-sm font-medium text-stone-600">
                                <Building2 size={16} className="text-blue-600" /> Department:
                            </span>
                            <span className="font-semibold text-stone-800 text-right text-sm">
                                {user?.department || "N/A"}
                            </span>
                        </div>

                        {/* Semester (যদি থাকে) */}
                        {user?.semester && (
                            <div className="flex items-center justify-between bg-stone-50 px-4 py-2.5 rounded-xl border border-stone-100">
                                <span className="flex items-center gap-2 text-sm font-medium text-stone-600">
                                    <BookOpen size={16} className="text-blue-600" /> Semester:
                                </span>
                                <span className="font-semibold text-stone-800">
                                    {user.semester}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Modal Actions */}
                    <div className="modal-action flex justify-between items-center border-t border-stone-200 pt-4 mt-0">
                        <button 
                            onClick={logOut}
                            className="btn bg-red-600 hover:bg-red-700 border-none btn-sm text-white flex items-center gap-1.5"
                        >
                            <LogOut size={16} /> Logout
                        </button>

                        <form method="dialog">
                            <button className="btn btn-neutral btn-sm px-5">Close</button>
                        </form>
                    </div>

                </div>
            </dialog>
        </div>
    );
};

export default Profile;