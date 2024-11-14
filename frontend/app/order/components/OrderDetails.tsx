'use client';

import { useOrderFormContext } from "@/components/multistep-form-context";

interface OrderDetailsProps {
    onGenerateQuotation: () => void;
}

export default function OrderDetails({ onGenerateQuotation }: OrderDetailsProps) {
    const { order } = useOrderFormContext();

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-bold text-center mb-6">Order Details</h2>

            {/* Display Order Locations */}
            <div className="space-y-4 mb-6">
                <div>
                    <h3 className="font-semibold">Pickup Location:</h3>
                    <p>{order?.originLocation || "Not provided"}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Dropoff Location:</h3>
                    <p>{order?.destinationLocation || "Not provided"}</p>
                </div>
            </div>

            {/* Display Package Details */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Package Details:</h3>
                {order?.packageList?.map((pkg, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                        <h4 className="font-bold text-lg mb-2">Package {index + 1}</h4>
                        <div className="space-y-2">
                            <p><strong>Weight:</strong> {pkg.weight || "N/A"} kg</p>
                            <p><strong>Dimensions:</strong> {pkg.length} x {pkg.width} x {pkg.height} cm</p>
                            <p><strong>Category:</strong> {pkg.category}</p>
                            <p><strong>Fragile:</strong> {pkg.isFragile ? "Yes" : "No"}</p>
                        </div>
                    </div>
                ))}
                {order?.packageList?.length === 0 && (
                    <p>No package details provided.</p>
                )}
            </div>

            {/* Generate Quotation Button */}
            <button
                onClick={onGenerateQuotation}
                className="w-full mt-8 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
                Generate Quotation
            </button>
        </div>
    );
}
