"use client";

import { useEffect, useState } from "react";

export default function TrackingPage({
  params,
}: {
  params: { trackingNumber: string };
}) {
  const { trackingNumber } = params;
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrackingDetails() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch current location
        const locationResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracking/gettrackingbyid?trackingNumber=${trackingNumber}`
        );
        if (!locationResponse.ok)
          throw new Error("Failed to fetch current location");
        const data = await locationResponse.json();
        console.log(data);
        setCurrentLocation(data.current_location);
        setEstimatedArrival(data.estimated_arrival_date);

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setIsLoading(false);
      }
    }

    fetchTrackingDetails();
  }, [trackingNumber]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-600 text-center">
        <p className="text-lg">Loading tracking information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-red-500 text-center">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Tracking Details</h1>
        <p className="text-lg font-semibold">
          Tracking Number: <span className="font-normal">{trackingNumber}</span>
        </p>

        <div className="my-6">
          <p className="text-lg font-semibold">
            Current Location:{" "}
            <span className="font-normal">{currentLocation || "N/A"}</span>
          </p>
          <p className="text-lg font-semibold">
            Estimated Arrival:{" "}
            <span className="font-normal">{estimatedArrival || "N/A"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
