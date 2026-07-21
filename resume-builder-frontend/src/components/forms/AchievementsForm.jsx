// AchievementsForm.jsx
export default function AchievementsForm({ register }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Achievements (one per line)
            </label>
            <textarea
                {...register("achievementsRaw")}
                rows={4}
                className="w-full border rounded-md px-3 py-2"
            />
        </div>
    );
}