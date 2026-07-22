import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-[#050507]/90 backdrop-blur-md border-b border-red-900/30 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

                {/* Brand Logo - Pure Black & Crimson Aesthetic */}
                <Link to="/builder" className="flex items-center gap-2.5 group cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(220,38,38,0.8)] transition-all duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">
                        Resume <span className="text-red-500 group-hover:text-red-400 transition-colors">Builder</span>
                    </span>
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3 md:gap-4">
                    {user && (
                        <>
                            {/* Profile Badge */}
                            <div className="flex items-center gap-2.5 bg-[#0c0c0e] border border-red-950/60 rounded-full px-3 py-1.5 shadow-inner">
                                <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-600/50 flex items-center justify-center text-red-400 text-xs font-bold shadow-sm">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs md:text-sm text-gray-200 font-semibold max-w-[120px] md:max-w-[180px] truncate">
                                    {user.name}
                                </span>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="text-xs bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white px-3.5 py-1.5 rounded-full border border-red-900/40 hover:border-red-500 transition-all duration-200 font-semibold cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}