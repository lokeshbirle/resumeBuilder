import DynamicListField from "./DynamicListField";

export default function ProjectsForm({ control, register }) {
    return (
        <DynamicListField
            control={control}
            register={register}
            name="projects"
            label="Project"
            emptyItem={{ title: "", techStack: "", bulletPointsRaw: "" }}
            renderFields={(register, index) => (
                <div className="space-y-3">
                    <input {...register(`projects.${index}.title`)} placeholder="Project Title"
                           className="w-full border rounded-md px-3 py-2" />
                    <input {...register(`projects.${index}.techStackRaw`)} placeholder="Tech Stack (comma separated)"
                           className="w-full border rounded-md px-3 py-2" />
                    <textarea
                        {...register(`projects.${index}.bulletPointsRaw`)}
                        placeholder="One bullet point per line..."
                        rows={4}
                        className="w-full border rounded-md px-3 py-2"
                    />
                </div>
            )}
        />
    );
}