// src/pages/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FileText,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    Sparkles,
    CloudUpload
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Feature({ icon, title, desc }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                {icon}
            </div>

            <div>
                <h3 className="text-white font-semibold">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
            </div>
        </div>
    );
}

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await register(name, email, password);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-7xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-500 hover:shadow-[0_25px_60px_rgba(178,7,16,0.20)]">

                {/* Left Section */}
                <div className="lg:w-1/2 bg-gradient-to-br from-black via-[#120004] to-[#8B0000] p-14 relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">

                        <div className="flex items-center gap-4 mb-14">
                            <div className="w-14 h-14 rounded-2xl border border-red-500/30 flex items-center justify-center">
                                <FileText className="text-[#E50914] w-8 h-8" />
                            </div>

                            <div>
                                <h1 className="text-white text-4xl font-bold">
                                    Resume <span className="text-[#E50914]">Builder</span>
                                </h1>

                                <p className="text-slate-400">
                                    Create. Customize. Impress.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-5xl font-bold text-white leading-tight mb-5">
                            Build Your Professional
                            <br />
                            <span className="text-[#E50914]">Resume</span> in Minutes
                        </h2>

                        <div className="w-16 h-1 bg-[#E50914] rounded-full mb-8"></div>

                        <p className="text-slate-400 mb-12 text-lg">
                            Join thousands of professionals who landed
                            their dream jobs with modern ATS-friendly resumes.
                        </p>

                        <div className="space-y-8">
                            <Feature
                                icon={<FileText className="text-[#E50914] w-5 h-5" />}
                                title="Professional Templates"
                                desc="Choose from expertly designed templates"
                            />

                            <Feature
                                icon={<Sparkles className="text-[#E50914] w-5 h-5" />}
                                title="AI Suggestions"
                                desc="Generate better resume content instantly"
                            />

                            <Feature
                                icon={<CloudUpload className="text-[#E50914] w-5 h-5" />}
                                title="Export & Share"
                                desc="Download beautiful PDF resumes"
                            />
                        </div>

                    </div>
                </div>

                {/* Right Section */}
                <div className="lg:w-1/2 p-14 flex justify-center items-center bg-white">
                    <div className="w-full max-w-lg">

                        <div className="text-center mb-10">
                            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                                <UserPlus className="text-[#E50914] w-10 h-10" />
                            </div>

                            <h2 className="text-4xl font-bold text-gray-900">
                                Create Your Account
                            </h2>

                            <p className="text-gray-500 mt-3 text-lg">
                                Start building your professional resume
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Name */}
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full Name"
                                    required
                                    className="w-full pl-14 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-[#E50914] outline-none transition"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    className="w-full pl-14 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-[#E50914] outline-none transition"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="w-full pl-14 pr-14 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-[#E50914] outline-none transition"
                                />

                                <button
                                    type="button"
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#E50914] to-[#B20710] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:scale-[1.02] hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>

                            <div className="text-center text-gray-500">
                                Already have an account?
                                <Link
                                    className="text-[#E50914] font-semibold ml-2 hover:text-[#B20710]"
                                    to="/login"
                                >
                                    Login
                                </Link>
                            </div>

                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
}