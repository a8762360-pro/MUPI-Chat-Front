import axios, { create } from 'axios';
import React, { useState } from 'react';
import { use } from 'react';
import { useEffect } from 'react';
import { FiSend, FiPaperclip, FiMoreVertical, FiCode } from 'react-icons/fi';
import UseAuth from '../../Hook/UseAuth';

const Cst = () => {
    const { user } = UseAuth();
    console.log(user)
    const [ sms, setSms ] = useState([]);
    console.log(sms)
    useEffect(() => {
        axios.get("http://localhost:3000/cstinbox")
            .then(res => {
                setSms(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])


    const [ inputText, setInputText ] = useState("");

    const handleSend = (e) => {
        e.preventDefault()
        const sms = e.target.message.value;

        if (!sms.trim()) {
            return
        };

        const messageData = {
            sms: sms,
            senderName: "Alomgir",
            senderEmail: user.email,
            department: "CST",
            createdAt: new Date(),
        };
        axios.post("http://localhost:3000/cstinbox", messageData)
            .then(res => {
                alert("sms send successfull")
            })
            .catch(err => {
                alert(err)
            })
        console.log(messageData)
    }

    // const handleSend = (e) => {
    //     e.preventDefault();
    //     if (!inputText.trim()) return;

    //     const newMessage = {
    //         id: messages.length + 1,
    //         sender: "You",
    //         text: inputText,
    //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //         isMe: true
    //     };

    //     setMessages([...messages, newMessage]);
    //     setInputText("");
    // };

    return (
        <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                        <FiCode className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 text-base leading-tight">
                            Computer Technology (CST)
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            48 Members • <span className="text-emerald-500 font-semibold">12 Online</span>
                        </p>
                    </div>
                </div>

                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                    <FiMoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-black">
                {sms.map((msg) => (
                    <h1 className={` text-gray-600 rounded-2xl  bg-blue-400 px-2`}>{msg.sms}</h1>
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
                    name="message"
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Write a message or share code..."
                    className="flex-1 px-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                />

                <button
                    type="submit"
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all"
                >
                    <FiSend className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default Cst;