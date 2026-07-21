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
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* Brand Logo - Updated to Royal Blue & Navy Accent */}
                <Link to="/builder" className="flex items-center gap-2.5 hover:opacity-95 transition-opacity">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-500/15">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-gray-800">
                        Resume <span className="text-blue-600">Builder</span>
                    </span>
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {user && (
                        <>
                            {/* Profile Badge - Updated with Blue Accent */}
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-700 font-semibold">{user.name}</span>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="text-xs bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors font-semibold"
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