import DynamicListField from "./DynamicListField";

export default function ExperienceForm({ control, register }) {
    return (
        <DynamicListField
            control={control}
            register={register}
            name="experience"
            label="Experience"
            emptyItem={{ company: "", role: "", location: "", startDate: "", endDate: "", currentlyWorking: false, bulletPointsRaw: "" }}
            renderFields={(register, index) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        {...register(`experience.${index}.company`)}
                        placeholder="Company Name"
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                    <input
                        {...register(`experience.${index}.role`)}
                        placeholder="Role / Designation"
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                    {/* 👇 ADDED LOCATION INPUT FIELD */}
                    <input
                        {...register(`experience.${index}.location`)}
                        placeholder="Location (e.g. Remote / New York, NY)"
                        className="border rounded-md px-3 py-2 text-sm md:col-span-2"
                    />
                    <input
                        {...register(`experience.${index}.startDate`)}
                        placeholder="Start Date (e.g. Jan 2025)"
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                    <input
                        {...register(`experience.${index}.endDate`)}
                        placeholder="End Date (e.g. Present)"
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                    <label className="flex items-center gap-2 md:col-span-2 text-sm text-gray-700">
                        <input type="checkbox" {...register(`experience.${index}.currentlyWorking`)} />
                        Currently working here
                    </label>
                    <textarea
                        {...register(`experience.${index}.bulletPointsRaw`)}
                        placeholder="One bullet point per line..."
                        rows={4}
                        className="md:col-span-2 border rounded-md px-3 py-2 text-sm"
                    />
                </div>
            )}
        />
    );
}