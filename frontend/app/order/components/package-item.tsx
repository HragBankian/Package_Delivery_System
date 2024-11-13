"use client";

import { LuPackage } from "react-icons/lu";
import { useOrderFormContext } from "@/components/multistep-form-context";
import { Package } from "@/components/multistep-form-context";

interface PackageItemProps {
  packageItem: Package;
  id: number;
  isSelected: boolean;
}

export function PackageItem({ packageItem, id, isSelected }: PackageItemProps) {
  const { setCurrentPackage } = useOrderFormContext();

  return (
    <div onClick={() => setCurrentPackage(id)} className={`cursor-pointer`}>
      <LuPackage
        className="hover:scale-125"
        color={isSelected ? "#0277ca" : "#3f3f46"}
        size={75}
      />
    </div>
  );
}
