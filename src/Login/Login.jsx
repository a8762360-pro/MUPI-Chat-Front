import React, { useState, useContext } from "react";
import { Eye, EyeOff, LogIn, GraduationCap, Presentation, MessagesSquare } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from '../AuthContext/AuthContext';
import useAxiosSecure from "../Hook/UseAxiosSeceure";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Login = () => {
    const [ role, setRole ] = useState("student");
    const [ show, setShow ] = useState(false); // ✅ পাসওয়ার্ড হাইড/শো এর জন্য স্টেট যুক্ত করা হলো
    const [ error, setError ] = useState("");
    const { EmailPassLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const axosSeceure = useAxiosSecure();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // রিসেট এরর

        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!email || !password) {
            setError("Email and Password are required!");
            return;
        }

        EmailPassLogin(email, password)
            .then(res => {
                const user = res.user;

                // ✅ সফল টোস্ট নোটিফিকেশন
                toast.success('Your login was successful!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });

                // ✅ ১.৫ সেকেন্ড ডিলে দিয়ে নেভিগেট করা যেন ইউজার টোস্টটি দেখতে পায়
                setTimeout(() => {
                    navigate("/inbox");
                }, 1500);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                toast.error(err.message || "Failed to log in!");
            });
    };

    return (
        <div
            className="flex min-h-screen bg-stone-100 text-stone-800"
            style={{ fontFamily: "'Hind Siliguri', system-ui, sans-serif" }}
        >
            {/* ---------- Left: branding (desktop only) ---------- */}
            <section className="hidden flex-1 flex-col justify-between bg-emerald-900 p-12 text-emerald-50 lg:flex">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500 text-xl font-bold text-emerald-950">
                        M
                    </div>
                    <div className="leading-tight">
                        <p className="text-lg font-semibold">Munshigonj Polytechnic Institute</p>
                        <p className="text-sm text-emerald-200">মুন্সীগঞ্জ পলিটেকনিক ইনস্টিটিউট</p>
                    </div>
                </div>

                <div className="max-w-md">
                    <MessagesSquare size={44} className="mb-6 text-amber-400" />
                    <h2 className="text-4xl font-bold leading-tight">
                        পুরো ক্যাম্পাস, এক জায়গায় কথা বলুন।
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-emerald-100">
                        Notice, department group আর শিক্ষকদের সাথে সরাসরি যোগাযোগ, সবকিছু একটাই app এ।
                    </p>
                </div>

                <p className="text-sm text-emerald-300">© Munshigonj Polytechnic Institute</p>
            </section>

            {/* ---------- Right: form ---------- */}
            <section className="flex w-full items-center justify-center px-5 py-10 lg:w-[480px] lg:shrink-0">
                <div className="w-full max-w-sm">
                    {/* mobile logo */}
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-900 text-lg font-bold text-amber-400">
                            M
                        </div>
                        <p className="font-semibold leading-tight">
                            Munshigonj Polytechnic
                            <span className="block text-xs font-normal text-stone-500">Institute Chat</span>
                        </p>
                    </div>

                    <h1 className="text-3xl font-bold text-emerald-950">Log in</h1>
                    <p className="mt-1 text-stone-500">আপনার institute account দিয়ে ঢুকুন।</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <a href="#" className="text-sm font-medium text-emerald-800 hover:underline">
                                    Password ভুলে গেছেন?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={show ? "text" : "password"} // ✅ পাসওয়ার্ড শো/হাইড লজিক
                                    placeholder="Enter your right password"
                                    className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-4 pr-12 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-stone-500 hover:bg-stone-100"
                                >
                                    {show ? <EyeOff size={18} /> : <Eye size={18} />} {/* ✅ আইকন যুক্ত করা হলো */}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 py-3 font-semibold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 cursor-pointer"
                        >
                            <LogIn size={18} />
                            Log in
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-stone-500">
                        নতুন User?{" "}
                        <NavLink to="/register" className="font-semibold text-emerald-800 hover:underline">
                            Account খুলুন
                        </NavLink>
                    </p>
                </div>
            </section>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
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

export default Login;