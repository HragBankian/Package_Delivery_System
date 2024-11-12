"use client";

import { useOrderFormContext } from "@/components/multistep-form-context";
import { useRouter } from "next/navigation";
import { PackageItem } from "./package-item";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LuPackageMinus, LuPackagePlus } from "react-icons/lu";
import { PackageCategory } from "@/components/multistep-form-context";

export default function LocationForm() {
  const formContext = useOrderFormContext();
  const router = useRouter();

  const [packages, setPackages] = useState([
    {
      weight: "",
      height: "",
      length: "",
      width: "",
      category: PackageCategory.Standard,
      isFragile: false,
    },
  ]);

  function goBack() {
    formContext.prevStep();
    router.push("/order/locations/");
  }

  console.log(formContext.order);
  return (
    <div className="flex flex-col grow">
      <div className="flex flex-rows flex-wrap content-start p-20 grow">
        {packages.map(function (item, i) {
          return <PackageItem key={i} packageItem={item}></PackageItem>;
        })}
        <div className="flex flex-col">
          {packages.length > 1 && (
            <button
              className="flex-grow"
              onClick={() => {
                setPackages(packages.slice(0, -1));
              }}
            >
              <LuPackageMinus size={30} />
            </button>
          )}
          <button
            className="flex-grow"
            onClick={() => {
              setPackages([
                ...packages,
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
            <LuPackagePlus size={30} />
          </button>
        </div>
      </div>
      <Button
        className="w-52 m-4"
        onClick={() => {
          goBack();
        }}
      >
        Go to Previous Step
      </Button>
    </div>
  );
}
