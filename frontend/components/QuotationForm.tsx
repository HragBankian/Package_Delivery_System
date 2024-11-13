'use client';

import { useState } from "react";
import FormInput from "./FormInput";
import SelectInput from "./SelectInput";
import SubmitButton from "./SubmitButton";

export default function QuotationForm() {
    const [formData, setFormData] = useState({
        weight: "",
        dimensions: "",
        destination: "",
        speed: "Standard",
    });
    const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateCost = () => {
        const { weight, speed } = formData;
        let cost = parseFloat(weight) * 2;
        if (speed === "Express") cost *= 1.5;
        return cost.toFixed(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cost = calculateCost();
        setEstimatedCost(parseFloat(cost));
    };

    return (
        <div className="mt-20 p-8 bg-white rounded shadow-lg max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Package Weight (kg)"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                />
                <FormInput
                    label="Dimensions (L x W x H cm)"
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                />
                <FormInput
                    label="Destination"
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                />
                <SelectInput
                    label="Delivery Speed"
                    name="speed"
                    options={["Standard", "Express"]}
                    value={formData.speed}
                    onChange={handleChange}
                />
                <SubmitButton label="Get Quotation" />
                {estimatedCost !== null && (
                    <p className="mt-4 text-green-600">Estimated Cost: ${estimatedCost}</p>
                )}
            </form>
        </div>
    );
}
