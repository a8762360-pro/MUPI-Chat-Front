import React from 'react';
import { FiX, FiImage, FiUserPlus, FiUsers, FiTrash2, FiCode } from 'react-icons/fi';

const GroupDetailsModal = ({
    groupName,
    photo,
    members,
    allPeople,
    isAdmin,
    theme,
    newPhotoUrl,
    setNewPhotoUrl,
    handleUpdatePhoto,
    handleUpdateThemeImage,
    handleDirectAddMember,
    handleRemoveMember,
    getProfileImage,
    presetThemes,
    user
}) => {
    return (
        <dialog id="group_details_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box bg-white p-6 scrollbar-none rounded-3xl shadow-2xl max-w-md text-slate-800 relative">

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

                {/* Update Group Photo */}
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
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all ${
                                newPhotoUrl.trim()
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
                                className={`h-12 w-12 rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 shrink-0 shadow-sm ${
                                    theme === imgUrl ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200'
                                }`}
                            >
                                <img src={imgUrl} alt="Theme option" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add People to Group (Admin Only) */}
                {isAdmin && (
                    <div className="mb-5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <FiUserPlus /> Add People to Group
                        </label>
                        <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                            {allPeople
                                .filter(m => !members.some(mem => mem.email === m.email))
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

                            {allPeople.filter(m => !members.some(mem => mem.email === m.email)).length === 0 && (
                                <p className="text-[11px] text-slate-400 text-center py-2">No more users available to add.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Current Group Members List */}
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

                                    {isAdmin && m?.email !== user?.email && (
                                        <button
                                            onClick={() => handleRemoveMember(m.email, m.name)}
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
    );
};

export default GroupDetailsModal;