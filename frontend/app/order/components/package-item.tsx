"use client";

import { LuPackage } from "react-icons/lu";
import { useOrderFormContext } from "@/components/multistep-form-context";
import { Package } from "@/components/multistep-form-context";

interface PackageItemProps {
  packageItem: Package;
  key: number;
}
export function PackageItem({ packageItem, key }: PackageItemProps) {
  const { setCurrentPackage } = useOrderFormContext();

  return <LuPackage className="hover:fill-white" size={75} />;
}
