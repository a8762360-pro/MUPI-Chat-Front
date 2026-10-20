import { Bell, Plus, Users, X } from 'lucide-react';
import React, { useState } from 'react';
import { NavLink } from 'react-router';
import axios from 'axios';
import UseAuth from '../../Hook/UseAuth';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import useAxiosSecure from '../../Hook/UseAxiosSeceure';

const Navbar = () => {
    const { user } = UseAuth();
    const axiosSeceure = useAxiosSecure();

    const [ groupName, setGroupName ] = useState('');
    const [ department, setDepartment ] = useState('Computer Science & Technology');
    const [ semester, setSemester ] = useState('1st');

    const handleCreateGroup = (e) => {
        e.preventDefault();

        if (!groupName.trim()) return;

        const newGroupData = {
            groupId: `grp_${Date.now()}`,
            name: groupName.trim(),
            photo: e.target.groupPhoto.value,
            department: user?.role === 'student' ? department : '',
            semester: user?.role === 'student' ? semester : '',
            themeImage: "https://imgs.search.brave.com/75vDDI-ZoInfBwXdKm1yfPnlqy6Hptk92a_eyRsx2VM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjcv/MzY3Lzg1NC9zbWFs/bC9zb2Z0LWNoYW9z/LW9mLWNvbG9ycy1p/bi1kaWdpdGFsLXdh/dGVyY29sb3ItYmFj/a2dyb3VuZC1hYnN0/cmFjdC10aGVtZS1m/cmVlLXZlY3Rvci5q/cGc",
            members: [
                {
                    name: user?.name || "",
                    email: user?.email || "",
                    role: 'admin',
                    imageName: user?.imageName || "",
                }
            ],
            messages: [],
            createdAt: new Date().toISOString()
        };
        console.log(newGroupData.name);

        axiosSeceure.post('/allGroups', newGroupData)
            .then(res => {
                toast.success('Group created successfully!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                setGroupName('');
                document.getElementById('my_modal_3').close();
                window.location.reload();
            })
            .catch(err => {
                console.error("Error creating group:", err);
            });
    };

    return (
        <header className="border-b border-slate-200 bg-slate-50 backdrop-blur-sm sticky top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    <NavLink to="/" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-sm transition hover:opacity-90">
                        <img
                            src="https://imgs.search.brave.com/CWTFefyPC_SenK7WtYdow9ciCXC1oZSJtd8ZCMEs-d4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zZG4u/c2lnbmFsaGlyZS5j/by9zdG9yYWdlL2Nv/bXBhbnkvOTU3OC8y/YTAzLzQxMGUvNzI3/YS8yN2Y4L2Q2ZjYv/MzgzNS80YWI0Lndl/YnA"
                            alt="MUPI Chat Logo"
                            className="h-full w-full object-cover"
                        />
                    </NavLink>
                    <div>
                        <p className="text-base font-bold text-slate-900 leading-tight">MUPI Chat</p>
                        <p className="text-xs text-slate-500 font-medium">Campus communication</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Notification Button */}
                    <button className="relative rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50/50">
                        <Bell size={18} />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm">
                            4
                        </span>
                    </button>

                    {/* New Group Button */}
                    <button
                        onClick={() => document.getElementById('my_modal_3').showModal()}
                        className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-95"
                    >
                        <Plus size={18} />
                        <span>New Group</span>
                    </button>

                    {/* ---------- DaisyUI Modal ---------- */}
                    <dialog id="my_modal_3" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-md">

                            {/* Modal Close Icon */}
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-slate-400 hover:text-slate-600">
                                    <X size={18} />
                                </button>
                            </form>

                            {/* Modal Header */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                                    <Users size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Create New Group</h3>
                                    <p className="text-xs text-slate-500 font-medium">Start a conversation for your department</p>
                                </div>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleCreateGroup} className="space-y-4">
                                {/* Group Name */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Group Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="Enter the group name"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
                                    />
                                </div>

                                {/* Group photo */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Group Photo
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        name='groupPhoto'
                                        placeholder="Enter the group photo URL"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
                                    />
                                </div>

                                {/*  যদি ইউজার Student হয়, তবেই কেবল Department এবং Semester ফিল্ড দেখাবে */}
                                {user?.role === "student" && (
                                    <>
                                        {/* Department */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                                Department
                                            </label>
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                            >
                                                <option value="Computer Science & Technology">Computer Science & Technology (CST)</option>
                                                <option value="Civil Technology">Civil Technology (CT)</option>
                                                <option value="Electrical Technology">Electrical Technology (ET)</option>
                                                <option value="Electronics Technology">Electronics Technology (EnT)</option>
                                                <option value="Mechanical Technology">Mechanical Technology (MT)</option>
                                                <option value="Electromedical Technology">Electromedical Technology (EMT)</option>
                                                <option value="Refrigeration and Air Conditioning Technology">Refrigeration and Air Conditioning (RAC)</option>
                                            </select>
                                        </div>

                                        {/* Semester */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                                Semester
                                            </label>
                                            <select
                                                value={semester}
                                                onChange={(e) => setSemester(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                            >
                                                <option value="1st">1st Semester</option>
                                                <option value="2nd">2nd Semester</option>
                                                <option value="3rd">3rd Semester</option>
                                                <option value="4th">4th Semester</option>
                                                <option value="5th">5th Semester</option>
                                                <option value="6th">6th Semester</option>
                                                <option value="7th">7th Semester</option>
                                                <option value="8th">8th Semester</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-200 transition-all active:scale-[0.98]"
                                    >
                                        Create Group
                                    </button>
                                </div>
                            </form>

                        </div>
                    </dialog>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </header>
    );
};

export default Navbar;