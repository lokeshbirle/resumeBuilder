import DynamicListField from "./DynamicListField";

export default function ExperienceForm({ control, register }) {
    return (
        <DynamicListField
            control={control}
            register={register}
            name="experience"
            label="Experience"
            emptyItem={{ company: "", role: "", startDate: "", endDate: "", currentlyWorking: false, bulletPoints: [] }}
            renderFields={(register, index) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input {...register(`experience.${index}.company`)} placeholder="Company Name"
                           className="border rounded-md px-3 py-2" />
                    <input {...register(`experience.${index}.role`)} placeholder="Role / Designation"
                           className="border rounded-md px-3 py-2" />
                    <input {...register(`experience.${index}.startDate`)} placeholder="Start Date (e.g. Jan 2025)"
                           className="border rounded-md px-3 py-2" />
                    <input {...register(`experience.${index}.endDate`)} placeholder="End Date"
                           className="border rounded-md px-3 py-2" />
                    <label className="flex items-center gap-2 md:col-span-2 text-sm">
                        <input type="checkbox" {...register(`experience.${index}.currentlyWorking`)} />
                        Currently working here
                    </label>
                    <textarea
                        {...register(`experience.${index}.bulletPointsRaw`)}
                        placeholder="One bullet point per line..."
                        rows={4}
                        className="md:col-span-2 border rounded-md px-3 py-2"
                    />
                </div>
            )}
        />
    );
}