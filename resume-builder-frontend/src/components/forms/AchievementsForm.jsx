import React from "react";

export default function AchievementsForm({ register }) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
                Key Achievements & Certifications (One item per line)
            </label>
            <p className="text-[11px] text-slate-500">
                Har line par ek achievement likhein (har enter/new line par resume me bullet point banega):
            </p>
            <textarea
                {...register("achievementsRaw")}
                rows={8}
                placeholder={`• Secured 1st Rank in Smart India Hackathon 2024\n• Certified AWS Cloud Practitioner\n• Published research paper on Machine Learning in IEEE`}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all"
            />
        </div>
    );
}