export default function PersonalInfoForm({ register }) {
    // Basic Details
    const basicFields = [
        { name: "personalInfo.fullName", label: "Full Name", placeholder: "Lokesh Birle" },
        { name: "personalInfo.headline", label: "Headline / Title", placeholder: "Quality Assurance Professional" },
        { name: "personalInfo.email", label: "Email", placeholder: "mandloiaanchal@gmail.com" },
        { name: "personalInfo.phone", label: "Phone", placeholder: "+91-9669784588" },
        { name: "personalInfo.address", label: "Address / City", placeholder: "Bangalore, India" },
    ];

    // Clickable Social Links Details (Label + Actual URL)
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
            labelPlaceholder: "leetcode.com/lokeshbirle",
            urlName: "personalInfo.portfolioUrl",
            urlPlaceholder: "https://leetcode.com/lokeshbirle"
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

            {/* 2. Links Section (Display Name & URL Separate Inputs) */}
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
                    placeholder="B.Pharm graduate with experience in pharmaceutical industry..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all resize-y"
                />
            </div>
        </div>
    );
}