"use client";

import PaymentForm from "@/app/order/components/PaymentForm";
import { useState } from "react";
import OrderDetails from "../components/OrderDetails";

export default function Continue() {
  return (
    <>
      <OrderDetails />
      <PaymentForm />
    </>
  );
}
