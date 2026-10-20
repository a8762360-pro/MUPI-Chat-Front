import React, { useContext, useState } from "react";
import { FiEye, FiEyeOff, FiUserPlus, FiCheckCircle } from "react-icons/fi";
import { FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../AuthContext/AuthContext";
import axios from "axios";
import { toast } from "react-toastify"; // 🟢 react-toastify ইমপোর্ট করা হলো

const DEPARTMENTS = [
    "Computer Science & Technology",
    "Civil Technology",
    "Electrical Technology",
    "Electronics Technology",
    "Mechanical Technology",
    "Power Technology",
];

const SEMESTERS = [ "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th" ];

const inputCls =
    "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20";

const Field = ({ label, id, children }) => (
    <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
            {label}
        </label>
        {children}
    </div>
);

const Register = () => {
    const [ status, setStatus ] = useState("student");
    const [ show, setShow ] = useState(false);
    const [ agree, setAgree ] = useState(false);
    const [ error, setError ] = useState("");
    const { createUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!agree) {
            const errMsg = "Obosshoi niyamabolite sommot hon.";
            setError(errMsg);
            toast.error(errMsg); // 🟢 টোস্ট নোটিফিকেশন
            return;
        }

        const role = status;
        const name = e.target.name.value;
        const idCard = e.target.id.value;
        const image = e.target.image.value;
        const department = e.target.department.value;
        const semester = status === "student" ? e.target.semester?.value : "";
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmpassword = e.target.confirm.value;

        if (password !== confirmpassword) {
            const errMsg = "Password no matching";
            setError(errMsg);
            toast.error(errMsg); // 🟢 টোস্ট নোটিফিকেশন
            return;
        }

        const newUserData = {
            name,
            email,
            password,
            role,
            idCard,
            imageName: image,
            department,
            semester,
        };

        // create account firebase
        createUser(email, password)
            .then(res => {
                const user = res.user;

                if (user) {
                    // 🟢 সফলভাবে ফায়ারবেস অ্যাকাউন্ট খোলার পর টোস্ট
                    toast.success("Firebase account created successfully!");

                    const userFullData = {
                        uid: user.uid,
                        ...newUserData,
                        createdAt: new Date()
                    };

                    // send user data to database
                    axios.post("http://localhost:3000/users", userFullData)
                        .then(dbRes => {
                            // 🟢 ডাটাবেজে সফলভাবে সেভ হওয়ার পর টোস্ট
                            toast.success("Your data was successfully submitted to the database!");
                            e.target.reset();
                            setAgree(false);
                            navigate("/inbox");
                        })
                        .catch(err => {
                            console.error("Database Save Error:", err);
                            const errMsg = "Failed to save user in database: " + err.message;
                            setError(errMsg);
                            toast.error(errMsg); // 🟢 ডাটাবেজ এরর টোস্ট
                        });
                }
            })
            .catch(err => {
                console.error("Firebase Auth Error:", err);
                const errMsg = "Firebase account creation failed: " + err.message;
                setError(errMsg);
                toast.error(errMsg); // 🟢 ফায়ারবেস এরর টোস্ট
            });
    };

    const roles = [
        { key: "student", label: "Student", icon: FaGraduationCap },
        { key: "teacher", label: "Teacher", icon: FaChalkboardTeacher },
    ];

    const perks = [
        "Department group এ সবার সাথে কথা বলুন",
        "Notice সবার আগে পান",
        "শিক্ষকদের সাথে সরাসরি যোগাযোগ",
    ];

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
                    <h2 className="text-4xl font-bold leading-tight">আমাদের ক্যাম্পাসে যোগ দিন।</h2>
                    <ul className="mt-8 space-y-4">
                        {perks.map((p) => (
                            <li key={p} className="flex items-start gap-3 text-lg text-emerald-100">
                                <FiCheckCircle size={22} className="mt-0.5 shrink-0 text-amber-400" />
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-sm text-emerald-300">© Munshigonj Polytechnic Institute</p>
            </section>

            {/* ---------- Right: form ---------- */}
            <section className="flex w-full items-center justify-center px-5 py-10 lg:w-[540px] lg:shrink-0">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-900 text-lg font-bold text-amber-400">
                            M
                        </div>
                        <p className="font-semibold leading-tight">
                            Munshigonj Polytechnic
                            <span className="block text-xs font-normal text-stone-500">Institute Chat</span>
                        </p>
                    </div>

                    <h1 className="text-3xl font-bold text-emerald-950">Account খুলুন</h1>
                    <p className="mt-1 text-stone-500">কয়েকটা তথ্য দিলেই হয়ে যাবে।</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-4" >
                        {/* Role toggle */}
                        <div className="grid grid-cols-2 gap-1 rounded-xl bg-stone-200 p-1">
                            {roles.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setStatus(key)}
                                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${status === key ? "bg-white text-emerald-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                                        }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        <Field label="Full Name" id="name">
                            <input id="name" required name="name" autoComplete="name" placeholder="Enter your name" className={inputCls} />
                        </Field>

                        <Field label={status === "student" ? "Roll number" : "Teacher ID"} id="id">
                            <input id="id" required name="uid" placeholder={status === "student" ? "Enter your roll" : "Enter your ID"} className={inputCls} />
                        </Field>

                        <Field label="Image" id="image">
                            <input type="text" placeholder="Enter your photo URL" required id="image" name="image" className={inputCls} />
                        </Field>

                        <div className={`grid gap-4 ${status === "student" ? "sm:grid-cols-2" : ""}`}>
                            <Field label="Department" id="department">
                                <select id="department" name="department" className={inputCls}>
                                    {DEPARTMENTS.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </Field>

                            {status === "student" && (
                                <Field label="Semester" id="semester">
                                    <select id="semester" name="semester" className={inputCls}>
                                        {SEMESTERS.map((s) => (
                                            <option key={s} value={s}>{s} Semester</option>
                                        ))}
                                    </select>
                                </Field>
                            )}
                        </div>

                        <Field label="Email" id="email">
                            <input id="email" required name="email" type="email" autoComplete="email" placeholder="Enter your email" className={inputCls} />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Password" id="password">
                                <div className="relative">
                                    <input
                                        required
                                        id="password"
                                        name="password"
                                        type={show ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Enter the password"
                                        className={`${inputCls} pr-12`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShow(!show)}
                                        aria-label={show ? "Hide password" : "Show password"}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-stone-500 hover:bg-stone-100"
                                    >
                                        {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                            </Field>

                            <Field label="Confirm password " id="confirm">
                                <input
                                    required
                                    id="confirm"
                                    name="confirm"
                                    type={show ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                    className={inputCls}
                                />
                            </Field>
                        </div>

                        <label className="flex cursor-pointer items-start gap-2 text-sm text-stone-600">
                            <input
                                required
                                type="checkbox"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-emerald-800"
                            />
                            আমি institute এর chat ব্যবহারের নিয়মাবলিতে সম্মত।
                        </label>

                        {error && (
                            <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 py-3 font-semibold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                        >
                            <FiUserPlus size={18} />
                            Account খুলুন
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-stone-500">
                        আগে থেকেই account আছে?{" "}
                        <NavLink to="/login" className="font-semibold text-emerald-800 hover:underline">
                            Log in করুন
                        </NavLink>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Register;