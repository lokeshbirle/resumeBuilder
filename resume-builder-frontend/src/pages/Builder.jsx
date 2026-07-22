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
import { Plus, Trash2 } from "lucide-react";

const DEFAULT_TABS = [
    { id: "personalInfo", label: "Personal Info", icon: "👤" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "skills", label: "Skills", icon: "🛠️" },
    { id: "achievements", label: "Achievements", icon: "🏆" },
];

export default function Builder() {
    const { register, control, watch, getValues, setValue } = useForm({
        defaultValues: {
            personalInfo: {},
            education: [],
            experience: [],
            projects: [],
            skillsRaw: "",
            achievementsRaw: "",
            customSections: [], // Stores extra custom section objects
            sectionOrder: ["summary", "experience", "projects", "skills", "education", "achievements"]
        },
    });

    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState(DEFAULT_TABS);
    const [resumeId, setResumeId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [tabKey, setTabKey] = useState(0);

    // Custom Section Modal/Input States
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customTitle, setCustomTitle] = useState("");

    // Live watchers
    const liveData = watch();
    const sectionOrder = watch("sectionOrder") || [];
    const customSections = watch("customSections") || [];

    useEffect(() => {
        const timer = setTimeout(() => setPageLoaded(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleTabChange = (index) => {
        setActiveTab(index);
        setTabKey((prev) => prev + 1);
    };

    // ==========================================
    // ➕ ADD & REMOVE CUSTOM SECTIONS
    // ==========================================
    const handleAddCustomSection = () => {
        if (!customTitle.trim()) return;

        const sectionKey = `custom_${Date.now()}`;
        const newTab = {
            id: sectionKey,
            label: customTitle.trim(),
            icon: "⭐",
            isCustom: true,
        };

        const updatedCustom = [
            ...customSections,
            { id: sectionKey, title: customTitle.trim(), contentRaw: "" }
        ];

        setValue("customSections", updatedCustom);
        setValue("sectionOrder", [...sectionOrder, customTitle.trim().toLowerCase()]);

        setTabs((prev) => [...prev, newTab]);
        setActiveTab(tabs.length); // Switch to newly created tab
        setCustomTitle("");
        setShowCustomModal(false);
        showToast(`Added "${customTitle}" section!`);
    };

    const handleRemoveCustomSection = (idToRemove, labelToRemove, e) => {
        e.stopPropagation();
        if (!window.confirm(`Remove section "${labelToRemove}"?`)) return;

        // Remove from dynamic tabs
        const updatedTabs = tabs.filter((t) => t.id !== idToRemove);
        setTabs(updatedTabs);

        // Remove from customSections react-hook-form state
        const updatedCustom = customSections.filter((c) => c.id !== idToRemove);
        setValue("customSections", updatedCustom);

        // Remove from sectionOrder
        const updatedOrder = sectionOrder.filter(
            (item) => item !== labelToRemove.toLowerCase()
        );
        setValue("sectionOrder", updatedOrder);

        // Adjust active tab index if needed
        if (activeTab >= updatedTabs.length) {
            setActiveTab(Math.max(0, updatedTabs.length - 1));
        }
    };

    // ==========================================
    // 📦 PAYLOAD BUILDER
    // ==========================================
    const buildPayload = () => {
        const values = getValues();
        return {
            title: values.personalInfo?.fullName ? `${values.personalInfo.fullName}'s Resume` : "My Resume",
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
            customSections: (values.customSections || []).map((c) => ({
                title: c.title,
                items: (c.contentRaw || "").split("\n").filter(Boolean)
            })),
            sectionOrder: values.sectionOrder
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

    // DRAG & DROP HANDLERS
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

        setValue("sectionOrder", newOrder);
    };

    // RENDER TAB CONTENT
    const renderTab = () => {
        const currentTab = tabs[activeTab];
        if (!currentTab) return null;

        if (currentTab.isCustom) {
            const customIdx = customSections.findIndex((c) => c.id === currentTab.id);
            return (
                <div className="space-y-4 animate-fade-in-up">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        ⭐ {currentTab.label}
                    </h3>
                    <p className="text-sm text-gray-500">
                        Add details line-by-line (each new line will appear as a separate bullet point).
                    </p>
                    <textarea
                        {...register(`customSections.${customIdx}.contentRaw`)}
                        rows={6}
                        placeholder={`• Certified AWS Developer\n• Spoken English & Hindi\n• Open Source Contributor`}
                        className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 transition-all font-sans text-sm"
                    />
                </div>
            );
        }

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

            {/* Toast Notification */}
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
                    lg:w-[42%]
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

                    {/* Drag & Drop Reorder UI */}
                    <div className="mb-6 bg-slate-50 border border-slate-200/80 p-4 rounded-2xl animate-fade-in-up" style={{ animationDelay: "160ms" }}>
                        <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                            🗺️ Drag Sections to Reorder Resume:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {sectionOrder && sectionOrder.map((section, idx) => (
                                <div
                                    key={`${section}_${idx}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    className="cursor-grab active:cursor-grabbing px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-semibold text-gray-700 flex items-center gap-1.5 hover:border-red-500 hover:text-red-600 transition-all active:scale-95"
                                >
                                    <span className="text-slate-400">☰</span>
                                    <span className="capitalize">{section === "skills" ? "Technical Skills" : section}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section Tabs */}
                    <div className="flex flex-wrap gap-2.5 mb-6 border-b border-gray-200 pb-5">
                        {tabs.map((tab, i) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(i)}
                                className={`
                                px-4
                                py-2.5
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
                                          `
                                }
                            `}
                                style={{ animationDelay: `${200 + i * 30}ms` }}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                                {tab.isCustom && (
                                    <span
                                        onClick={(e) => handleRemoveCustomSection(tab.id, tab.label, e)}
                                        className="ml-1 text-slate-400 hover:text-white rounded-full p-0.5 hover:bg-black/20"
                                        title="Delete section"
                                    >
                                        ✕
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ADD CUSTOM SECTION CONTROL */}
                    <div className="mb-6">
                        {!showCustomModal ? (
                            <button
                                onClick={() => setShowCustomModal(true)}
                                className="w-full py-3 border-2 border-dashed border-red-300 bg-red-50/50 text-red-600 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-500 transition-all duration-300 active:scale-98"
                            >
                                <Plus className="w-4 h-4" /> Add Custom Section (e.g. Certifications, Languages)
                            </button>
                        ) : (
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3 animate-fade-in-up">
                                <p className="text-xs font-bold text-gray-700 uppercase">New Custom Section Title:</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. Certifications, Languages, Hobbies"
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                                    />
                                    <button
                                        onClick={handleAddCustomSection}
                                        className="bg-[#E50914] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setShowCustomModal(false)}
                                        className="bg-gray-200 text-gray-700 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dynamic Form Area */}
                    <div key={tabKey} className="min-h-[300px] animate-fade-in-up">
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
        lg:w-[58%]
        flex
        justify-center
        items-start
        transition-all
        duration-700
        ${pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
    `}
                    style={{ transitionDelay: "150ms" }}
                >
                    <div
                        className="
            w-full
            max-h-[85vh]
            overflow-y-auto
            overflow-x-hidden
            rounded-[32px]
            shadow-2xl
            border
            border-gray-200
            bg-slate-100
            p-4
            flex
            justify-center
            items-start
            transition-all
            duration-500
            hover:shadow-[0_25px_50px_rgba(178,7,16,0.15)]
        "
                    >
                        {/* Container with Zoom Scaling so A4 fits nicely without horizontal scrolling */}
                        <div className="w-full flex justify-center origin-top transform scale-[0.75] xl:scale-[0.88] 2xl:scale-100 transition-transform">
                            <ResumePreview data={liveData} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}