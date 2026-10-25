import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiMoreVertical, FiCode, FiUser, FiPlus, FiImage, FiX, FiUsers, FiUserPlus, FiTrash2 } from 'react-icons/fi';
import { useParams } from 'react-router';
import axios from 'axios';
import UseAuth from '../../Hook/UseAuth';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import useAxiosSecure from '../../Hook/UseAxiosSeceure';
import Swal from 'sweetalert2';


const Chating = () => {
    const axiosSeceure = useAxiosSecure();
    const { user } = UseAuth();
    const { groupId: rawGroupID } = useParams();
    const groupID = decodeURIComponent(rawGroupID || "");

    const [ messages, setMessages ] = useState([]);
    const [ members, setMembers ] = useState([]);
    const [ inputText, setInputText ] = useState("");
    const [ photo, setPhoto ] = useState("");
    const [ allPeople, setAllPeople ] = useState([]);
    const [ groupName, setGroupName ] = useState("");
    const [ theme, setTheme ] = useState("");

    // Modal States
    const [ newPhotoUrl, setNewPhotoUrl ] = useState("");

    const chatEndRef = useRef(null);

    // Check if current logged-in user is admin of this group
    const currentMemberInfo = members.find(m => m.email === user?.email);
    const isAdmin = currentMemberInfo?.role === 'admin' || user?.role === 'admin';

    // Chat Data Load
    const fetchGroupData = () => {
        if (!groupID) return;
        setMessages([]);
        setMembers([]);

        axiosSeceure.get(`/allGroups/${encodeURIComponent(groupID)}`)
            .then(res => {
                const groupAllData = res.data;
                setTheme(groupAllData.bgImage || groupAllData.themeImage || "");
                setGroupName(groupAllData.name);
                setMessages(groupAllData.messages || []);
                setMembers(groupAllData.members || []);
                setPhoto(groupAllData.imageName || groupAllData.photo || "");
            })
            .catch(err => console.error("Error loading chat group data:", err));
    };

    useEffect(() => {
        fetchGroupData();
        axiosSeceure.get("/users")
            .then(res => {
                setAllPeople(res.data || []);
            })
            .catch(err => console.error("Error fetching users:", err));
    }, [ groupID ]);

    // Auto Scroll Down
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ messages ]);

    // Send Message
    const handleSend = (e) => {
        e.preventDefault();
        const smsText = inputText.trim();
        if (!smsText) return;

        const newMessage = {
            messageId: `msg_${Date.now()}`,
            sms: smsText,
            senderName: user?.displayName || user?.email?.split('@')[ 0 ] || "User",
            senderEmail: user?.email,
            createdAt: new Date().toISOString()
        };

        setMessages((prevSms) => [ ...prevSms, newMessage ]);
        setInputText("");

        axiosSeceure.post(`/allGroups/${encodeURIComponent(groupID)}/messages`, newMessage)
            .catch(err => console.error("Failed to save message:", err));
    };

    // Direct Add Member from List (Only Admin)
    const handleDirectAddMember = (targetUser) => {
        if (!isAdmin) {
            toast.error("Only admins can add members!");
            return;
        }
        if (!targetUser) return;

        axiosSeceure.post(`/allGroups/${encodeURIComponent(groupID)}/members`, {
            newMember: {
                name: targetUser.name,
                email: targetUser.email,
                role: targetUser.role || "student",
                imageName: targetUser.imageName || ""
            },
            groupName: groupName
        })
            .then(() => {
                toast.success("Member added successfully!");
                fetchGroupData();
            })
            .catch(err => console.error("Failed to add member:", err));
    };

    // Remove Member from Group (With Confirmation Modal)
    const handleRemoveMember = (memberEmail, memberName) => {
        if (!isAdmin) {
            toast.error("Only admins can remove members!");
            return;
        }

        // DaisyUI মোডাল সঠিকভাবে বন্ধ করার জন্য .close() মেথড ব্যবহার করুন
        const modalElement = document.getElementById('group_details_modal');
        if (modalElement) {
            modalElement.close();
        }

        Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to remove "${memberName || memberEmail}" from this group?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, remove!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSeceure.delete(`/allGroups/${encodeURIComponent(groupID)}/members/${encodeURIComponent(memberEmail)}`)
                    .then(() => {
                        Swal.fire(
                            'Removed!',
                            'Member has been removed from the group.',
                            'success'
                        );
                        fetchGroupData();
                    })
                    .catch(err => {
                        console.error("Failed to remove member:", err);
                        toast.error("Failed to remove member.");
                    });
            }
        });
    };

    // Update Group Icon Photo URL
    const handleUpdatePhoto = (e) => {
        e.preventDefault();
        if (!newPhotoUrl.trim()) return;

        axiosSeceure.patch(`/allGroups/${encodeURIComponent(groupID)}/photo`, {
            photoUrl: newPhotoUrl.trim()
        })
            .then(() => {
                setPhoto(newPhotoUrl.trim());
                setNewPhotoUrl("");
                toast.success("Group photo updated!");
            })
            .catch(err => console.error("Failed to update photo:", err));
    };

    // Update Chat Theme Background Image
    const handleUpdateThemeImage = (imgUrl) => {
        axiosSeceure.patch(`/allGroups/${encodeURIComponent(groupID)}/bgImage`, {
            bgImage: imgUrl
        })
            .then(() => {
                setTheme(imgUrl);
                // toast.success("Chat theme updated successfully!");
            })
            .catch(err => console.error("Failed to update theme image:", err));
    };

    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getProfileImage = (imgName) => {
        if (!imgName) return null;
        if (imgName.startsWith("http://") || imgName.startsWith("https://")) {
            return imgName;
        }
        return `/uploads/${imgName}`;
    };

    const presetThemes = [
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
        "https://imgs.search.brave.com/ry5VgO-OVNQWSGN1BQwF0YXTI9g9pN3xHicJi__FJcQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvdGh1bWJu/YWlsL2NvbG9yZnVs/LWJsdXJyeS10aGVt/ZXMtbnlzOWJ4ZTNu/OTdnaGloay5qcGc",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853",
        "https://imgs.search.brave.com/lkLvn82EBqM8ozrOgu2fWxACaT4rUgsXRBRwhOhwdPc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTcv/MDQ2LzczMy9zbWFs/bC9zcGVjaWFsLWhl/YXJ0LWJhY2tncm91/bmQtZm9yLXZhbGVu/dGluZS1kYXktd2l0/aC13aGl0ZS1jbG91/ZC1hbmQtdXNlZC13/aXRoLXNpbWlsYXIt/dGhlbWUtdmVjdG9y/LmpwZw",
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
    ];

    return (
        <div
            style={{
                backgroundImage: theme ? `url(${theme})` : 'none'
            }}
            className="flex flex-col bg-center bg-cover h-165 border-b max-h-screen overflow-hidden border-l border-slate-200 relative"
        >
            {theme && <div className="absolute inset-0 bg-black/20 pointer-events-none" />}

            {/* ---------- Header ---------- */}
            <div className="shrink-0 bg-slate-50 flex items-center justify-between px-6 py-3.5 border-b border-slate-200 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm shrink-0">
                        {photo ? (
                            <img src={getProfileImage(photo)} alt={groupName} className="w-full h-full object-cover" />
                        ) : (
                            <FiCode className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 text-base leading-tight capitalize">
                            {groupName}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                            <span>{members.length} Members</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Active Group
                            </span>
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => document.getElementById('group_details_modal').showModal()}
                    className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition-all active:scale-95"
                >
                    <FiMoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* ---------- Chat Body ---------- */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 relative z-10">
                {
                    messages.map((msg, index) => {
                        if (!msg) return null;
                        const isMe = msg?.senderEmail === user?.email;

                        return (
                            <div
                                key={msg?.messageId || index}
                                className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                {!isMe && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                        {msg?.senderName ? msg.senderName.charAt(0).toUpperCase() : <FiUser />}
                                    </div>
                                )}

                                <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                    {!isMe && (
                                        <span className="text-[11px] font-semibold text-slate-700 bg-white/80 px-2 py-0.5 rounded-full mb-1 ml-1 shadow-xs">
                                            {msg?.senderName || "Unknown User"}
                                        </span>
                                    )}

                                    <div
                                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${isMe
                                            ? "bg-indigo-600 text-white rounded-br-none"
                                            : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                                            }`}
                                    >
                                        <p>{msg?.sms || ""}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-600 bg-white/70 px-1.5 py-0.5 rounded-md mt-1">
                                        {formatTime(msg?.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                }
                <div ref={chatEndRef} />
            </div>

            {/* ---------- Input Footer ---------- */}
            <form onSubmit={handleSend} className="shrink-0 p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2 relative z-10 shadow-md">
                <button
                    type="button"
                    className="p-2.5 text-slate-400 hover:text-indigo-600 rounded-full transition-colors"
                >
                    <FiPaperclip className="w-6 h-6" />
                </button>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Write a message..."
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                />

                <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`p-2.5 rounded-xl text-white shadow-sm transition-all ${inputText.trim()
                        ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                        : "bg-indigo-300 cursor-not-allowed"
                        }`}
                >
                    <FiSend className="w-5 h-5" />
                </button>
            </form>

            {/* ---------- Modal Details ---------- */}
            <dialog id="group_details_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white p-6 scrollbar-none rounded-3xl shadow-2xl max-w-md text-slate-800">

                    <form method="dialog">
                        <button className="btn border-none btn-sm btn-circle btn-ghost absolute right-4 top-4 text-slate-400 hover:bg-red-600 hover:text-white">
                            <FiX size={18} />
                        </button>
                    </form>

                    {/* Group Profile Overview */}
                    <div className="flex flex-col items-center border-b border-slate-100 pb-5 mb-5">
                        <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 border-2 border-indigo-200 flex items-center justify-center overflow-hidden mb-3 shadow-md">
                            {photo ? (
                                <img src={getProfileImage(photo)} alt={groupName} className="w-full h-full object-cover" />
                            ) : (
                                <FiCode size={32} />
                            )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg capitalize">{groupName}</h3>
                        <p className="text-xs text-slate-500">{members.length} Members</p>
                    </div>

                    {/* গ্রুপের যেকোনো মেম্বার এখন গ্রুপ ফটো আপডেট করতে পারবে */}
                    <form onSubmit={handleUpdatePhoto} className="mb-5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                            <FiImage /> Update Group Photo URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newPhotoUrl}
                                onChange={(e) => setNewPhotoUrl(e.target.value)}
                                placeholder="Paste new image URL..."
                                className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800 placeholder-slate-400"
                            />
                            <button
                                type="submit"
                                disabled={!newPhotoUrl.trim()}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all ${newPhotoUrl.trim()
                                        ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                                        : "bg-indigo-300 cursor-not-allowed"
                                    }`}
                            >
                                Update
                            </button>
                        </div>
                    </form>

                    {/* Chat Theme Wallpaper */}
                    <div className="mb-5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <FiImage /> Chat Theme / Wallpaper
                        </label>
                        <div className="flex gap-2.5 scrollbar-none overflow-x-auto py-1">
                            {presetThemes.map((imgUrl, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleUpdateThemeImage(imgUrl)}
                                    className={`h-12 w-12 rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 shrink-0 shadow-sm ${theme === imgUrl ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200'}`}
                                >
                                    <img src={imgUrl} alt="Theme option" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Available People to Add (Admin Only) */}
                    {isAdmin && (
                        <div className="mb-5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                                <FiUserPlus /> Add People to Group
                            </label>
                            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                                {allPeople
                                    .filter(m => !members.some(mem => mem.email === m.email)) // ✅ যারা অলরেডি মেম্বার, তারা ফিল্টার হয়ে বাদ যাবে
                                    .map((m, index) => {
                                        const imgSrc = getProfileImage(m?.imageName);

                                        return (
                                            <div key={m?._id || index} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-center gap-2 truncate">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold overflow-hidden shrink-0">
                                                        {imgSrc ? (
                                                            <img
                                                                src={imgSrc}
                                                                alt={m?.name || "User"}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : null}
                                                        <span>{!imgSrc && (m?.name ? m.name.charAt(0).toUpperCase() : "U")}</span>
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="text-xs font-semibold text-slate-800 leading-tight">{m?.name || "User"}</p>
                                                        <p className="text-[10px] text-slate-400">{m?.email}</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDirectAddMember(m)}
                                                    className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                        );
                                    })}

                                {/* যদি সব ইউজার গ্রুপে যুক্ত থাকে, তবে একটি ছোট মেসেজ দেখাতে পারেন */}
                                {allPeople.filter(m => !members.some(mem => mem.email === m.email)).length === 0 && (
                                    <p className="text-[11px] text-slate-400 text-center py-2">No more users available to add.</p>
                                )}
                            </div>
                        </div>
                    )}



                    {/* 3. Current Group Members List (Admin can delete members) */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <FiUsers /> Group Members
                        </label>
                        <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                            {members.map((m, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 truncate">
                                        <img className='h-8 w-8 rounded-full bg-gray-300 object-cover' src={getProfileImage(m.imageName)} alt="" />
                                        <div className="truncate">
                                            <p className="text-xs font-semibold text-slate-800 leading-tight">{m?.name || "Member"}</p>
                                            <p className="text-[10px] text-slate-400">{m?.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {m?.role === 'admin' && (
                                            <span className="text-[9px] bg-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
                                                Admin
                                            </span>
                                        )}

                                        {/* Admin can delete any member except maybe themselves if desired */}
                                        {isAdmin && m?.email !== user?.email && (
                                            <button
                                                onClick={() => handleRemoveMember(m.email)}
                                                className="p-1.5 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition-colors"
                                                title="Remove Member"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </dialog>

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
        </div>
    );
};

export default Chating;