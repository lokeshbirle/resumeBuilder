import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import PersonalInfoForm from "../components/forms/PersonalInfoForm";
import EducationForm from "../components/forms/EducationForm";
import ExperienceForm from "../components/forms/ExperienceForm";
import ProjectsForm from "../components/forms/ProjectsForm";
import SkillsForm from "../components/forms/SkillsForm";
import AchievementsForm from "../components/forms/AchievementsForm";
import ResumePreview from "../components/preview/ResumePreview";

const TABS = [
    { label: "Personal Info", icon: "👤" },
    { label: "Education", icon: "🎓" },
    { label: "Experience", icon: "💼" },
    { label: "Projects", icon: "🚀" },
    { label: "Skills", icon: "🛠️" },
    { label: "Achievements", icon: "🏆" },
];

export default function Builder() {
    // 1. Added "setValue" here to update react-hook-form state programmatically
    // and defined "sectionOrder" default array sequence matching your layout
    const { register, control, watch, getValues, setValue } = useForm({
        defaultValues: {
            personalInfo: {},
            education: [],
            experience: [],
            projects: [],
            skillsRaw: "",
            achievementsRaw: "",
            sectionOrder: ["summary", "experience", "projects", "skills", "education", "achievements"]
        },
    });

    const [activeTab, setActiveTab] = useState(0);
    const [resumeId, setResumeId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [tabKey, setTabKey] = useState(0); // forces re-animation on tab switch

    // Live watchers
    const liveData = watch();
    const sectionOrder = watch("sectionOrder"); // Watches the dynamic order array

    useEffect(() => {
        const timer = setTimeout(() => setPageLoaded(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleTabChange = (index) => {
        setActiveTab(index);
        setTabKey((prev) => prev + 1);
    };

    // 2. Updated buildPayload to sync "sectionOrder" with your MongoDB schema
    const buildPayload = () => {
        const values = getValues();
        return {
            title: values.personalInfo.fullName ? `${values.personalInfo.fullName}'s Resume` : "My Resume",
            personalInfo: values.personalInfo,
            education: values.education || [],
            experience: (values.experience || []).map((e) => ({
                ...e,
                bulletPoints: (e.bulletPointsRaw || "").split("\n").filter(Boolean),
            })),
            projects: (values.projects || []).map((p) => ({
                title: p.title,
                techStack: (p.techStackRaw || "").split(",").map((s) => s.trim()).filter(Boolean),
                bulletPoints: (p.bulletPointsRaw || "").split("\n").filter(Boolean),
            })),
            skills: (values.skillsRaw || "").split("\n").filter(Boolean),
            achievements: (values.achievementsRaw || "").split("\n").filter(Boolean),
            certifications: [],
            sectionOrder: values.sectionOrder // Sent directly to backend
        };
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = buildPayload();
            if (resumeId) {
                await api.put(`/resumes/${resumeId}`, payload);
            } else {
                const res = await api.post("/resumes", payload);
                setResumeId(res.data.id);
            }
            showToast("Resume saved successfully!");
        } catch (err) {
            showToast(err.response?.data?.error || "Error saving resume", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        if (!resumeId) {
            showToast("Please save the resume first!", "error");
            return;
        }
        try {
            const res = await api.get(`/resumes/${resumeId}/download`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "resume.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
            showToast("PDF downloaded!");
        } catch (err) {
            showToast("Error downloading PDF", "error");
        }
    };

    // ==========================================
    // ⚙️ ADDED: Drag & Drop Logic Functions
    // ==========================================
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("index", index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetIndex) => {
        const sourceIndex = e.dataTransfer.getData("index");
        if (sourceIndex === "" || sourceIndex === targetIndex) return;

        const newOrder = [...sectionOrder];
        const [removed] = newOrder.splice(sourceIndex, 1);
        newOrder.splice(targetIndex, 0, removed);

        setValue("sectionOrder", newOrder); // Updates state dynamically
    };
    // ==========================================

    const renderTab = () => {
        switch (activeTab) {
            case 0: return <PersonalInfoForm register={register} />;
            case 1: return <EducationForm control={control} register={register} />;
            case 2: return <ExperienceForm control={control} register={register} />;
            case 3: return <ProjectsForm control={control} register={register} />;
            case 4: return <SkillsForm register={register} />;
            case 5: return <AchievementsForm register={register} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-red-50">

            {/* Toast */}
            {toast && (
                <div
                    key={toast.message}
                    className={`fixed top-20 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white font-medium animate-fade-in-up ${
                        toast.type === "error"
                            ? "bg-gradient-to-r from-red-600 to-red-700"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                    }`}
                >
                    {toast.message}
                </div>
            )}

            <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-6">

                {/* Left Form Section */}
                <div
                    className={`
                    w-full
                    lg:w-[42%] // lg:w-1/2
                    bg-white
                    rounded-[32px]
                    shadow-xl
                    p-8
                    border
                    border-gray-200
                    transition-all
                    duration-500
                    hover:shadow-[0_25px_50px_rgba(178,7,16,0.15)]
                    ${pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                `}
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
                        Build Your Resume
                    </h2>

                    <p className="text-gray-600 mb-6 animate-fade-in-up" style={{ animationDelay: "140ms" }}>
                        Fill in your details and see the live preview instantly.
                    </p>

                    {/* ========================================== */}
                    {/* 🗺️ ADDED: Section Ordering Drag & Drop UI */}
                    {/* ========================================== */}
                    <div className="mb-6 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl animate-fade-in-up" style={{ animationDelay: "160ms" }}>
                        <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                            🗺️ Drag Sections to Reorder Resume:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {sectionOrder && sectionOrder.map((section, idx) => (
                                <div
                                    key={section}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    className="cursor-grab active:cursor-grabbing px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-semibold text-gray-700 flex items-center gap-1.5 hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95"
                                >
                                    <span className="text-slate-400">☰</span>
                                    <span className="capitalize">{section === "skills" ? "Technical Skills" : section}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* ========================================== */}

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-5">
                        {TABS.map((tab, i) => (
                            <button
                                key={tab.label}
                                onClick={() => handleTabChange(i)}
                                className={`
                                px-4
                                py-3
                                rounded-2xl
                                text-sm
                                font-semibold
                                transition-all
                                duration-300
                                flex
                                items-center
                                gap-2
                                active:scale-95
                                animate-fade-in-up
                                ${
                                    activeTab === i
                                        ? `
                                            bg-gradient-to-r
                                            from-[#E50914]
                                            to-[#B20710]
                                            text-white
                                            shadow-lg
                                            scale-105
                                          `
                                        : `
                                            bg-gray-100
                                            text-gray-700
                                            hover:bg-gray-200
                                            hover:scale-105
                                          `
                                }
                            `}
                                style={{ animationDelay: `${200 + i * 40}ms` }}
                            >
                                <span className={`text-lg transition-transform duration-300 ${activeTab === i ? "scale-110" : ""}`}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Forms — re-animates on every tab switch via key */}
                    <div key={tabKey} className="min-h-[320px] animate-fade-in-up">
                        {renderTab()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="
                            flex-1
                            bg-gradient-to-r
                            from-[#E50914]
                            to-[#B20710]
                            text-white
                            py-4
                            rounded-2xl
                            font-semibold
                            transition-all
                            duration-300
                            hover:scale-105
                            hover:shadow-[0_10px_30px_rgba(229,9,20,0.35)]
                            active:scale-95
                            disabled:opacity-50
                            disabled:hover:scale-100
                            flex items-center justify-center gap-2
                        "
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>💾 Save Resume</>
                            )}
                        </button>

                        <button
                            onClick={handleDownload}
                            className="
                            flex-1
                            bg-gradient-to-r
                            from-black
                            to-gray-900
                            text-white
                            py-4
                            rounded-2xl
                            font-semibold
                            transition-all
                            duration-300
                            hover:scale-105
                            hover:shadow-[0_10px_30px_rgba(0,0,0,0.30)]
                            active:scale-95
                        "
                        >
                            ⬇️ Download PDF
                        </button>

                    </div>
                </div>

                {/* Preview Section */}
                <div
                    className={`
                    w-full
                    lg:w-[58%] // lg:w-1/2
                    flex
                    justify-center
                    transition-all
                    duration-700
                    ${pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                `}
                    style={{ transitionDelay: "150ms" }}
                >
                    <div
                        className="
                        overflow-auto
                        max-h-[85vh]
                        rounded-[32px]
                        shadow-2xl
                        border
                        border-gray-200
                        bg-white
                        p-4
                        transition-all
                        duration-500
                        hover:shadow-[0_25px_50px_rgba(178,7,16,0.15)]
                    "
                    >
                        {/* Resume stays plain white and ATS-friendly */}
                        <ResumePreview data={liveData} />
                    </div>

                </div>

            </div>
        </div>
    );
}