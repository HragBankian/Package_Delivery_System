type FormInputProps = {
    label: string;
    type: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FormInput({ label, type, name, value, onChange }: FormInputProps) {
    return (
        <div className="mb-4">
            <label className="block font-bold mb-2">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="border p-2 rounded w-full"
                required
            />
        </div>
    );
}
