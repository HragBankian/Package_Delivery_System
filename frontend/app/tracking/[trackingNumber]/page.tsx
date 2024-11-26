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
  const [trackingHistory, setTrackingHistory] = useState<
      { location: string; timestamp: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrackingDetails() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch current location and estimated arrival
        const locationResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracking/gettrackingbyid?trackingNumber=${trackingNumber}`
        );
        if (!locationResponse.ok) throw new Error("Tracking number not found!");
        const trackingData = await locationResponse.json();

        const { current_location, estimated_arrival_date } = trackingData;
        setCurrentLocation(current_location);
        setEstimatedArrival(estimated_arrival_date);

        // Fetch tracking history
        const historyResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/trackinghistory/getTrackingHistoryByTrackingNumber?trackingNumber=${trackingNumber}`
        );
        if (!historyResponse.ok) throw new Error("Tracking history not found!");

        const historyData = await historyResponse.json();
        console.log("Tracking History API Response:", historyData);


        // Remove the last history entry if it matches the current location
        const filteredHistory = historyData.filter(
            (entry: { location: string }) => entry.location !== current_location
        );
        console.log("Filtered Tracking History:", filteredHistory);


        setTrackingHistory(filteredHistory);

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 homepage-bg">
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

          {/* Tracking History */}
          <h2 className="text-xl font-bold mt-6">Tracking History</h2>
          <div className="mt-4 flex flex-col items-center">
            {trackingHistory && trackingHistory.length > 0 ? (
                <ul className="list-none text-center">
                  {trackingHistory.map((location, index) => (
                      <li key={index} className="mb-2">
                        <span className="font-normal">{location}</span>
                      </li>
                  ))}
                </ul>
            ) : (
                <p>No tracking history available.</p>
            )}
          </div>


        </div>
      </div>
  );
}
