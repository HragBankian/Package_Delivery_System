"use client";

import { useOrderFormContext } from "@/components/multistep-form-context";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const formContext = useOrderFormContext();
  const router = useRouter();

  // Retrieve order data from the context
  const { order } = formContext;

  if (!order) {
    router.push("/order/continue"); // Redirect to continue order if no order exists
    return <div>Redirecting...</div>;
  }

  return (
    <div className="flex flex-col grow items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-omnivoxorange mb-4">
          Thank You!
        </h1>
        <p className="text-lg mb-6">
          Your order has been placed successfully. Here are your order details:
        </p>
        <p className="text-lg font-semibold">
          Order Number:{" "}
          <span className="font-normal">{order.orderNumber || "N/A"}</span>
        </p>
        <p className="text-lg font-semibold">
          Tracking Number:{" "}
          <span className="font-normal">{order.trackingNumber || "N/A"}</span>
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-omnivoxblue text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push(`/tracking/${order.trackingNumber}`)}
            className="px-6 py-2 bg-omnivoxorange text-white font-bold rounded-md hover:bg-orange focus:outline-none focus:ring focus:ring-green-300"
          >
            Track My Package
          </button>
        </div>
      </div>
    </div>
  );
}
