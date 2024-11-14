'use client';

import OrderNumberForm from "@/app/order/components/OrderNumberForm";
import PaymentForm from "@/app/order/components/PaymentForm";
import { useState } from "react";

export default function Continue() {
    const [isUnlocked, setIsUnlocked] = useState(false);

    const handleUnlock = () => {
        setIsUnlocked(true);
    };

    return (
        <>
            {/* Order Number Form */}
            <div className="p-10">
                <OrderNumberForm onUnlock={handleUnlock} />
            </div>

            {/* Payment Form */}
            <div
                className={`p-10 transition-opacity duration-500 ${
                    isUnlocked ? "opacity-100" : "opacity-50 pointer-events-none"
                }`}
            >
                <PaymentForm />
            </div>
        </>
    );
}
