import React from "react";

export default function ResumePreview({ data = {} }) {
    const {
        personalInfo = {},
        education = [],
        experience = [],
        projects = [],
        skillsRaw = "",
        achievementsRaw = "",
        customSections = [],
        sectionOrder = ["summary", "experience", "projects", "skills", "education", "achievements"]
    } = data;

    // Helper to build safe HTTP/HTTPS link URLs
    const formatUrl = (url) => {
        if (!url) return "#";
        return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    };

    // Summary handling
    const summaryText = data.summary || personalInfo.summary || "";

    const skillLines = (skillsRaw || "").split("\n").filter(Boolean);
    const achievementLines = (achievementsRaw || "").split("\n").filter(Boolean);

    // Bullet points helper
    const getBulletPoints = (item) => {
        if (item.bulletPointsRaw) return item.bulletPointsRaw.split("\n").filter(Boolean);
        if (Array.isArray(item.bulletPoints)) return item.bulletPoints;
        if (typeof item.bulletPoints === "string") return item.bulletPoints.split("\n").filter(Boolean);
        if (Array.isArray(item.points)) return item.points;
        if (typeof item.description === "string") return item.description.split("\n").filter(Boolean);
        return [];
    };

    const renderSection = (sectionName) => {
        const secKey = (sectionName || "").toLowerCase().trim();

        // Safe Summary check
        if (secKey.includes("summary")) {
            if (!summaryText.trim()) return null;
            return (
                <div key="summary" className="mb-3 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <SectionHeading title="Professional Summary" />
                    <p className="text-[10pt] leading-[1.3] text-gray-900 text-justify whitespace-pre-line">
                        {summaryText}
                    </p>
                </div>
            );
        }

        switch (secKey) {
            case "experience":
            case "work experience":
            case "professional experience":
                if (experience.length === 0) return null;
                return (
                    <div key="experience" className="mb-3">
                        <SectionHeading title="Professional Experience" />
                        {experience.map((exp, i) => {
                            const bullets = getBulletPoints(exp);
                            return (
                                <div key={i} className="mb-2.5 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                                    <div className="flex justify-between items-baseline font-bold text-[10.5pt] text-gray-900">
                                        <span>{exp.company}</span>

                                        {/* 👇 DYNAMIC LOCATION (NO HARDCODED VALUE) */}
                                        <span className="font-normal text-[9.5pt] text-gray-800">
                                            {exp.location || ""}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-baseline italic text-[9.5pt] text-gray-800 -mt-0.5 mb-1">
                                        <span>{exp.role || exp.position}</span>
                                        <span>
                                            {exp.startDate} {exp.startDate && "–"} {exp.currentlyWorking ? "Present" : exp.endDate}
                                        </span>
                                    </div>
                                    {bullets.length > 0 && (
                                        <ul className="list-disc ml-5 text-[9.5pt] leading-[1.35] text-gray-900 space-y-0.5">
                                            {bullets.map((bp, j) => (
                                                <li key={j} className="pl-0.5">{bp}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );

            case "projects":
            case "personal projects":
                if (projects.length === 0) return null;
                return (
                    <div key="projects" className="mb-3">
                        <SectionHeading title="Projects" />
                        {projects.map((proj, i) => {
                            const bullets = getBulletPoints(proj);
                            return (
                                <div key={i} className="mb-2.5 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                                    <div className="flex justify-between items-baseline font-bold text-[10.5pt] text-gray-900">
                                        <span>
                                            {proj.title}
                                            {proj.techStackRaw && (
                                                <span className="font-normal italic text-[9.5pt]"> | {proj.techStackRaw}</span>
                                            )}
                                        </span>
                                    </div>
                                    {bullets.length > 0 && (
                                        <ul className="list-disc ml-5 text-[9.5pt] leading-[1.35] text-gray-900 space-y-0.5 mt-0.5">
                                            {bullets.map((bp, j) => (
                                                <li key={j} className="pl-0.5">{bp}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );

            case "skills":
            case "technical skills":
                if (skillLines.length === 0) return null;
                return (
                    <div key="skills" className="mb-3 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                        <SectionHeading title="Technical Skills" />
                        <div className="text-[9.5pt] leading-[1.35] text-gray-900">
                            {skillLines.map((line, i) => {
                                const parts = line.split(":");
                                if (parts.length > 1) {
                                    return (
                                        <p key={i} className="mb-0.5">
                                            <span className="font-bold">{parts[0].trim()}:</span> {parts.slice(1).join(":").trim()}
                                        </p>
                                    );
                                }
                                return <p key={i} className="mb-0.5">{line}</p>;
                            })}
                        </div>
                    </div>
                );

            case "education":
                if (education.length === 0) return null;
                return (
                    <div key="education" className="mb-3 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                        <SectionHeading title="Education" />
                        {education.map((edu, i) => (
                            <div key={i} className="mb-1.5">
                                <div className="flex justify-between items-baseline font-bold text-[10.5pt] text-gray-900">
                                    <span>{edu.institution}</span>

                                    {/* 👇 DYNAMIC LOCATION (NO HARDCODED VALUE) */}
                                    <span className="font-normal text-[9.5pt] text-gray-800">
                                        {edu.location || ""}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline italic text-[9.5pt] text-gray-800 -mt-0.5">
                                    <span>
                                        {edu.degree}{edu.fieldOfStudy ? ` (${edu.fieldOfStudy})` : ""}
                                        {edu.gradeOrCgpa ? ` – ${edu.gradeOrCgpa}` : ""}
                                    </span>
                                    <span>
                                        {edu.startDate} {edu.startDate && "–"} {edu.endDate}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case "achievements":
                if (achievementLines.length === 0) return null;
                return (
                    <div key="achievements" className="mb-3 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                        <SectionHeading title="Achievements" />
                        <ul className="list-disc ml-5 text-[9.5pt] leading-[1.35] text-gray-900 space-y-0.5">
                            {achievementLines.map((a, i) => (
                                <li key={i} className="pl-0.5">{a}</li>
                            ))}
                        </ul>
                    </div>
                );

            default: {
                const customSec = customSections.find(
                    (cs) => cs.id === sectionName || (cs.title && cs.title.trim().toLowerCase() === secKey)
                );

                if (!customSec) return null;

                const items = Array.isArray(customSec.items) && customSec.items.length > 0
                    ? customSec.items
                    : (customSec.contentRaw || "").split("\n").filter(Boolean);

                if (items.length === 0) return null;

                return (
                    <div key={customSec.id || customSec.title || secKey} className="mb-3 break-inside-avoid" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                        <SectionHeading title={customSec.title} />
                        <ul className="list-disc ml-5 text-[9.5pt] leading-[1.35] text-gray-900 space-y-0.5">
                            {items.map((item, idx) => (
                                <li key={idx} className="pl-0.5">{item}</li>
                            ))}
                        </ul>
                    </div>
                );
            }
        }
    };

    // Header Links list with Clickable HTML <a> tags
    const linksList = [
        personalInfo.phone && { isLink: false, text: personalInfo.phone },
        personalInfo.email && { isLink: false, text: personalInfo.email },
        (personalInfo.linkedinUrl || personalInfo.linkedinLabel || personalInfo.linkedin) && {
            isLink: true,
            text: personalInfo.linkedinLabel || personalInfo.linkedin || "LinkedIn",
            url: formatUrl(personalInfo.linkedinUrl || personalInfo.linkedin)
        },
        (personalInfo.githubUrl || personalInfo.githubLabel || personalInfo.github) && {
            isLink: true,
            text: personalInfo.githubLabel || personalInfo.github || "GitHub",
            url: formatUrl(personalInfo.githubUrl || personalInfo.github)
        },
        (personalInfo.portfolioUrl || personalInfo.portfolioLabel || personalInfo.portfolio) && {
            isLink: true,
            text: personalInfo.portfolioLabel || personalInfo.portfolio || "Portfolio",
            url: formatUrl(personalInfo.portfolioUrl || personalInfo.portfolio)
        }
    ].filter(Boolean);

    return (
        <>
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 12mm 15mm;
                    }
                    body {
                        background: white !important;
                    }
                }
            `}</style>

            <div
                className="bg-white p-10 text-gray-900 shadow-xl border border-gray-200 h-auto"
                style={{
                    fontFamily: "'Times New Roman', Times, 'Computer Modern', serif",
                    minHeight: "297mm",
                    width: "210mm",
                    boxSizing: "border-box"
                }}
            >
                {/* Header Section */}
                <div className="text-center mb-4">
                    <h1 className="text-[22pt] font-normal tracking-normal text-gray-900 mb-1">
                        {personalInfo.fullName || "Your Name"}
                    </h1>

                    <div className="text-[9.5pt] text-gray-800 flex justify-center items-center flex-wrap gap-x-2">
                        {linksList.map((item, idx) => (
                            <React.Fragment key={idx}>
                                {item.isLink ? (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-700 hover:underline hover:text-blue-900"
                                    >
                                        {item.text}
                                    </a>
                                ) : (
                                    <span>{item.text}</span>
                                )}
                                {idx < linksList.length - 1 && <span className="text-gray-400">|</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Dynamic Ordered Sections */}
                {sectionOrder.map((section) => renderSection(section))}
            </div>
        </>
    );
}

function SectionHeading({ title }) {
    return (
        <div className="mb-1.5 mt-3 break-after-avoid" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            <h2 className="text-[12pt] font-bold text-gray-900 border-b border-black pb-0.5 mb-1.5 tracking-tight">
                {title}
            </h2>
        </div>
    );
}