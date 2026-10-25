import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiMoreVertical, FiCode, FiUser, FiX } from 'react-icons/fi';
import { useParams } from 'react-router';
import UseAuth from '../../Hook/UseAuth';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import useAxiosSecure from '../../Hook/UseAxiosSeceure';
import Swal from 'sweetalert2';
import GroupDetailsModal from './GroupDetailsModal/GroupDetailsModal';

const Chating = () => {
    const axiosSeceure = useAxiosSecure();
    const { user } = UseAuth();
    const { groupId: rawGroupID } = useParams();
    const groupID = decodeURIComponent(rawGroupID || "");

    const [ messages, setMessages ] = useState([]);
    const [ members, setMembers ] = useState([]);
    const [ inputText, setInputText ] = useState("");
    const [ selectedFile, setSelectedFile ] = useState(null); // ✅ ফাইল বা প্রিভিউ রাখার জন্য স্টেট
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

    // Send Message (Text + File/Image/Video Support)
    const handleSend = (e) => {
        e.preventDefault();
        const smsText = inputText.trim();
        if (!smsText && !selectedFile) return;

        // যদি ফাইল সিলেক্ট করা থাকে, সাময়িকভাবে সেটার লোকাল প্রিভিউ ইউআরএল বা ডামি লিংক তৈরি করছি
        // (প্রোডাকশনে ফাইলটি আগে ImgBB বা Cloudinary-তে আপলোড করে প্রাপ্ত URL এখানে পাঠাতে হবে)
        let fileUrl = "";
        let fileType = "";

        if (selectedFile) {
            fileUrl = URL.createObjectURL(selectedFile); // ব্রাউজারে দেখানোর জন্য লোকাল অবজেক্ট ইউআরএল
            fileType = selectedFile.type.startsWith('video') ? 'video' : 'image';
        }

        const newMessage = {
            messageId: `msg_${Date.now()}`,
            sms: smsText,
            fileUrl: fileUrl,
            fileType: fileType,
            senderName: user?.displayName || user?.email?.split('@')[ 0 ] || "User",
            senderEmail: user?.email,
            createdAt: new Date().toISOString()
        };

        setMessages((prevSms) => [ ...prevSms, newMessage ]);
        setInputText("");
        setSelectedFile(null); // ফাইল পাঠানোর পর ক্লিয়ার করে দেওয়া হলো

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

    // Remove Member from Group
    const handleRemoveMember = (memberEmail, memberName) => {
        if (!isAdmin) {
            toast.error("Only admins can remove members!");
            return;
        }

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
                        Swal.fire('Removed!', 'Member has been removed from the group.', 'success');
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
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853",
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
        "https://imgs.search.brave.com/zV-_jPaxgZem_Z0tBh8kJLnC3zNYiOx6FgXHucnSWeo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L2ZyZWUtcGhvdG8v/YWJzdHJhY3QtZ3Jh/ZGllbnQtYmFja2dy/b3VuZC13aXRoLWdy/YWlueS1lZmZlY3Rf/ODQ0NDMtMzA3NS5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw/JnE9ODA",
        "https://imgs.search.brave.com/NSQhkFpSYWVWhuUo1fYEAxHRp-BFwF51FKgLlQgx6Po/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wNC1v/ZnAuc3RhdGljLnB1/Yi9mZXMvY21zLzIw/MjMvMDQvMDUveTQw/M3J0Z2xvM3BiZWlr/b3I2ZjZldXFmNzRr/dWhnNDY4MDE0LnBu/Zw",
        "https://imgs.search.brave.com/2CL7MdGEqmX61e7kZoY9wg8xjkca6e1NYlpriAuAjqw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9hc2lh/bi10aGVtZS1iZy1k/ZXNpZ24tZWxlbWVu/dC00NjMzMDM5OS5q/cGc",
        "https://imgs.search.brave.com/DJMHMUCSk36gRSeBwBKOt5yPoGfy8Cr4KrWLHhBfGlU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9idXJz/dC0yMjQxNDE3NC5q/cGc",
        "https://imgs.search.brave.com/I-m69A_vU6IrSFBluqwKFQhasD_ZGU5E844o3F_XIxk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4LzEwLzk4Lzc3/LzM2MF9GXzgxMDk4/Nzc5M19LOGo4ZDh2/dk11T0ZaQ3RmWjd4/Zm56Y1JpU043aTM1/Uy5qcGc"
    ];

    return (
        <div
            style={{ backgroundImage: theme ? `url(${theme})` : 'none' }}
            className="flex   flex-col rounded-2xl bg-center bg-cover border-2 border-whi h-164  max-h-screen overflow-hidden  relative"
        >
            {theme && <div className="absolute inset-0 bg-black/20 pointer-events-none" />}

            {/* ---------- Header ---------- */}
            <div className="shrink-0 bg-white flex items-center justify-between px-6 py-3.5   shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm shrink-0">
                        {photo ? (
                            <img src={getProfileImage(photo)} alt={groupName} className="w-full h-full object-cover" />
                        ) : (
                            <FiCode className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 text-base leading-tight capitalize">{groupName}</h2>
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
                                        <span className="text-[11px] font-semibold text-slate-700 bg-white/80 px-2 py-0.5 rounded-full mb-1 ml-1 shadow-xs ">
                                            {msg?.senderName || "Unknown User"}
                                        </span>
                                    )}

                                    <div
                                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm border-none break-words ${isMe
                                                ? "bg-indigo-600 text-white rounded-br-none"
                                                : "bg-white text-slate-800 border border--200/80 rounded-bl-none"
                                            }`}
                                    >
                                        {/* যদি ছবি থাকে */}
                                        {msg?.fileUrl && msg?.fileType === 'image' && (
                                            <img src={msg.fileUrl} alt="Uploaded" className="max-w-xs rounded-xl h-20 w-auto mb-2 object-cover" />
                                        )}
                                        {/* যদি ভিডিও থাকে */}
                                        {msg?.fileUrl && msg?.fileType === 'video' && (
                                            <video controls className="max-w-xs rounded-xl mb-2">
                                                <source src={msg.fileUrl} type="video/mp4" />
                                            </video>
                                        )}
                                        {/* টেক্সট মেসেজ */}
                                        {msg?.sms && <p>{msg.sms}</p>}
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
            <form onSubmit={handleSend} className="shrink-0 p-4 bg-white border-t  flex flex-col gap-2 relative z-10 shadow-md">

                {selectedFile && (
                    <div className="flex items-center justify-between bg-indigo-50 px-3 py-1.5 rounded-xl border text-xs text-indigo-700">
                        <span className="truncate">📎 Attached: {selectedFile.name}</span>
                        <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
                        >
                            <FiX size={14} />
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2 w-full">
                    <label className="p-2.5 text-slate-400 hover:text-indigo-600 rounded-full transition-colors cursor-pointer">
                        <FiPaperclip className="w-6 h-6" />
                        <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[ 0 ];
                                if (file) {
                                    setSelectedFile(file);
                                    toast.success(`Selected: ${file.name}`);
                                }
                                // একই ফাইল পরপর দুইবার সিলেক্ট করলে যেন সমস্যা না হয়, তাই ভ্যালু রিসেট করে দিলাম
                                e.target.value = "";
                            }}
                        />
                    </label>

                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Write a message..."
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                    />

                    <button
                        type="submit"
                        disabled={!inputText.trim() && !selectedFile}
                        className={`p-2.5 rounded-xl text-white shadow-sm transition-all ${(inputText.trim() || selectedFile)
                                ? "bg-indigo-600 bg-slate-100 hover:bg-indigo-700 cursor-pointer"
                                : "bg-indigo-300 cursor-not-allowed"
                            }`}
                    >
                        <FiSend className="w-5 h-5" />
                    </button>
                </div>
            </form>

            {/* ---------- Modal Component ---------- */}
            <GroupDetailsModal
                groupName={groupName}
                photo={photo}
                members={members}
                allPeople={allPeople}
                isAdmin={isAdmin}
                theme={theme}
                newPhotoUrl={newPhotoUrl}
                setNewPhotoUrl={setNewPhotoUrl}
                handleUpdatePhoto={handleUpdatePhoto}
                handleUpdateThemeImage={handleUpdateThemeImage}
                handleDirectAddMember={handleDirectAddMember}
                handleRemoveMember={handleRemoveMember}
                getProfileImage={getProfileImage}
                presetThemes={presetThemes}
                user={user}
            />

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