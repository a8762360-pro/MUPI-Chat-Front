import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiMoreVertical, FiCode, FiUser, FiPlus, FiImage, FiX, FiUsers, FiUserPlus } from 'react-icons/fi';
import { useParams } from 'react-router';
import axios from 'axios';
import UseAuth from '../../Hook/UseAuth';

const Chating = () => {
    const { user } = UseAuth();
    const { name: rawGroupName } = useParams();
    const groupName = decodeURIComponent(rawGroupName || "");

    const [ messages, setMessages ] = useState([]);
    const [ members, setMembers ] = useState([]);
    const [ inputText, setInputText ] = useState("");
    const [ photo, setPhoto ] = useState("");
    const [ allPeople, setAllPeople ] = useState([]);

    // Modal States
    const [ newPhotoUrl, setNewPhotoUrl ] = useState("");

    const chatEndRef = useRef(null);

    // Chat Data Load
    const fetchGroupData = () => {
        if (!groupName) return;
        setMessages([]);
        setMembers([]);
        // setPhoto([]);

        axios.get(`http://localhost:3000/allGroups/${encodeURIComponent(groupName)}`)
            .then(res => {
                const groupAllData = res.data;
                setMessages(groupAllData.messages || []);
                setMembers(groupAllData.members || []);
                setPhoto(groupAllData.imageName || groupAllData.photo || "");
            })
            .catch(err => console.error("Error loading chat group data:", err));
        setMessages([]);
        setMembers([]);
        // setPhoto([]);
    };

    useEffect(() => {
        fetchGroupData();
        axios.get("http://localhost:3000/users")
            .then(res => {
                setAllPeople(res.data || []);
            })
            .catch(err => console.error("Error fetching users:", err));
    }, [ groupName ]);

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

        axios.post(`http://localhost:3000/allGroups/${encodeURIComponent(groupName)}/messages`, newMessage)
            .catch(err => console.error("Failed to save message:", err));
    };

    // Direct Add Member from List
    const handleDirectAddMember = (user) => {
        if (!user) return;

        axios.post(`http://localhost:3000/allGroups/${encodeURIComponent(groupName)}/members`, {
            newMember: {
                name: user.name,
                email: user.email,
                role: user.role || "student",
                imageName: user.imageName || ""
            },
            groupName: groupName
        })
            .then(() => {
                alert("Member added successfully!");
                fetchGroupData(); // ডাটা রিফ্রেশ করা
            })
            .catch(err => console.error("Failed to add member:", err));
    };

    // Update Group Icon Photo URL
    const handleUpdatePhoto = (e) => {
        e.preventDefault();
        if (!newPhotoUrl.trim()) return;

        axios.patch(`http://localhost:3000/allGroups/${encodeURIComponent(groupName)}/photo`, {
            photoUrl: newPhotoUrl.trim()
        })
            .then(() => {
                setPhoto(newPhotoUrl.trim());
                setNewPhotoUrl("");
                alert("Group photo updated!");
            })
            .catch(err => console.error("Failed to update photo:", err));
    };

    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Helper to resolve Image Source URL
    const getProfileImage = (imgName) => {
        if (!imgName) return null;
        if (imgName.startsWith("http://") || imgName.startsWith("https://")) {
            return imgName;
        }
        return `http://localhost:3000/uploads/${imgName}`;
    };

    return (
        <div className="flex flex-col h-165 max-h-screen overflow-hidden bg-slate-100 border-l border-slate-200">

            {/* ---------- Header ---------- */}
            <div className="shrink-0 flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 shadow-sm z-10">
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

                {/* Group Details / Settings Button */}
                <button
                    onClick={() => document.getElementById('group_details_modal').showModal()}
                    className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition-all active:scale-95"
                >
                    <FiMoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* ---------- Chat Body ---------- */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <FiCode className="w-12 h-12 mb-2 stroke-1" />
                        <p className="text-sm font-medium">Kono barta paoya jayni. Prothom message-ti likhun!</p>
                    </div>
                ) : (
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
                                        <span className="text-[11px] font-semibold text-slate-500 mb-1 ml-1">
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

                                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                                        {formatTime(msg?.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            {/* ---------- Input Footer ---------- */}
            <form onSubmit={handleSend} className="shrink-0 p-4 bg-white border-t border-slate-200 flex items-center gap-2">
                <button
                    type="button"
                    className="p-2.5 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <FiPaperclip className="w-5 h-5" />
                </button>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Write a message..."
                    className="flex-1 px-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
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

            {/* ---------- Messenger Style Modal Details ---------- */}
            <dialog id="group_details_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white p-6 rounded-3xl shadow-2xl max-w-md text-slate-800">

                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-slate-400 hover:text-slate-600">
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

                    {/* 1. Edit Photo Section */}
                    <div className="mb-5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <FiImage /> Update Group Icon (URL)
                        </label>
                        <form onSubmit={handleUpdatePhoto} className="flex gap-2">
                            <input
                                type="text"
                                value={newPhotoUrl}
                                onChange={(e) => setNewPhotoUrl(e.target.value)}
                                placeholder="Paste image URL..."
                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white"
                            />
                            <button type="submit" className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700">
                                Save
                            </button>
                        </form>
                    </div>

                    {/* 2. Available People to Add */}
                    <div className="mb-5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <FiUserPlus /> Add People to Group
                        </label>
                        <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                            {allPeople.map((m, idx) => {
                                const isAlreadyMember = members.some(mem => mem.email === m.email);
                                const imgSrc = getProfileImage(m?.imageName);

                                return (
                                    <div key={m?._id || idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
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
                                                <span>{m?.name ? m.name.charAt(0).toUpperCase() : "U"}</span>
                                            </div>
                                            <div className="truncate">
                                                <p className="text-xs font-semibold text-slate-800 leading-tight">{m?.name || "User"}</p>
                                                <p className="text-[10px] text-slate-400">{m?.email}</p>
                                            </div>
                                        </div>

                                        {isAlreadyMember ? (
                                            <span className="text-[10px] bg-slate-200 text-slate-600 font-semibold px-2 py-1 rounded-lg">
                                                Joined
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleDirectAddMember(m)}
                                                className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg transition-colors"
                                            >
                                                + Add
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Current Group Members List */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <FiUsers /> Group Members
                        </label>
                        <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                            {members.map((m, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 truncate">
                                        <div className="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold shrink-0">
                                            {m?.name ? m.name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-xs font-semibold text-slate-800 leading-tight">{m?.name || "Member"}</p>
                                            <p className="text-[10px] text-slate-400">{m?.email}</p>
                                        </div>
                                    </div>
                                    {m?.role === 'admin' && (
                                        <span className="text-[9px] bg-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
                                            Admin
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </dialog>

        </div>
    );
};

export default Chating;