import React, { useState } from 'react';
import { FiSend, FiPaperclip, FiMoreVertical } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';
import { useEffect } from 'react';
import axios from 'axios';

const CT = () => {
    useEffect(()=>{
        axios.get("/cstinbox")
        .then(res => {
            
        })
    },[])
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "Admin (CT)",
            text: "Welcome to Civil Technology Department Group! 🏗️",
            time: "09:00 AM",
            isNotice: true
        },
        {
            id: 2,
            sender: "Teacher",
            text: "Surveying Practice field work will begin today at 2:00 PM.",
            time: "09:30 AM",
            isInstructor: true
        },
        {
            id: 3,
            sender: "You",
            text: "Sir, should we bring the Auto Level equipment?",
            time: "09:45 AM",
            isMe: true
        }
    ]);

    const [inputText, setInputText] = useState("");

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: "You",
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages([...messages, newMessage]);
        setInputText("");
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                        <FaBuilding className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 text-base leading-tight">
                            Civil Technology (CT)
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            52 Members • <span className="text-emerald-500 font-semibold">15 Online</span>
                        </p>
                    </div>
                </div>

                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                    <FiMoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                        {/* Notice Style */}
                        {msg.isNotice && (
                            <div className="flex justify-center my-2">
                                <span className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-1.5 rounded-full font-medium shadow-xs">
                                    📢 {msg.text}
                                </span>
                            </div>
                        )}

                        {/* Incoming / Outgoing Messages */}
                        {!msg.isNotice && (
                            <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                {!msg.isMe && (
                                    <span className="text-[11px] text-slate-500 font-medium ml-1 mb-1">
                                        {msg.sender}
                                    </span>
                                )}
                                
                                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-xs ${
                                    msg.isMe 
                                        ? 'bg-amber-600 text-white rounded-br-xs' 
                                        : msg.isInstructor 
                                        ? 'bg-orange-50 border border-orange-200 text-slate-800 rounded-bl-xs'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                                }`}>
                                    {msg.text}
                                    <div className={`text-[10px] text-right mt-1 font-medium ${
                                        msg.isMe ? 'text-amber-100' : 'text-slate-400'
                                    }`}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
                <button 
                    type="button" 
                    className="p-2.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <FiPaperclip className="w-5 h-5" />
                </button>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Write a message for Civil Technology..."
                    className="flex-1 px-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-amber-500 transition-all text-slate-800 placeholder-slate-400"
                />

                <button
                    type="submit"
                    className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition-all"
                >
                    <FiSend className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default CT;