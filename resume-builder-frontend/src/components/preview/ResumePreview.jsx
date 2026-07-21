// export default function ResumePreview({ data }) {
//     const { personalInfo = {}, education = [], experience = [], projects = [], skillsRaw = "", achievementsRaw = "" } = data;
//
//     const skillLines = skillsRaw.split("\n").filter(Boolean);
//     const achievementLines = achievementsRaw.split("\n").filter(Boolean);
//
//     return (
//         <div className="bg-white shadow-lg p-8 font-serif text-sm leading-snug" style={{ minHeight: "297mm", width: "210mm" }}>
//             {/* Header */}
//             <h1 className="text-2xl text-center tracking-wide">{personalInfo.fullName || "Your Name"}</h1>
//             <p className="text-center text-xs mt-1">
//                 {[personalInfo.phone, personalInfo.email, personalInfo.linkedin, personalInfo.portfolio]
//                     .filter(Boolean).join("   |   ")}
//             </p>
//             <hr className="my-2 border-black" />
//
//             {personalInfo.summary && (
//                 <>
//                     <SectionHeading title="Summary" />
//                     <p className="text-xs">{personalInfo.summary}</p>
//                 </>
//             )}
//
//             {experience.length > 0 && (
//                 <>
//                     <SectionHeading title="Experience" />
//                     {experience.map((exp, i) => (
//                         <div key={i} className="mb-2">
//                             <div className="flex justify-between font-bold text-sm">
//                                 <span>{exp.company}</span>
//                                 <span>{exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}</span>
//                             </div>
//                             <p className="italic text-xs">{exp.role}</p>
//                             <ul className="list-disc list-inside text-xs mt-1">
//                                 {(exp.bulletPointsRaw || "").split("\n").filter(Boolean).map((bp, j) => (
//                                     <li key={j}>{bp}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     ))}
//                 </>
//             )}
//
//             {projects.length > 0 && (
//                 <>
//                     <SectionHeading title="Projects" />
//                     {projects.map((proj, i) => (
//                         <div key={i} className="mb-2">
//                             <p className="font-bold text-sm">
//                                 {proj.title}
//                                 {proj.techStackRaw && <span className="italic font-normal text-xs"> | {proj.techStackRaw}</span>}
//                             </p>
//                             <ul className="list-disc list-inside text-xs mt-1">
//                                 {(proj.bulletPointsRaw || "").split("\n").filter(Boolean).map((bp, j) => (
//                                     <li key={j}>{bp}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     ))}
//                 </>
//             )}
//
//             {skillLines.length > 0 && (
//                 <>
//                     <SectionHeading title="Technical Skills" />
//                     {skillLines.map((line, i) => {
//                         const [label, ...rest] = line.split(":");
//                         return (
//                             <p key={i} className="text-xs mb-1">
//                                 <span className="font-bold">{label}:</span>{rest.join(":")}
//                             </p>
//                         );
//                     })}
//                 </>
//             )}
//
//             {education.length > 0 && (
//                 <>
//                     <SectionHeading title="Education" />
//                     {education.map((edu, i) => (
//                         <div key={i} className="mb-2">
//                             <div className="flex justify-between font-bold text-sm">
//                                 <span>{edu.institution}</span>
//                                 <span>{edu.startDate} - {edu.endDate}</span>
//                             </div>
//                             <div className="flex justify-between italic text-xs">
//                                 <span>{edu.degree}{edu.fieldOfStudy && ` - ${edu.fieldOfStudy}`}</span>
//                                 <span>{edu.gradeOrCgpa}</span>
//                             </div>
//                         </div>
//                     ))}
//                 </>
//             )}
//
//             {achievementLines.length > 0 && (
//                 <>
//                     <SectionHeading title="Achievements" />
//                     <ul className="list-disc list-inside text-xs">
//                         {achievementLines.map((a, i) => <li key={i}>{a}</li>)}
//                     </ul>
//                 </>
//             )}
//         </div>
//     );
// }
//
// function SectionHeading({ title }) {
//     return (
//         <div className="flex items-center gap-2 mt-3 mb-1">
//             <span className="font-bold text-sm">{title}</span>
//             <div className="flex-1 border-b border-black"></div>
//         </div>
//     );
// }


export default function ResumePreview({ data }) {
    const {
        personalInfo = {},
        education = [],
        experience = [],
        projects = [],
        skillsRaw = "",
        achievementsRaw = "",
        sectionOrder = ["summary", "experience", "projects", "skills", "education", "achievements"] // fallback
    } = data;

    const skillLines = skillsRaw.split("\n").filter(Boolean);
    const achievementLines = achievementsRaw.split("\n").filter(Boolean);

    // Dynamic Render Mapper for live rendering
    const renderSection = (sectionName) => {
        switch (sectionName.toLowerCase()) {
            case "summary":
                if (!personalInfo.summary) return null;
                return (
                    <div key="summary">
                        <SectionHeading title="Summary" />
                        <p className="text-xs text-justify">{personalInfo.summary}</p>
                    </div>
                );
            case "experience":
                if (experience.length === 0) return null;
                return (
                    <div key="experience">
                        <SectionHeading title="Experience" />
                        {experience.map((exp, i) => (
                            <div key={i} className="mb-2">
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{exp.company}</span>
                                    <span>{exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}</span>
                                </div>
                                <p className="italic text-xs">{exp.role}</p>
                                <ul className="list-disc list-inside text-xs mt-1">
                                    {(exp.bulletPointsRaw || "").split("\n").filter(Boolean).map((bp, j) => (
                                        <li key={j}>{bp}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
            case "projects":
                if (projects.length === 0) return null;
                return (
                    <div key="projects">
                        <SectionHeading title="Projects" />
                        {projects.map((proj, i) => (
                            <div key={i} className="mb-2">
                                <p className="font-bold text-sm">
                                    {proj.title}
                                    {proj.techStackRaw && <span className="italic font-normal text-xs"> | {proj.techStackRaw}</span>}
                                </p>
                                <ul className="list-disc list-inside text-xs mt-1">
                                    {(proj.bulletPointsRaw || "").split("\n").filter(Boolean).map((bp, j) => (
                                        <li key={j}>{bp}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
            case "skills":
                if (skillLines.length === 0) return null;
                return (
                    <div key="skills">
                        <SectionHeading title="Technical Skills" />
                        {skillLines.map((line, i) => {
                            const [label, ...rest] = line.split(":");
                            return (
                                <p key={i} className="text-xs mb-1">
                                    <span className="font-bold">{label}:</span>{rest.join(":")}
                                </p>
                            );
                        })}
                    </div>
                );
            case "education":
                if (education.length === 0) return null;
                return (
                    <div key="education">
                        <SectionHeading title="Education" />
                        {education.map((edu, i) => (
                            <div key={i} className="mb-2">
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{edu.institution}</span>
                                    <span>{edu.startDate} - {edu.endDate}</span>
                                </div>
                                <div className="flex justify-between italic text-xs">
                                    <span>{edu.degree}{edu.fieldOfStudy && ` - ${edu.fieldOfStudy}`}</span>
                                    <span>{edu.gradeOrCgpa}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case "achievements":
                if (achievementLines.length === 0) return null;
                return (
                    <div key="achievements">
                        <SectionHeading title="Achievements" />
                        <ul className="list-disc list-inside text-xs">
                            {achievementLines.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white shadow-lg p-8 font-serif text-sm leading-snug" style={{ minHeight: "297mm", width: "210mm" }}>
            {/* Header (Static) */}
            <h1 className="text-2xl text-center tracking-wide">{personalInfo.fullName || "Your Name"}</h1>
            <p className="text-center text-xs mt-1">
                {[personalInfo.phone, personalInfo.email, personalInfo.linkedin, personalInfo.portfolio]
                    .filter(Boolean).join("   |   ")}
            </p>
            <hr className="my-2 border-black" />

            {/* Dynamic Ordered Sections rendering */}
            {sectionOrder.map((section) => renderSection(section))}
        </div>
    );
}

function SectionHeading({ title }) {
    return (
        <div className="flex items-center gap-2 mt-3 mb-1">
            <span className="font-bold text-sm">{title}</span>
            <div className="flex-1 border-b border-black"></div>
        </div>
    );
}