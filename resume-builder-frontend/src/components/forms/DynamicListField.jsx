import { useFieldArray } from "react-hook-form";

export default function DynamicListField({ control, register, name, emptyItem, renderFields, label }) {
    const { fields, append, remove } = useFieldArray({ control, name });

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="bg-gradient-to-br from-gray-50 to-indigo-50/40 border border-gray-200 rounded-xl p-5 relative hover:shadow-md transition"
                >
                    {renderFields(register, index)}
                    <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-3 right-3 text-red-500 hover:text-white hover:bg-red-500 text-xs font-medium px-2.5 py-1 rounded-full transition border border-red-200"
                    >
                        ✕ Remove
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={() => append(emptyItem)}
                className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50 transition font-medium"
            >
                + Add {label}
            </button>
        </div>
    );
}