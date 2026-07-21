import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FileText,
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
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

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

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

            await login(email, password);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Invalid email or password"
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
                            Welcome Back
                            <br />
                            Continue Building Your
                            <br />
                            <span className="text-[#E50914]">Professional Resume</span>
                        </h2>

                        <div className="w-16 h-1 bg-[#E50914] rounded-full mb-8"></div>

                        <p className="text-slate-400 text-lg mb-12 max-w-lg">
                            Access your resumes, edit them anytime,
                            and download beautiful ATS-friendly PDFs.
                        </p>

                        <div className="space-y-8">
                            <Feature
                                icon={<FileText className="text-[#E50914] w-5 h-5" />}
                                title="Professional Templates"
                                desc="Choose from expertly designed templates"
                            />

                            <Feature
                                icon={<Sparkles className="text-[#E50914] w-5 h-5" />}
                                title="AI Powered Suggestions"
                                desc="Generate stronger resume content instantly"
                            />

                            <Feature
                                icon={<CloudUpload className="text-[#E50914] w-5 h-5" />}
                                title="Export & Share"
                                desc="Download polished PDFs with one click"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="lg:w-1/2 p-14 flex justify-center items-center bg-white">
                    <div className="w-full max-w-lg">

                        <div className="text-center mb-10">
                            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                                <LogIn className="w-10 h-10 text-[#E50914]" />
                            </div>

                            <h2 className="text-4xl font-bold text-gray-900">
                                Welcome Back
                            </h2>

                            <p className="text-gray-500 mt-3 text-lg">
                                Sign in to continue building your resume
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-14 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-[#E50914] outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-14 pr-14 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-[#E50914] outline-none transition"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#E50914] to-[#B20710] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:scale-[1.02] hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </button>

                            <div className="flex items-center gap-4 py-2">
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span className="text-gray-400 text-sm">or</span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                            </div>

                            <button
                                type="button"
                                className="w-full border border-gray-300 py-4 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                Continue with Google
                            </button>

                            <div className="text-center text-gray-500">
                                Don't have an account?
                                <Link
                                    to="/register"
                                    className="text-[#E50914] font-semibold ml-2 hover:text-[#B20710]"
                                >
                                    Create Account
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}