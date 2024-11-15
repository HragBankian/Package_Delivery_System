"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  const handleTrackPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber) return;

    // Redirect to the dynamic tracking page
    router.push(`/track/${trackingNumber}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8 homepage-bg">
      <div className="opaque-box">
        <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>

        <form onSubmit={handleTrackPackage} className="w-full max-w-md">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Track Package
          </button>
        </form>
      </div>
    </main>
  );
};

export default TrackingPage;
