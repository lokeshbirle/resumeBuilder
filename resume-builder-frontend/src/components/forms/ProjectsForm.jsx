import React from "react";
import DynamicListField from "./DynamicListField";

export default function ProjectsForm({ control, register }) {
    return (
        <DynamicListField
            control={control}
            register={register}
            name="projects"
            label="Project"
            // FIXED: Key name changed from techStack -> techStackRaw to match register name
            emptyItem={{ title: "", techStackRaw: "", bulletPointsRaw: "" }}
            renderFields={(register, index) => (
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Project Title</label>
                        <input
                            {...register(`projects.${index}.title`)}
                            placeholder="e.g. E-Commerce Platform"
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Tech Stack (comma separated)</label>
                        <input
                            {...register(`projects.${index}.techStackRaw`)}
                            placeholder="e.g. React, Node.js, MongoDB"
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Description / Key Achievements</label>
                        <textarea
                            {...register(`projects.${index}.bulletPointsRaw`)}
                            placeholder="• Built high-performance REST APIs&#10;• Reduced load times by 40%"
                            rows={4}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>
                </div>
            )}
        />
    );
}