"use client";

import {
  Package,
  useOrderFormContext,
} from "@/components/multistep-form-context";
import { useRouter } from "next/navigation";
import { PackageItem } from "./package-item";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LuPackageMinus, LuPackagePlus } from "react-icons/lu";
import { PackageCategory } from "@/components/multistep-form-context";
import { useSession } from "next-auth/react";

export default function LocationForm() {
  const formContext = useOrderFormContext();
  const router = useRouter();
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize packageList if not already set
    if (
      !formContext.order?.packageList ||
      formContext.order.packageList.length === 0
    ) {
      const initialPackages: Package[] = [
        {
          weight: "",
          height: "",
          length: "",
          width: "",
          category: PackageCategory["Standard"],
          isFragile: false,
        },
      ];
      formContext.updatePackageList(initialPackages);
    }
  }, [formContext]);

  function goBack() {
    formContext.prevStep();
    router.push("/order/locations/");
  }

  async function goNext() {
    if (!session?.data?.user?.id || !formContext.order?.originLocation) {
      setError("Invalid session or order details. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/Delivery/deliveryRequest?customerId=${session.data.user.id}&pickupLocation=${formContext.order.originLocation}&dropoffLocation=${formContext.order.destinationLocation}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formContext.order.packageList),
        }
      );

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create delivery request."
        );
      }

      formContext.updateOrderData({
        orderNumber: JSON.stringify(await response.json()),
      });

      router.push("/order/payment/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!formContext.order || !formContext.order.packageList) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col grow m-2 rounded-xl border border-3 border-omnivoxorange">
      <h5 className="text-center my-2 text-gray-500">
        Click to add or remove packages
      </h5>
      <div className="flex flex-wrap p-4 grow gap-4">
        {formContext.order.packageList.map((item, i) => (
          <PackageItem
            key={i}
            id={i}
            packageItem={item}
            isSelected={formContext.currentPackage === i}
          />
        ))}
        <div className="flex flex-col items-center gap-2">
          {formContext.order.packageList.length > 1 && (
            <button
              className="hover:scale-125"
              onClick={() => {
                formContext.updatePackageList(
                  formContext.order.packageList.slice(0, -1)
                );
              }}
              aria-label="Remove Package"
            >
              <LuPackageMinus color="#3f3f46" size={30} />
            </button>
          )}
          <button
            className="hover:scale-125"
            onClick={() => {
              formContext.updatePackageList([
                ...formContext.order.packageList,
                {
                  weight: "",
                  height: "",
                  length: "",
                  width: "",
                  category: PackageCategory.Standard,
                  isFragile: false,
                },
              ]);
            }}
            aria-label="Add Package"
          >
            <LuPackagePlus color="#3f3f46" size={30} />
          </button>
        </div>
      </div>
      {error && <div className="text-red-600 text-center mb-2">{error}</div>}
      <div className="flex justify-between p-4">
        <Button
          className="w-52 bg-omnivoxblue text-white hover:bg-blue-600"
          onClick={goBack}
        >
          Go to Previous Step
        </Button>
        <Button
          className="w-66 bg-omnivoxblue text-white hover:bg-blue-600"
          onClick={goNext}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : "Go to Next Step (Create Delivery Request)"}
        </Button>
      </div>
    </div>
  );
}
