import React from 'react';

const Modal = () => {
    
    return (
        <dialog id="group_details_modal" className="modal  modal-bottom sm:modal-middle">
                <div className="modal-box bg-white p-6 scrollbar-none rounded-3xl shadow-2xl max-w-md text-slate-800">

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

                    {/*  Messenger Style Theme / Wallpaper Selector */}
                    <div className="mb-5 ">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <FiImage /> Chat Theme / Wallpaper
                        </label>
                        <div className="flex gap-2.5 scrollbar-none overflow-x-auto py-1">
                            {presetThemes.map((imgUrl, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleUpdateThemeImage(imgUrl)}
                                    className={`h-12 w-12 rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 shrink-0 shadow-sm ${
                                        theme === imgUrl ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200'
                                    }`}
                                >
                                    <img src={imgUrl} alt="Theme option" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
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
                                        <img className='h-8 w-8 rounded-full bg-gray-300 object-cover' src={getProfileImage(m.imageName)} alt="" />
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
    );
};

export default Modal;