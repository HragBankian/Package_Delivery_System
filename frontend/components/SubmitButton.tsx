export default function SubmitButton({ label }: { label: string }) {
    return (
        <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
            {label}
        </button>
    );
}
