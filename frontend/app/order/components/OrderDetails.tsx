"use client";

import { useState } from "react";
import { useOrderFormContext } from "@/components/multistep-form-context";
import { useRouter } from "next/navigation";

export default function CombinedOrderPage() {
  const formContext = useOrderFormContext(); // Assuming `setOrderDetails` exists in the context
  const [orderNumber, setOrderNumber] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingQuotation, setLoadingQuotation] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  // Fetch order details by order number
  const fetchOrderDetails = async () => {
    setLoadingOrder(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/Delivery/deliveryRequest/${orderNumber}`
      );

      if (!response.ok) {
        throw new Error("Order not found or unable to fetch order details.");
      }

      const data = await response.json();
      console.log(data);
      const order = {
        packageList: data.packages,
        orderNumber: data.id,
        originLocation: data.pickup_location,
        destinationLocation: data.dropoff_location,
      };

      formContext.updateOrderData(order); // Update context with fetched order details
      router.push("/order/payment");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoadingOrder(false);
    }
  };

  // Fetch or create a quotation
  const fetchOrCreateQuotation = async () => {
    setLoadingQuotation(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Quotation/GetQuotationByDeliveryRequestId?deliveryRequestId=${formContext.order.orderNumber}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        formContext.updateOrderData({
          quotation: data.quote_amount,
          quotationId: data.id,
        });
        formContext.setPaymentLock(true);
      } else if (response.status === 404) {
        // If quotation doesn't exist, create it
        const createResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quotation/create?deliveryRequestId=${formContext.order.orderNumber}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!createResponse.ok) {
          throw new Error("Failed to create a new quotation.");
        }

        const data = await createResponse.json();
        console.log(data);
        formContext.updateOrderData({
          quotation: data.quote_amount,
          quotationId: data.id,
        });
        formContext.setPaymentLock(true);
      } else {
        throw new Error("Failed to fetch or create a quotation.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoadingQuotation(false);
    }
    console.log(formContext.order.quotation);
  };

  const handleOrderNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim() !== "") {
      fetchOrderDetails();
    }
  };

  if (!formContext.order?.orderNumber) {
    formContext.setStep(3);
    return (
      <div className="flex flex-col grow items-center justify-center m-2 p-2 rounded-xl border border-3 border-omnivoxorange">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <form onSubmit={handleOrderNumberSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Enter Order Number
            </h2>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Order Number"
              className="w-full p-3 border rounded-lg"
            />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loadingOrder}
            >
              {loadingOrder ? "Fetching..." : "Fetch Order Details"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col grow overflow-scroll m-2 p-2 rounded-xl border border-3 border-omnivoxorange">
      <h2 className="text-2xl font-bold text-center mb-6">
        Order Details: #{formContext.order.orderNumber}
      </h2>

      {/* Display Order Locations */}
      <div className="space-y-4 mb-6">
        <div>
          <h3 className="font-semibold">Pickup Location:</h3>
          <p>{formContext.order?.originLocation || "Not provided"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Dropoff Location:</h3>
          <p>{formContext.order?.destinationLocation || "Not provided"}</p>
        </div>
      </div>

      {/* Display Package Details */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Package Details:</h3>
        <div className="flex flex-row gap-2 flex-wrap">
          {formContext.order?.packageList?.map((pkg, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <h4 className="font-bold text-lg mb-2">Package {index + 1}</h4>
              <div className="space-y-2">
                <p>
                  <strong>Weight:</strong> {pkg.weight || "N/A"} kg
                </p>
                <p>
                  <strong>Dimensions:</strong> {pkg.length} x {pkg.width} x{" "}
                  {pkg.height} cm
                </p>
                <p>
                  <strong>Category:</strong> {pkg.category}
                </p>
                <p>
                  <strong>Fragile:</strong> {pkg.isFragile ? "Yes" : "No"}
                </p>
              </div>
            </div>
          ))}
        </div>
        {formContext.order?.packageList?.length === 0 && (
          <p>No package details provided.</p>
        )}
      </div>

      {/* Quotation Section */}
      <div className="mt-8">
        {loadingQuotation && (
          <p className="text-center text-blue-500">Loading quotation...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {formContext.order.quotation > 0 && (
          <div className="flex flex-row justify-center align-center mt-4 p-4 border rounded-lg bg-green-50">
            <h3 className="font-bold text-lg">
              Quotation: {formContext.order.quotation}$
            </h3>
          </div>
        )}
      </div>

      {/* Generate Quotation Button */}
      {formContext.order.quotation == 0 && (
        <button
          onClick={fetchOrCreateQuotation}
          disabled={loadingQuotation}
          className="w-full mt-8 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50"
        >
          {loadingQuotation ? "Generating..." : "Generate Quotation"}
        </button>
      )}
    </div>
  );
}
