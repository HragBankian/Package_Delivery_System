'use client';

import { useState } from "react";
import FormInput from "./FormInput";
import SelectInput from "./SelectInput";

export default function QuotationForm() {
    const [formData, setFormData] = useState({
        weight: "",
        dimensions: "",
        destination: "",
        speed: "Standard",
    });
    const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

    const calculateCost = (weight: string, speed: string) => {
        if (!weight) return null; // If no weight is provided, return null
        let cost = parseFloat(weight) * 2; // Base cost calculation
        if (speed === "Express") cost *= 1.5; // Adjust cost for Express speed
        return parseFloat(cost.toFixed(2)); // Return rounded cost
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        // Update estimated cost dynamically
        const updatedCost = calculateCost(updatedFormData.weight, updatedFormData.speed);
        setEstimatedCost(updatedCost);
    };

    return (
        <div className="mt-20 p-8 bg-white rounded shadow-lg max-w-3xl mx-auto">
            <form>
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
                {estimatedCost !== null && (
                    <p className="mt-4 text-green-600">Estimated Cost: ${estimatedCost}</p>
                )}
            </form>
        </div>
    );
}
