type SelectInputProps = {
    label: string;
    name: string;
    options: string[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectInput({ label, name, options, value, onChange }: SelectInputProps) {
    return (
        <div className="mb-4">
            <label className="block font-bold mb-2">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="border p-2 rounded w-full"
            >
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}
