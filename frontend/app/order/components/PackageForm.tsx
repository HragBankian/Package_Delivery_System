"use client";

import { z } from "zod";
import {
  PackageCategory,
  useOrderFormContext,
} from "@/components/multistep-form-context";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export default function PackageForm() {
  const formContext = useOrderFormContext();
  const router = useRouter();

  const category = ["Standard", "Hazardous", "Valuable"] as const;

  // STEP 1: Defining the form schema👇🏽
  const newOrderFormSchema = z.object({
    weight: z.string().min(3, "at least 3 characteres"),
    height: z.string().min(3, "at least 3 characteres"),
    length: z.string().min(3, "at least 3 characteres"),
    width: z.string().min(3, "at least 3 characteres"),
    category: z.enum(category),
    isFragile: z.boolean(),
  });

  // STEP 2: Defining your form.
  const stepTwoForm = useForm<z.infer<typeof newOrderFormSchema>>({
    resolver: zodResolver(newOrderFormSchema),
    mode: "onChange",
    defaultValues: {
      weight: "",
      height: "",
      length: "",
      width: "",
      category: "Standard",
      isFragile: false,
    },
  });

  // STEP 3: Defining the submit function
  function onSubmit(values: z.infer<typeof newOrderFormSchema>) {
    formContext.updateOrderData(values);
    formContext.nextStep();

    router.push("/order/packages/");
  }
  return (
    <Form {...stepTwoForm}>
      <form
        onSubmit={stepTwoForm.handleSubmit(onSubmit)}
        className="space-y-6 m-2 p-2 rounded-xl border border-3 bg-gray-100 overflow-scroll max-h-[80vh]"
      >
        <h2 className="text-2xl font-bold mb-4 text-center rounded-xl border border-3">
          Package 1
        </h2>
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          Dimensions
        </h3>
        <FormField
          control={stepTwoForm.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <Input
                  placeholder="1455 Blvd. De Maisonneuve Ouest, Montreal, Quebec H3G 1M8"
                  {...field}
                />
              </FormControl>
              <FormDescription>Weight of the package.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stepTwoForm.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <Input
                  placeholder="1455 Blvd. De Maisonneuve Ouest, Montreal, Quebec H3G 1M8"
                  {...field}
                />
              </FormControl>
              <FormDescription>Height of the package.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stepTwoForm.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length</FormLabel>
              <FormControl>
                <Input
                  placeholder="1455 Blvd. De Maisonneuve Ouest, Montreal, Quebec H3G 1M8"
                  {...field}
                />
              </FormControl>
              <FormDescription>Length of the package.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={stepTwoForm.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Width</FormLabel>
              <FormControl>
                <Input
                  placeholder="1455 Blvd. De Maisonneuve Ouest, Montreal, Quebec H3G 1M8"
                  {...field}
                />
              </FormControl>
              <FormDescription>Width of the package.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          Extra Information
        </h3>
        <div className="flex flex-row gap-2">
          <FormField
            control={stepTwoForm.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-row grow items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Category</FormLabel>
                  <FormDescription>
                    This is the Category your package
                  </FormDescription>
                </div>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? category.find(
                                (category) => category === field.value
                              )
                            : "Select Category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search Category..." />
                        <CommandList>
                          <CommandEmpty>No Category found.</CommandEmpty>
                          <CommandGroup>
                            {category.map((category) => (
                              <CommandItem
                                value={category}
                                onSelect={() => {
                                  stepTwoForm.setValue("category", category);
                                }}
                              >
                                {category}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    category === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={stepTwoForm.control}
            name="isFragile"
            render={({ field }) => (
              <FormItem className="flex flex-row grow items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Fragile Package</FormLabel>
                  <FormDescription>My package is fragile</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Save Package Information
        </button>
      </form>
    </Form>
  );
}
