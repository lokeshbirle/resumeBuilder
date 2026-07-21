import DynamicListField from "./DynamicListField";

export default function EducationForm({ control, register }) {
    return (
        <DynamicListField
            control={control}
            register={register}
            name="education"
            label="Education"
            emptyItem={{ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", gradeOrCgpa: "" }}
            renderFields={(register, index) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input {...register(`education.${index}.institution`)} placeholder="Institution Name"
                           className="border rounded-md px-3 py-2 md:col-span-2" />
                    <input {...register(`education.${index}.degree`)} placeholder="Degree"
                           className="border rounded-md px-3 py-2" />
                    <input {...register(`education.${index}.fieldOfStudy`)} placeholder="Field of Study"
                           className="border rounded-md px-3 py-2" />
                    <input {...register(`education.${index}.startDate`)} placeholder="Start Year"
                           className="border rounded-md px-3 py-2" />
                    <input {...register(`education.${index}.endDate`)} placeholder="End Year"
                           className="border rounded-md px-3 py-2" />
                    <input {...register(`education.${index}.gradeOrCgpa`)} placeholder="CGPA / Grade"
                           className="border rounded-md px-3 py-2 md:col-span-2" />
                </div>
            )}
        />
    );
}