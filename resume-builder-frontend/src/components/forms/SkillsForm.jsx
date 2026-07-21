// SkillsForm.jsx
export default function SkillsForm({ register }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (one category per line, e.g. "Languages: Java, C++, Python")
            </label>
            <textarea
                {...register("skillsRaw")}
                rows={5}
                placeholder="Languages/Core: Java, C, C++, DSA&#10;Frameworks: Spring Boot, REST APIs"
                className="w-full border rounded-md px-3 py-2"
            />
        </div>
    );
}