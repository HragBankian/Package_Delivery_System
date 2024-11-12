"use client";

import { useOrderFormContext } from "@/components/multistep-form-context";
import { useRouter } from "next/navigation";
import { PackageItem } from "./package-item";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LuPackageMinus, LuPackagePlus } from "react-icons/lu";

enum PackageCategory {
  Standard = "Standard",
  Hazardous = "Hazardous",
  Valuable = "Valuable",
}

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

  console.log(formContext.order);
  return (
    <div className="flex flex-rows flex-wrap content-start p-20">
      {packages.map(function (item, i) {
        return <PackageItem key={i} packageItem={item}></PackageItem>;
      })}
      <div className="flex flex-col">
        <button
          className="flex-grow"
          onClick={() => {
            setPackages(packages.slice(0, -1));
          }}
        >
          <LuPackageMinus size={30} />
        </button>
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
  );
}
