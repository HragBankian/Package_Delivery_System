"use client";

import { useOrderFormContext } from "@/components/multistep-form-context";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const formContext = useOrderFormContext();
  const router = useRouter();

  // Retrieve order data from the context
  const { order } = formContext;

  if (
    !formContext.order.originLocation ||
    !formContext.order.destinationLocation
  ) {
    router.push("/order/locations"); // Redirect to start of order form if no order exists
    return <div>Redirecting...</div>;
  }

  return (
    <div className="flex flex-col grow space-y-6 m-2 p-2 rounded-xl border border-3 border-omnivoxorange">
      <h1 className="text-2xl font-bold text-center mb-6">
        Order Confirmation
      </h1>

      {/* Order and Tracking Numbers */}
      <div className="mb-6">
        <p className="text-lg font-semibold">
          Order Number:{" "}
          <span className="font-normal">{order.orderNumber || ""}</span>
        </p>
        <p className="text-lg font-semibold">
          Tracking Number:{" "}
          <span className="font-normal">{order.trackingNumber || ""}</span>
        </p>
      </div>

      {/* Order Details */}
      <h2 className="text-xl font-bold mb-4">Order Details</h2>
      <div className="mb-6">
        <p className="text-lg font-semibold">
          Origin Location:{" "}
          <span className="font-normal">{order.originLocation}</span>
        </p>
        <p className="text-lg font-semibold">
          Destination Location:{" "}
          <span className="font-normal">{order.destinationLocation}</span>
        </p>
      </div>

      {/* Package List */}
      <h2 className="text-xl font-bold mb-4">Package List</h2>
      {order.packageList.map((pkg, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm"
        >
          <p className="text-lg font-semibold">Package {index + 1}</p>
          <p>Weight: {pkg.weight}</p>
          <p>Height: {pkg.height}</p>
          <p>Length: {pkg.length}</p>
          <p>Width: {pkg.width}</p>
          <p>Category: {pkg.category}</p>
          <p>Fragile: {pkg.isFragile ? "Yes" : "No"}</p>
        </div>
      ))}

      {/* Payment Information */}
      <h2 className="text-xl font-bold mb-4">Payment Information</h2>
      <div>
        <p className="text-lg font-semibold">
          Payment Method:{" "}
          <span className="font-normal">{order.payment.method}</span>
        </p>
        <p className="text-lg font-semibold">
          Amount: <span className="font-normal">{order.payment.amount}$</span>
        </p>
      </div>
    </div>
  );
}
