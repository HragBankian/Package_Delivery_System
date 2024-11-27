"use client";

import { useEffect, useState } from "react";
import { useOrderFormContext } from "@/components/multistep-form-context";
import { useRouter } from "next/navigation";

export default function CombinedOrderPage() {
  const formContext = useOrderFormContext();
  const [orderNumber, setOrderNumber] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingQuotation, setLoadingQuotation] = useState(false);
  const router = useRouter();

  // Fetch order details by order number
  const fetchOrderDetails = async () => {
    setLoadingOrder(true);

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

      formContext.updateOrderData(order);
      router.push("/order/payment");
    } catch (err) {
      console.error("Error fetching order details:", err.message);
    } finally {
      setLoadingOrder(false);
    }
  };

  // Fetch or create a quotation automatically
  const fetchOrCreateQuotation = async () => {
    if (formContext.order.quotation > 0) {
      console.log("Quotation already exists. Skipping fetch or create.");
      return;
    }

    setLoadingQuotation(true);

    try {
      // Attempt to fetch existing quotation
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Quotation/GetQuotationByDeliveryRequestId?deliveryRequestId=${formContext.order.orderNumber}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched existing quotation:", data);
        formContext.updateOrderData({
          quotation: data.quote_amount,
          quotationId: data.id,
        });
        formContext.setPaymentLock(true);
        return;
      }

      if (response.status === 404) {
        // If no existing quotation, create one
        console.log("Quotation not found. Creating a new one.");
        const createResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quotation/create?deliveryRequestId=${formContext.order.orderNumber}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
        );

        if (createResponse.ok) {
          const data = await createResponse.json();
          console.log("Created new quotation:", data);
          formContext.updateOrderData({
            quotation: data.quote_amount,
            quotationId: data.id,
          });
          formContext.setPaymentLock(true);
          return;
        }
      }

      // Fallback for unexpected statuses
      console.warn("Unexpected status during quotation fetch/create.");
    } catch (err) {
      console.error("Error fetching or creating quotation:", err.message);
    } finally {
      setLoadingQuotation(false);
    }

    console.log("Final quotation:", formContext.order.quotation);
  };

  // Trigger quotation generation automatically when the order number is available
  useEffect(() => {
    if (formContext.order?.orderNumber) {
      fetchOrCreateQuotation();
    }
  }, [formContext.order]);

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
          {formContext.order.quotation > 0 && (
              <div className="flex flex-row justify-center align-center mt-4 p-4 border rounded-lg bg-green-50">
                <h3 className="font-bold text-lg">
                  Quotation: {formContext.order.quotation}$
                </h3>
              </div>
          )}
        </div>
      </div>
  );
}
