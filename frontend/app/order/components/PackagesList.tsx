"use client";

import {
  Package,
  useOrderFormContext,
} from "@/components/multistep-form-context";
import { useRouter } from "next/navigation";
import { PackageItem } from "./package-item";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { LuPackageMinus, LuPackagePlus } from "react-icons/lu";
import { PackageCategory } from "@/components/multistep-form-context";

export default function LocationForm() {
  const formContext = useOrderFormContext();
  const router = useRouter();

  useEffect(() => {
    // Ensure packageList is initialized if not already
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
          category: PackageCategory.Standard,
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

  function goNext() {
    formContext.nextStep();
    router.push("/order/payment/");
  }

  // If order or packageList is not yet available, render a loading or placeholder
  if (!formContext.order || !formContext.order.packageList) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col grow m-2 rounded-xl border border-3 border-omnivoxorange">
      <h5 className="text-center my-2 text-gray-500">
        click to add or remove packages
      </h5>
      <div className="flex flex-rows flex-wrap content-start p-20 grow">
        {formContext.order.packageList.map((item, i) => (
          <PackageItem
            key={i}
            id={i}
            packageItem={item}
            isSelected={formContext.currentPackage === i}
          ></PackageItem>
        ))}
        <div className="flex flex-col">
          {formContext.order.packageList.length > 1 && (
            <button
              className="flex-grow"
              onClick={() => {
                formContext.updatePackageList(
                  formContext.order.packageList.slice(0, -1)
                );
              }}
            >
              <LuPackageMinus
                color={"#3f3f46"}
                className="hover:scale-125"
                size={30}
              />
            </button>
          )}
          <button
            className="flex-grow"
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
          >
            <LuPackagePlus
              className="hover:scale-125"
              color={"#3f3f46"}
              size={30}
            />
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <Button
          className="w-52 m-4 bg-omnivoxblue text-white hover:bg-blue-600"
          onClick={() => {
            goBack();
          }}
        >
          Go to Previous Step
        </Button>
        <Button
          className="w-66 m-4 bg-omnivoxblue text-white hover:bg-blue-600"
          onClick={() => {
            goNext();
          }}
        >
          Go to Next Step (Create Delivery Request)
        </Button>
      </div>
    </div>
  );
}
