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
    ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Feature({ icon, title }) {
    return (
        <div className="flex items-center gap-3.5 bg-black/60 hover:bg-red-950/20 border border-red-900/20 hover:border-red-600/50 px-4 py-3.5 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] cursor-default group hover:shadow-[0_0_15px_rgba(220,38,38,0.15)]">
            <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-600/20 group-hover:bg-red-600 group-hover:border-red-500 flex items-center justify-center shrink-0 transition-all duration-300">
                {icon}
            </div>
            <span className="text-gray-300 group-hover:text-white text-sm font-medium transition-colors">
                {title}
            </span>
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

            if (register) {
                await register(name, email, password);
            }
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden">

            {/* Background Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/15 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-900/20 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="w-full max-w-4xl bg-[#08080a] rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.12)] border border-red-900/30 overflow-hidden flex flex-col lg:flex-row relative z-10">

                {/* Left Hero Section - Intense Red & Black Gradient */}
                <div className="lg:w-5/12 bg-gradient-to-br from-[#180304] via-[#090203] to-[#000000] p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-red-900/20 relative overflow-hidden">

                    <div className="relative z-10">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-8 group cursor-pointer w-fit">
                            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] transition-all duration-300">
                                <FileText className="text-white w-5 h-5" />
                            </div>
                            <h1 className="text-white text-xl font-bold tracking-tight">
                                Resume <span className="text-red-500 group-hover:text-red-400 transition-colors">Builder</span>
                            </h1>
                        </div>

                        {/* Heading */}
                        <div className="space-y-2 mb-8">
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                Create Account
                            </h2>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Join thousands of job seekers and build high-scoring ATS resumes in minutes.
                            </p>
                        </div>

                        {/* Feature Badges */}
                        <div className="space-y-3">
                            <Feature
                                icon={<FileText className="text-red-500 group-hover:text-white w-4 h-4 transition-colors" />}
                                title="ATS-Optimized Templates"
                            />
                            <Feature
                                icon={<Sparkles className="text-red-500 group-hover:text-white w-4 h-4 transition-colors" />}
                                title="AI-Powered Content Suggestions"
                            />
                            <Feature
                                icon={<ShieldCheck className="text-red-500 group-hover:text-white w-4 h-4 transition-colors" />}
                                title="Instant PDF Export"
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-gray-600 mt-8 relative z-10">
                        © 2026 ResumeBuilder. All rights reserved.
                    </p>
                </div>

                {/* Right Section - Pure Black Form */}
                <div className="lg:w-7/12 p-8 md:p-10 flex justify-center items-center bg-[#050507]">
                    <div className="w-full max-w-sm">

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                                Get Started
                            </h2>
                            <p className="text-gray-400 text-xs">
                                Enter your details to setup your account
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-950/40 border border-red-600/50 text-red-400 p-3 rounded-xl text-xs mb-5 animate-pulse">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Name Input */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 w-4 h-4 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Lucky Birle"
                                        style={{
                                            WebkitBoxShadow: "0 0 0 30px #0c0c0e inset",
                                            WebkitTextFillColor: "#ffffff",
                                        }}
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#0c0c0e] border border-red-950/50 hover:border-red-900/60 rounded-xl text-xs text-white placeholder-gray-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 w-4 h-4 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="luckybirle09@gmail.com"
                                        style={{
                                            WebkitBoxShadow: "0 0 0 30px #0c0c0e inset",
                                            WebkitTextFillColor: "#ffffff",
                                        }}
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#0c0c0e] border border-red-950/50 hover:border-red-900/60 rounded-xl text-xs text-white placeholder-gray-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 w-4 h-4 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{
                                            WebkitBoxShadow: "0 0 0 30px #0c0c0e inset",
                                            WebkitTextFillColor: "#ffffff",
                                        }}
                                        className="w-full pl-10 pr-10 py-2.5 bg-[#0c0c0e] border border-red-950/50 hover:border-red-900/60 rounded-xl text-xs text-white placeholder-gray-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-3.5 h-3.5" />
                                        ) : (
                                            <Eye className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Primary Action Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl font-semibold text-xs shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 mt-3 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>

                            {/* Sign In Link */}
                            <div className="text-center text-xs text-gray-400 pt-3">
                                Already have an account?
                                <Link
                                    to="/login"
                                    className="text-red-500 font-semibold ml-1.5 hover:text-red-400 hover:underline transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}