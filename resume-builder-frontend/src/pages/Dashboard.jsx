import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    Plus,
    Download,
    Trash2,
    Edit3,
    Calendar,
    FolderOpen,
    Clock3,
    Award
} from "lucide-react";
import api from "../api/axiosInstance";

export default function Dashboard() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const res = await api.get("/resumes");
            setResumes(res.data);
        } catch (err) {
            setError("Failed to load resumes");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this resume permanently?")) return;

        try {
            setDeletingId(id);

            await api.delete(`/resumes/${id}`);

            setResumes((prev) =>
                prev.filter((resume) => resume.id !== id)
            );
        } catch (err) {
            alert("Failed to delete resume");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDownload = async (id, title) => {
        try {
            const res = await api.get(
                `/resumes/${id}/download`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([res.data])
            );

            const link = document.createElement("a");

            link.href = url;
            link.setAttribute(
                "download",
                `${title || "resume"}.pdf`
            );

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Failed to download PDF");
        }
    };

    const handleEdit = (id) => {
        navigate(`/builder/${id}`);
    };

    const handleCreateNew = () => {
        navigate("/builder");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";

        return new Date(dateStr).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    const latestResumeDate =
        resumes.length > 0
            ? [...resumes]
                .sort(
                    (a, b) =>
                        new Date(b.updatedAt) -
                        new Date(a.updatedAt)
                )[0]?.updatedAt
            : null;

    return (
        <div className="min-h-screen bg-slate-100">

            {/* HERO SECTION */}
            <div className="bg-gradient-to-r from-[#020202] via-[#140004] to-[#8B0000] text-white">
                <div className="max-w-7xl mx-auto px-6 py-16">

                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

                        <div>
                            <div className="inline-flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-[#B20710]/20 border border-[#B20710]/30 flex items-center justify-center">
                                    <FileText className="text-[#E50914] w-8 h-8" />
                                </div>

                                <div>
                                    <h1 className="text-5xl font-bold">
                                        Resume Dashboard
                                    </h1>

                                    <p className="text-slate-400 mt-2">
                                        Manage and organize your professional resumes
                                    </p>
                                </div>
                            </div>

                            <p className="text-slate-300 max-w-2xl text-lg">
                                Create ATS-friendly resumes, edit existing versions,
                                and export polished PDFs ready for recruiters.
                            </p>
                        </div>

                        <button
                            onClick={handleCreateNew}
                            className="bg-gradient-to-r from-[#E50914] to-[#B20710] px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 shadow-xl hover:shadow-red-900/40 hover:scale-105 transition-all duration-300"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Resume
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

                        <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-lg">
                            <FolderOpen className="text-[#E50914] w-10 h-10 mb-4" />
                            <p className="text-slate-400">Total Resumes</p>
                            <h2 className="text-4xl font-bold mt-2">
                                {resumes.length}
                            </h2>
                        </div>

                        <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-lg">
                            <Clock3 className="text-[#E50914] w-10 h-10 mb-4" />
                            <p className="text-slate-400">Last Updated</p>
                            <h2 className="text-2xl font-bold mt-2">
                                {latestResumeDate
                                    ? formatDate(latestResumeDate)
                                    : "--"}
                            </h2>
                        </div>

                        <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-lg">
                            <Award className="text-[#E50914] w-10 h-10 mb-4" />
                            <p className="text-slate-400">
                                ATS Ready Templates
                            </p>
                            <h2 className="text-4xl font-bold mt-2">
                                12+
                            </h2>
                        </div>

                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* LOADING */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-red-200 border-t-[#E50914] rounded-full animate-spin"></div>
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center">
                        {error}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && !error && resumes.length === 0 && (
                    <div className="bg-white rounded-[32px] shadow-xl p-20 text-center">

                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-12 h-12 text-blue-600" />
                        </div>

                        <h2 className="text-3xl font-bold mb-4">
                            No resumes created yet
                        </h2>

                        <p className="text-gray-500 mb-8">
                            Start building your first professional resume.
                        </p>

                        <button
                            onClick={handleCreateNew}
                            className="bg-gradient-to-r from-[#E50914] to-[#B20710] text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300"
                        >
                            Create Resume
                        </button>
                    </div>
                )}

                {/* RESUME GRID */}
                {!loading && !error && resumes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="bg-white rounded-[32px] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-8 border border-gray-100"
                            >

                                <div className="flex justify-between items-start mb-6">

                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-black to-gray-900 shadow-lg shadow-gray-300 flex items-center justify-center">
                                        <FileText className="text-white w-8 h-8" />
                                    </div>

                                    {/*<span className="text-xs bg-blue-100 text-red-500 px-4 py-2 rounded-full font-semibold">*/}
                                    {/*    ATS Ready*/}
                                    {/*</span>*/}

                                    <span className="text-xs text-[#E50914] border border-black px-4 py-2 rounded-full font-semibold bg-white">
                                            ATS Ready
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 truncate">
                                    {resume.title || "Untitled Resume"}
                                </h2>

                                <p className="text-slate-500 mt-2 truncate">
                                    {resume.personalInfo?.fullName ||
                                        "No Name Added"}
                                </p>

                                <div className="flex items-center gap-2 text-slate-400 mt-5">
                                    <Calendar className="w-4 h-4" />
                                    Updated {formatDate(resume.updatedAt)}
                                </div>

                                <div className="grid grid-cols-3 gap-3 mt-8">

                                    <button
                                        onClick={() => handleEdit(resume.id)}
                                        className="bg-blue-100 text-blue-700 rounded-xl py-3 flex justify-center items-center hover:bg-blue-600 hover:text-white transition-all duration-300"
                                    >
                                        <Edit3 className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDownload(
                                                resume.id,
                                                resume.title
                                            )
                                        }
                                        className="bg-green-100 text-green-700 rounded-xl py-3 flex justify-center items-center hover:bg-green-600 hover:text-white transition-all duration-300"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(resume.id)
                                        }
                                        disabled={deletingId === resume.id}
                                        className="bg-red-100 text-red-700 rounded-xl py-3 flex justify-center items-center hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-50"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}