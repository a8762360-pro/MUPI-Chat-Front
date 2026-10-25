import React from "react";
import UseAuth from "../Hook/UseAuth";

const Home = () => {
    const {user, logOut} = UseAuth();
    console.log(user)
    const items = [
        { title: "Chat", text: "বন্ধু আর শিক্ষকদের সাথে কথা বলুন।" },
        { title: "Notice", text: "institute এর সব নোটিশ এক জায়গায়।" },
        { title: "Group", text: "নিজের department এর group এ যোগ দিন।" },
    ];

    const handleLogout = () => {
        logOut(user.email)
    }

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800" style={{ fontFamily: "'Hind Siliguri', system-ui, sans-serif" }}>
            {/* Navbar */}
            <header className="bg-emerald-900 text-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
                    <span className="text-lg font-semibold">Munshigonj Polytechnic Institute</span>
                    <div className="flex items-center gap-4 text-sm">
                        {
                            user? <button onClick={handleLogout} className="rounded-lg bg-red-500 text-white px-4 py-2 font-semibold  hover:bg-red-700">Log out</button>: <a href="/login" className="rounded-lg bg-blue-500 text-white px-4 py-2 font-semibold  hover:bg-blue-700">Log in</a>
                        }
                        
                        <a href="/register" className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                            Register
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="mx-auto max-w-5xl px-5 py-20 text-center">
                <h1 className="text-4xl font-bold text-emerald-950 md:text-5xl">Institute Chat এ স্বাগতম</h1>
                <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600">
                    মুন্সীগঞ্জ পলিটেকনিক ইনস্টিটিউটের ছাত্র ও শিক্ষকদের নিজস্ব chat app।
                </p>
                <a href="/inbox" className="mt-8 inline-block rounded-xl bg-emerald-900 px-8 py-3 font-semibold text-white hover:bg-emerald-800">
                    শুরু করুন
                </a>
            </section>

            {/* Features */}
            <section className="mx-auto grid max-w-5xl gap-6 px-5 pb-20 sm:grid-cols-3">
                {items.map(({ title, text }) => (
                    <div key={title} className="rounded-xl border border-stone-200 bg-white p-6 text-center">
                        <h3 className="text-lg font-semibold text-emerald-900">{title}</h3>
                        <p className="mt-1 text-stone-600">{text}</p>
                    </div>
                ))}
            </section>

            {/* Footer */}
            <footer className="border-t border-stone-200 py-5 text-center text-sm text-stone-500 mt-15">
                © {new Date().getFullYear()} Munshigonj Polytechnic Institute
            </footer>
        </div>
    );
};

export default Home;