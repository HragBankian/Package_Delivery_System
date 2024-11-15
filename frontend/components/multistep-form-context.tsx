"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

export type Order = {
  packageList: Package[];
  orderNumber: string;
  originLocation: string;
  destinationLocation: string;
  trackingNumber: string;
  quotation: number;
  quotationId: number;
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
  method: PaymentMethod;
  amount: number;
};

export enum PackageCategory {
  Standard = "Standard",
  Hazardous = "Hazardous",
  Valuable = "Valuable",
}

export enum PaymentMethod {
  CC = "CC",
  Paypal = "Paypal",
}

interface MultiStepContextType {
  order: Order;
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (data: number) => void;
  createOrderData: (data: Order) => void;
  currentPackage: number;
  setCurrentPackage: (data: number) => void;
  addNewPackage: () => void;
  updateOrderData: (values: Partial<Order>) => void;
  updatePackageList: (values: Package[]) => void;
  setPaymentLock: (value: boolean) => void;
  paymentLock: boolean;
}

// Context Setup
const MultiStepContext = createContext<MultiStepContextType>(
  {} as MultiStepContextType
);

export const useOrderFormContext = () => {
  const context = useContext(MultiStepContext);
  if (!context) {
    throw new Error(
      "useOrderFormContext must be used within a OrderFormContextProvider"
    );
  }
  return context;
};

export function OrderFormContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [step, setStep] = useState(1);
  const [currentPackage, setCurrentPackage] = useState(0);
  const [paymentLock, setPaymentLock] = useState(false);
  const [order, setOrder] = useState<Order>({
    packageList: [],
    originLocation: "",
    destinationLocation: "",
    payment: { method: PaymentMethod.CC, amount: 0 },
    quotation: 0,
    quotationId: 0,
    trackingNumber: "string",
    orderNumber: "",
  });

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
        setStep,
        nextStep,
        prevStep,
        currentPackage,
        setCurrentPackage,
        updateOrderData,
        updatePackageList,
        setPaymentLock,
        paymentLock,
      }}
    >
      {children}
    </MultiStepContext.Provider>
  );
}
