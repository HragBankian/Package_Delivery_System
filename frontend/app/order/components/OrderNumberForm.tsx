'use client';

import { useState } from "react";

interface OrderNumberFormProps {
    onUnlock: () => void;
}

export default function OrderNumberForm({ onUnlock }: OrderNumberFormProps) {
    const [orderNumber, setOrderNumber] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderNumber.trim() !== "") {
            onUnlock();
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Enter Order Number</h2>
                <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Order Number"
                    className="w-full p-3 border rounded-lg"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Unlock Payment Form
                </button>
            </form>
        </div>
    );
}
