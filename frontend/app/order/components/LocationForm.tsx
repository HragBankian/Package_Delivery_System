"use client";

import { z } from "zod";
import { useOrderFormContext } from "@/components/multistep-form-context";
import router from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LocationForm() {
  const formContext = useOrderFormContext();

  // STEP 1: Defining the form schema👇🏽
  const newOrderFormSchema = z.object({
    originLocation: z.string().min(3, "at least 3 characteres"),
    destinationLocation: z.string().min(3, "at least 3 characteres"),
  });

  // STEP 2: Defining your form.
  const stepOneForm = useForm<z.infer<typeof newOrderFormSchema>>({
    resolver: zodResolver(newOrderFormSchema),
    mode: "onChange",
    defaultValues: {
      originLocation: "formContext.order.originLocation",
      destinationLocation: "formContext.order.destinationLocation",
    },
  });

  // STEP 3: Defining the submit function
  function onSubmit(values: z.infer<typeof newOrderFormSchema>) {
    formContext.updateOrderData(values);

    router.push("/order/packages/");
  }
  return (
    <form
      onSubmit={() => onSubmit}
      className="space-y-6 m-2 p-2 rounded-xl border border-3 bg-gray-100"
    >
      <h2 className="text-2xl font-bold mb-4 text-center rounded-xl border border-3">
        Locations
      </h2>
      <div>
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          Pickup Location
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Address
            </label>
            <input
              required
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          DropOff Location
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Address
            </label>
            <input
              required
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Continue to next step
      </button>
    </form>
  );
}
