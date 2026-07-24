export default function PersonalInfoForm({ register }) {
    // Basic Details (Headline & Address completely removed)
    const basicFields = [
        { name: "personalInfo.fullName", label: "Full Name", placeholder: "Name" },
        { name: "personalInfo.email", label: "Email", placeholder: "..@gmail.com" },
        { name: "personalInfo.phone", label: "Phone", placeholder: "+91 00000-00000" },
    ];

    // Social Links Configuration
    const socialFields = [
        {
            title: "LinkedIn Profile",
            labelName: "personalInfo.linkedinLabel",
            labelPlaceholder: "linkedin.com/in/username",
            urlName: "personalInfo.linkedinUrl",
            urlPlaceholder: "https://linkedin.com/in/username"
        },
        {
            title: "GitHub Profile",
            labelName: "personalInfo.githubLabel",
            labelPlaceholder: "github.com/username",
            urlName: "personalInfo.githubUrl",
            urlPlaceholder: "https://github.com/username"
        },
        {
            title: "Portfolio / LeetCode / Other Link",
            labelName: "personalInfo.portfolioLabel",
            labelPlaceholder: "portfolio.com/username",
            urlName: "personalInfo.portfolioUrl",
            urlPlaceholder: "https://portfolio.com/username"
        },
    ];

    return (
        <div className="space-y-5">
            {/* 1. Basic Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {basicFields.map((f) => (
                    <div key={f.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                        <input
                            {...register(f.name)}
                            placeholder={f.placeholder}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all"
                        />
                    </div>
                ))}
            </div>

            {/* 2. Social Links Section */}
            <div className="border-t border-gray-200 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Social Links & Portfolios</h4>

                {socialFields.map((s, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                        <label className="block text-xs font-semibold text-gray-800">{s.title}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <span className="block text-[11px] text-gray-500 mb-1">Resume Display Text</span>
                                <input
                                    {...register(s.labelName)}
                                    placeholder={s.labelPlaceholder}
                                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <span className="block text-[11px] text-gray-500 mb-1">Clickable URL (Link)</span>
                                <input
                                    type="url"
                                    {...register(s.urlName)}
                                    placeholder={s.urlPlaceholder}
                                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Professional Summary */}
            <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                <textarea
                    {...register("personalInfo.summary")}
                    rows={4}
                    placeholder="Write a brief professional summary highlighting your experience..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all resize-y"
                />
            </div>
        </div>
    );
}