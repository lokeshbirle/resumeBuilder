export default function PersonalInfoForm({ register }) {
    const fields = [
        { name: "personalInfo.fullName", label: "Full Name", placeholder: "Lokesh Birle" },
        { name: "personalInfo.email", label: "Email", placeholder: "you@example.com" },
        { name: "personalInfo.phone", label: "Phone", placeholder: "+91-XXXXXXXXXX" },
        { name: "personalInfo.address", label: "Address / City", placeholder: "Bangalore, India" },
        { name: "personalInfo.linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username" },
        { name: "personalInfo.github", label: "GitHub", placeholder: "github.com/username" },
        { name: "personalInfo.portfolio", label: "Portfolio / LeetCode etc.", placeholder: "" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
                <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                        {...register(f.name)}
                        placeholder={f.placeholder}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
            ))}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                <textarea
                    {...register("personalInfo.summary")}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
            </div>
        </div>
    );
}