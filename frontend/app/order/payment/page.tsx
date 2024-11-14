'use client';

import OrderDetails from "@/app/order/components/OrderDetails";
import PaymentForm from "@/app/order/components/PaymentForm";
import { useState } from "react";
import { useOrderFormContext } from "@/components/multistep-form-context";

export default function PaymentPage() {
    const { order } = useOrderFormContext();
    const [isUnlocked, setIsUnlocked] = useState(false);

    const handleUnlockPayment = () => {
        setIsUnlocked(true);
    };

    return (
        <>
            {/* Left Column: Order Details */}
            <div className="p-8">
                <OrderDetails onGenerateQuotation={handleUnlockPayment} />
            </div>

            {/* Right Column: Payment Form */}
            <div
                className={`p-8 transition-opacity duration-500 ${
                    isUnlocked ? "opacity-100" : "opacity-50 pointer-events-none"
                }`}
            >
                <PaymentForm />
            </div>
        </>
    );
}
