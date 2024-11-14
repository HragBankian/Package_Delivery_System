'use client';
import { createContext, ReactNode, useContext, useState, useEffect } from "react";

export type Order = {
  packageList: Package[];
  orderNumber: string;
  originLocation: string;
  destinationLocation: string;
  payment: Payment;
  orderNumber: string;
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

// Context Setup
const MultiStepContext = createContext<MultiStepContextType>(
    {} as MultiStepContextType
);

export const useOrderFormContext = () => {
  const context = useContext(MultiStepContext);
  if (!context) {
    throw new Error("useOrderFormContext must be used within a OrderFormContextProvider");
  }
  return context;
};

export function OrderFormContextProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [currentPackage, setCurrentPackage] = useState(0);
  const [order, setOrder] = useState<Order>({
    packageList: [],
    originLocation: "",
    destinationLocation: "",
    payment: { method: "", amount: "" },
    orderNumber: "",
  });

  useEffect(() => {
    // Generate an order number when the user reaches the payment step
    if (step === 3 && !order.orderNumber) {
      const generatedOrderNumber = `ORD-${Math.floor(Math.random() * 1000000)}`;
      setOrder((prevOrder) => ({
        ...prevOrder,
        orderNumber: generatedOrderNumber,
      }));
    }
  }, [step, order.orderNumber]);

  function nextStep() {
    if (step < 5) setStep((prev) => prev + 1);
  }

  function prevStep() {
    if (step > 1) setStep((prev) => prev - 1);
  }

  const updateOrderData = (values: Partial<Order>) => {
    setOrder({ ...order, ...values });
  };

  const updatePackageList = (updatedPackages: Package[]) => {
    setOrder((prevOrder) => ({ ...prevOrder, packageList: updatedPackages }));
  };

  return (
      <MultiStepContext.Provider
          value={{
            order,
            step,
            nextStep,
            prevStep,
            currentPackage,
            setCurrentPackage,
            updateOrderData,
            updatePackageList,
          }}
      >
        {children}
      </MultiStepContext.Provider>
  );
}
