"use client";
import { createContext, ReactNode, useContext, useState } from "react";

export type Order = {
  packageList: Package[];
  orderNumber: string;
  originLocation: string;
  destinationLocation: string;
  payment: Payment;
};

export type Package = {
  weight: string;
  height: string;
  length: string;
  width: string;
  category: PackageCategory;
  isFragile: Boolean;
};

export type Payment = {
  method: string;
  amount: string;
};

export enum PackageCategory {
  Standard = "Standard",
  Hazardous = "Hazardous",
  Valuable = "Valuable",
}

interface MultiStepContextType {
  order: Order;
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  createOrderData: (data: Order) => void;
  currentPackage: number;
  setCurrentPackage: (data: number) => void;
  addNewPackage: () => void;
  updateOrderData: (values: Partial<Order>) => void;
  updatePackageList: (values: Package[]) => void;
}

// "This will allow you to update the state within the context whenever you need to."
interface MultiStepContextProviderProps {
  children: ReactNode;
}

export const MultiStepContext = createContext<MultiStepContextType>(
  {} as MultiStepContextType
);

export const useOrderFormContext = () => {
  const context = useContext(MultiStepContext);
  if (!context) {
    throw new Error(
      "useNewPropertyFormContext must be used within a OrderFormContextProvider"
    );
  }
  return context;
};

export function OrderFormContextProvider({
  children,
}: MultiStepContextProviderProps) {
  const [step, setStep] = useState(1);
  const [currentPackage, setCurrentPackage] = useState(0);
  const [order, setOrder] = useState<Order | null>({
    packageList: [],
    originLocation: "",
    destinationLocation: "",
    payment: { method: "", amount: "" },
  });

  function nextStep() {
    if (step === 5) return;
    setStep((prev) => prev + 1);
    console.log(step);
  }
  function prevStep() {
    if (step === 1) return;
    setStep((prev) => prev - 1);
  }

  const updateOrderData = (values: Partial<Order>) => {
    setOrder({ ...order, ...values });
  };

  const updatePackageList = (updatedPackages: Package[]) => {
    setOrder(
      (prevOrder) =>
        prevOrder ? { ...prevOrder, packageList: updatedPackages } : null // Or handle the case where the order is null
    );
  };

  return (
    <MultiStepContext.Provider
      value={{
        order,
        step,
        nextStep,
        prevStep,
        setOrder,
        updateOrderData,
        currentPackage,
        setCurrentPackage,
        updatePackageList,
      }}
    >
      {children}
    </MultiStepContext.Provider>
  );
}
