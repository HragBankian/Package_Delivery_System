"use client";
import { useState } from 'react';

const TrackingPage = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingStatus, setTrackingStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Simulated function to check package status (replace with API call if needed)
    const handleTrackPackage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber) return;

        setLoading(true);
        setTrackingStatus(null);

        // Simulate an API request delay
        setTimeout(() => {
            // For demonstration purposes, we are just displaying a dummy status
            const status = `Package with tracking number ${trackingNumber} is currently in transit.`;
            setTrackingStatus(status);
            setLoading(false);
        }, 1000);
    };

    return (

        <main
            className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8 homepage-bg">
            <div className="opaque-box">
                <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>

                <form onSubmit={handleTrackPackage} className="w-full max-w-md">
                    <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter order number"
                        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Track Package
                    </button>
                </form>

                {loading && <p className="mt-4 text-lg">Checking status...</p>}

                {trackingStatus && (
                    <div className="mt-6 p-4 bg-gray-100 border rounded-lg text-foreground">
                        {trackingStatus}
                    </div>
                )}
            </div>
        </main>

    );
};

export default TrackingPage;
