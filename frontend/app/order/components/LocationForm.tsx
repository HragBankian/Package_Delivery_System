"use client";

import { z } from "zod";
import { useOrderFormContext } from "@/components/multistep-form-context";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function LocationForm() {
  const formContext = useOrderFormContext();
  const router = useRouter();

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
      originLocation: formContext.order?.originLocation || "",
      destinationLocation: formContext.order?.destinationLocation || "",
    },
  });

  // STEP 3: Defining the submit function
  function onSubmit(values: z.infer<typeof newOrderFormSchema>) {
    formContext.updateOrderData(values);
    formContext.nextStep();

    router.push("/order/packages/");
  }
  return (
    <Form {...stepOneForm}>
      <form
        onSubmit={stepOneForm.handleSubmit(onSubmit)}
        className="space-y-6 m-2 p-2 rounded-xl border border-3 bg-gray-100"
      >
        <h2 className="text-2xl font-bold mb-4 text-center rounded-xl border border-3">
          Locations
        </h2>
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          Pickup Location
        </h3>
        <FormField
          control={stepOneForm.control}
          name="originLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="1455 Blvd. De Maisonneuve Ouest, Montreal, Quebec H3G 1M8"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the pickup location of your delivery.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          DropOff Location
        </h3>
        <FormField
          control={stepOneForm.control}
          name="destinationLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="7141 Sherbrooke St W, Montreal, Quebec H4B 1R6"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the DropOff location of your delivery.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Continue to next step
        </button>
      </form>
    </Form>
  );
}
