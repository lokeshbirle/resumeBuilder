import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import PersonalInfoForm from "../components/forms/PersonalInfoForm";
import EducationForm from "../components/forms/EducationForm";
import ExperienceForm from "../components/forms/ExperienceForm";
import ProjectsForm from "../components/forms/ProjectsForm";
import SkillsForm from "../components/forms/SkillsForm";
import AchievementsForm from "../components/forms/AchievementsForm";
import ResumePreview from "../components/preview/ResumePreview";
import {
    User,
    GraduationCap,
    Briefcase,
    FolderGit2,
    Wrench,
    Trophy,
    Plus,
    GripVertical,
    ChevronLeft,
    ChevronRight,
    Save,
    Download,
    Trash2,
    Star,
    LayoutTemplate
} from "lucide-react";

const DEFAULT_TABS = [
    { id: "personalInfo", label: "Personal Info", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "achievements", label: "Achievements", icon: Trophy },
];

export default function Builder() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, control, watch, getValues, setValue, reset } = useForm({
        defaultValues: {
            personalInfo: {
                fullName: "",
                email: "",
                phone: "",
                address: "",
                linkedin: "",
                portfolio: "",
                summary: ""
            },
            education: [],
            experience: [],
            projects: [],
            skillsRaw: "",
            achievementsRaw: "",
            customSections: [],
            sectionOrder: ["summary", "experience", "education", "skills", "projects", "achievements"]
        },
    });

    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState(DEFAULT_TABS);
    const [resumeId, setResumeId] = useState(id || null);
    const [saving, setSaving] = useState(false);
    const [loadingResume, setLoadingResume] = useState(false);
    const [toast, setToast] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(100);

    // Custom Section Modal/Input States
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customTitle, setCustomTitle] = useState("");

    // Live watchers
    const liveData = watch();
    const sectionOrder = watch("sectionOrder") || [];
    const customSections = watch("customSections") || [];

    // FETCH SAVED RESUME DATA IF EDITING
    useEffect(() => {
        if (id) {
            fetchSavedResume(id);
        }
    }, [id]);

    const fetchSavedResume = async (targetId) => {
        try {
            setLoadingResume(true);
            const res = await api.get(`/resumes/${targetId}`);
            const data = res.data;

            if (data) {
                setResumeId(targetId);

                const loadedCustomSections = (data.customSections || []).map((c, idx) => {
                    const sectionKey = `custom_${Date.now()}_${idx}`;
                    return {
                        id: sectionKey,
                        title: c.title,
                        contentRaw: Array.isArray(c.items) ? c.items.join("\n") : (c.contentRaw || "")
                    };
                });

                const customTabs = loadedCustomSections.map((c) => ({
                    id: c.id,
                    label: c.title,
                    icon: Star,
                    isCustom: true,
                }));

                setTabs([...DEFAULT_TABS, ...customTabs]);

                // Ensure ALL Personal Info fields are explicitly hydrated
                const pInfo = data.personalInfo || {};

                reset({
                    personalInfo: {
                        fullName: pInfo.fullName || pInfo.name || "",
                        email: pInfo.email || "",
                        phone: pInfo.phone || "",
                        address: pInfo.address || "",
                        linkedin: pInfo.linkedin || pInfo.linkedIn || "",
                        portfolio: pInfo.portfolio || pInfo.github || pInfo.website || "",
                        summary: pInfo.summary || ""
                    },
                    education: data.education || [],
                    experience: (data.experience || []).map((exp) => ({
                        ...exp,
                        bulletPointsRaw: Array.isArray(exp.bulletPoints)
                            ? exp.bulletPoints.join("\n")
                            : exp.bulletPointsRaw || "",
                    })),
                    projects: (data.projects || []).map((proj) => ({
                        ...proj,
                        techStackRaw: Array.isArray(proj.techStack)
                            ? proj.techStack.join(", ")
                            : proj.techStackRaw || "",
                        bulletPointsRaw: Array.isArray(proj.bulletPoints)
                            ? proj.bulletPoints.join("\n")
                            : proj.bulletPointsRaw || "",
                    })),
                    skillsRaw: Array.isArray(data.skills)
                        ? data.skills.join("\n")
                        : data.skillsRaw || "",
                    achievementsRaw: Array.isArray(data.achievements)
                        ? data.achievements.join("\n")
                        : data.achievementsRaw || "",
                    customSections: loadedCustomSections,
                    sectionOrder: data.sectionOrder || ["summary", "experience", "education", "skills", "projects", "achievements"]
                });
            }
        } catch (err) {
            showToast("Failed to load saved resume details", "error");
        } finally {
            setLoadingResume(false);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ADD & REMOVE CUSTOM SECTIONS
    const handleAddCustomSection = () => {
        if (!customTitle.trim()) return;

        const sectionKey = `custom_${Date.now()}`;
        const newTab = {
            id: sectionKey,
            label: customTitle.trim(),
            icon: Star,
            isCustom: true,
        };

        const updatedCustom = [
            ...customSections,
            { id: sectionKey, title: customTitle.trim(), contentRaw: "" }
        ];

        setValue("customSections", updatedCustom);
        setValue("sectionOrder", [...sectionOrder, customTitle.trim().toLowerCase()]);

        setTabs((prev) => [...prev, newTab]);
        setActiveTab(tabs.length);
        setCustomTitle("");
        setShowCustomModal(false);
        showToast(`Added "${customTitle}" section!`);
    };

    const handleRemoveCustomSection = (idToRemove, labelToRemove, e) => {
        e.stopPropagation();
        if (!window.confirm(`Remove section "${labelToRemove}"?`)) return;

        const updatedTabs = tabs.filter((t) => t.id !== idToRemove);
        setTabs(updatedTabs);

        const updatedCustom = customSections.filter((c) => c.id !== idToRemove);
        setValue("customSections", updatedCustom);

        const updatedOrder = sectionOrder.filter(
            (item) => item !== labelToRemove.toLowerCase()
        );
        setValue("sectionOrder", updatedOrder);

        if (activeTab >= updatedTabs.length) {
            setActiveTab(Math.max(0, updatedTabs.length - 1));
        }
    };

    // PAYLOAD BUILDER
    const buildPayload = () => {
        const values = getValues();
        const pInfo = values.personalInfo || {};
        return {
            title: pInfo.fullName ? `${pInfo.fullName}'s Resume` : "My Resume",
            personalInfo: {
                fullName: pInfo.fullName || "",
                email: pInfo.email || "",
                phone: pInfo.phone || "",
                address: pInfo.address || "",
                linkedin: pInfo.linkedin || "",
                portfolio: pInfo.portfolio || "",
                summary: pInfo.summary || ""
            },
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

    // RENDER CURRENT TAB FORM
    const renderTab = () => {
        const currentTab = tabs[activeTab];
        if (!currentTab) return null;

        if (currentTab.isCustom) {
            const customIdx = customSections.findIndex((c) => c.id === currentTab.id);
            return (
                <div className="space-y-4">
                    <p className="text-xs text-gray-500">
                        Add details line-by-line (each new line will appear as a separate bullet point).
                    </p>
                    <textarea
                        {...register(`customSections.${customIdx}.contentRaw`)}
                        rows={8}
                        placeholder={`• Certified AWS Developer\n• Spoken English & Hindi\n• Open Source Contributor`}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all text-xs text-gray-800"
                    />
                </div>
            );
        }

        switch (currentTab.id) {
            case "personalInfo": return <PersonalInfoForm register={register} />;
            case "education": return <EducationForm control={control} register={register} />;
            case "experience": return <ExperienceForm control={control} register={register} />;
            case "projects": return <ProjectsForm control={control} register={register} />;
            case "skills": return <SkillsForm register={register} />;
            case "achievements": return <AchievementsForm register={register} />;
            default: return null;
        }
    };

    if (loadingResume) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-red-200 border-t-[#DC2626] rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-semibold text-xs">Loading resume...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
            className="h-[calc(100vh-64px)] w-full bg-[#f8fafc] flex flex-col overflow-hidden text-slate-800"
        >

            {/* Toast Alert */}
            {toast && (
                <div
                    className={`fixed top-16 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-medium text-xs transition-all ${
                        toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
                    }`}
                >
                    {toast.message}
                </div>
            )}

            {/* MAIN 3-COLUMN WORKSPACE */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                {/* 1️⃣ LEFT SIDEBAR: Navigation Tabs & Section Order */}
                <div className="w-full lg:w-[260px] xl:w-[280px] bg-white border-r border-slate-200/80 flex flex-col h-full overflow-y-auto p-4 custom-scrollbar">

                    {/* Header */}
                    <div className="mb-5">
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Build Resume</h1>
                        <p className="text-xs text-slate-500">Complete your profile</p>

                        {/* Progress Bar */}
                        <div className="mt-3">
                            <div className="flex justify-between text-xs font-semibold mb-1">
                                <span className="text-red-600">72% Completed</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-red-600 h-full w-[72%] transition-all duration-500"></div>
                            </div>
                        </div>
                    </div>

                    {/* Nav Steps List */}
                    <div className="space-y-1 mb-6">
                        {tabs.map((tab, idx) => {
                            const IconComponent = tab.icon;
                            const isActive = activeTab === idx;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(idx)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                                        isActive
                                            ? "bg-red-600 text-white shadow-md shadow-red-600/20 font-semibold"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                            isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                                        }`}>
                                            {idx + 1}
                                        </div>
                                        <IconComponent className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </div>

                                    {tab.isCustom && (
                                        <span
                                            onClick={(e) => handleRemoveCustomSection(tab.id, tab.label, e)}
                                            className="text-slate-400 hover:text-white p-0.5 rounded"
                                            title="Delete section"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        {/* Add Custom Section Trigger */}
                        {!showCustomModal ? (
                            <button
                                onClick={() => setShowCustomModal(true)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 font-medium transition-all cursor-pointer mt-1"
                            >
                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                    <Plus className="w-3 h-3 text-red-600" />
                                </div>
                                <span>Custom Sections</span>
                            </button>
                        ) : (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2 space-y-2">
                                <input
                                    type="text"
                                    placeholder="Section Title..."
                                    value={customTitle}
                                    onChange={(e) => setCustomTitle(e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-600"
                                />
                                <div className="flex gap-1">
                                    <button
                                        onClick={handleAddCustomSection}
                                        className="flex-1 bg-red-600 text-white py-1 rounded-lg text-xs font-semibold"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setShowCustomModal(false)}
                                        className="bg-slate-200 text-slate-700 px-2 py-1 rounded-lg text-xs"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Drag & Drop Reorder List */}
                    <div className="border-t border-slate-100 pt-4 mt-auto">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Resume Order
                        </h3>
                        <p className="text-[11px] text-slate-400 mb-2">Drag to reorder sections</p>
                        <div className="space-y-1.5">
                            {sectionOrder.map((sec, idx) => (
                                <div
                                    key={`${sec}_${idx}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium cursor-grab active:cursor-grabbing hover:border-red-400 transition-all"
                                >
                                    <GripVertical className="w-3 h-3 text-slate-400" />
                                    <span className="capitalize">{sec === "skills" ? "Technical Skills" : sec}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* 2️⃣ CENTER FORM SECTION: Spacious Input Form Container */}
                <div className="flex-1 h-full overflow-y-auto p-6 md:p-8 bg-white border-r border-slate-200/80 custom-scrollbar">
                    <div className="max-w-2xl mx-auto space-y-6">

                        {/* Form Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {tabs[activeTab]?.label}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Add your details to populate your resume preview.
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                                {tabs[activeTab]?.icon && <User className="w-4 h-4" />}
                            </div>
                        </div>

                        {/* Dynamic Active Tab Form Content */}
                        <div className="min-h-[400px]">
                            {renderTab()}
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                disabled={activeTab === 0}
                                onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
                                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    {saving ? "Saving..." : "Save Draft"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab((prev) => Math.min(tabs.length - 1, prev + 1))}
                                    className="flex items-center gap-1.5 px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 shadow-md shadow-red-600/20 cursor-pointer"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3️⃣ RIGHT PREVIEW SECTION: Resume Sheet with Zoom Controls */}
                <div className="w-full lg:w-[42%] xl:w-[45%] h-full overflow-y-auto bg-slate-100 p-6 flex flex-col items-center custom-scrollbar">

                    {/* Top Preview Toolbar */}
                    <div className="w-full max-w-[750px] flex items-center justify-between mb-4 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-sm">
                        <span className="text-xs font-bold text-slate-700">Resume Preview</span>

                        {/* Zoom Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setZoomLevel((prev) => Math.max(60, prev - 10))}
                                className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 text-xs font-bold hover:bg-slate-200"
                            >
                                -
                            </button>
                            <span className="text-xs font-semibold text-slate-600 w-10 text-center">
                                {zoomLevel}%
                            </span>
                            <button
                                onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
                                className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 text-xs font-bold hover:bg-slate-200"
                            >
                                +
                            </button>
                            <button
                                onClick={() => setZoomLevel(100)}
                                className="text-xs font-medium text-slate-500 hover:text-slate-800 ml-2"
                            >
                                Fit Width
                            </button>
                        </div>
                    </div>

                    {/* Zoomed Resume Sheet Frame */}
                    <div className="w-full flex justify-center items-start">
                        <div
                            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                            className="transition-transform duration-200 ease-out"
                        >
                            <ResumePreview data={liveData} />
                        </div>
                    </div>

                    {/* Floating Action Buttons */}
                    <div className="w-full max-w-[750px] flex gap-3 mt-6 pt-4 border-t border-slate-200">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="flex-1 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                            <LayoutTemplate className="w-4 h-4" /> Templates
                        </button>

                        <button
                            onClick={handleDownload}
                            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-600/20"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}