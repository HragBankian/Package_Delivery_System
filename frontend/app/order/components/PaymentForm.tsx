"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  PaymentMethod,
  useOrderFormContext,
} from "@/components/multistep-form-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Zod Schema for Credit Card Validation
const creditCardSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits")
    .max(16, "Card number must be 16 digits"),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid date format (MM/YY)"),
  cvv: z.string().length(3, "CVV must be 3 digits"),
});

type CreditCardFormValues = z.infer<typeof creditCardSchema>;

export default function PaymentForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to track error messages
  const formContext = useOrderFormContext();
  const session = useSession();
  const router = useRouter();

  const creditCardForm = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      cardNumber: "",
      expirationDate: "",
      cvv: "",
    },
  });

  const handleCreditCardSubmit = async (data: CreditCardFormValues) => {
    if (!formContext.paymentLock) return; // Prevent submission if locked
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/Payment/ProcessPayment?paymentMethod=0&paymentIdentifier=${data.cardNumber}&quotationId=${formContext.order.quotationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Payment failed. Please try again.");
      }

      const result = await response.json();
      console.log("Payment successful:", result);
      formContext.updateOrderData({
        payment: {
          method: PaymentMethod.CC,
          amount: formContext.order.quotation,
        },
        trackingNumber: result.tracking.tracking_number,
      });
      formContext.nextStep();
      router.push("/order/confirmation");
    } catch (error: any) {
      setError(
        "Credit Card payment failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalSubmit = async () => {
    if (!formContext.paymentLock) return; // Prevent submission if locked
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/Payment/ProcessPayment?paymentMethod=1&paymentIdentifier=${session?.data?.user.email}&quotationId=${formContext.order.quotationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Payment failed. Please try again.");
      }

      const result = await response.json();
      formContext.updateOrderData({
        payment: {
          method: PaymentMethod.Paypal,
          amount: formContext.order.quotation,
        },
        trackingNumber: result.tracking.tracking_number,
      });
      formContext.nextStep();
      router.push("/order/confirmation");
    } catch (error: any) {
      setError("PayPal payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col grow m-2 p-4 rounded-xl border transition-opacity duration-500 ${
        formContext.paymentLock
          ? "opacity-100 border-omnivoxorange"
          : "opacity-50 pointer-events-none"
      }`}
    >
      <h2 className="text-2xl font-bold text-center mb-4">Payment</h2>

      {/* Show Error Message */}
      {error && (
        <div className="text-red-500 bg-red-100 border border-red-300 p-4 rounded-md text-center mb-4">
          {error}
        </div>
      )}

      {/* Credit Card Form */}
      <Form {...creditCardForm}>
        <form
          onSubmit={creditCardForm.handleSubmit(handleCreditCardSubmit)}
          className="space-y-6"
        >
          <h3 className="text-lg font-semibold">Pay with Credit Card</h3>
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={creditCardForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={creditCardForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={creditCardForm.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input placeholder="Card Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={creditCardForm.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date (MM/YY)</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/YY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={creditCardForm.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input placeholder="CVV" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-omnivoxblue text-white hover:bg-blue-600"
            disabled={loading || !formContext.paymentLock}
          >
            {loading ? "Processing..." : "Pay with Credit Card"}
          </Button>
        </form>
      </Form>

      <div className="flex items-center justify-center my-6">
        <div className="border-t flex-grow border-gray-300"></div>
        <span className="mx-4 text-gray-500 font-semibold">OR</span>
        <div className="border-t flex-grow border-gray-300"></div>
      </div>

      {/* PayPal Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page refresh
          handlePayPalSubmit();
        }}
      >
        <Button
          type="submit"
          className="w-full flex items-center justify-center py-3 bg-omnivoxblue text-white hover:bg-blue-600"
          disabled={loading || !formContext.paymentLock}
        >
          <img
            src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
            alt="PayPal Logo"
            className="h-6 w-6 mr-2"
          />
          {loading ? "Processing..." : "Pay with PayPal"}
        </Button>
      </form>
    </div>
  );
}
