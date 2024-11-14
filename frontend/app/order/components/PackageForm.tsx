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
import { useEffect } from "react";

export default function PackageForm() {
  const formContext = useOrderFormContext();
  const router = useRouter();

  const categories = ["Standard", "Hazardous", "Valuable"] as const;

  // Form schema using Zod
  const packageFormSchema = z.object({
    weight: z.string().min(1, "Weight is required"),
    height: z.string().min(1, "Height is required"),
    length: z.string().min(1, "Length is required"),
    width: z.string().min(1, "Width is required"),
    category: z
      .number()
      .int()
      .min(0)
      .max(categories.length - 1), // Category as index
    isFragile: z.boolean(),
  });

  const currentPackageIndex = formContext.currentPackage;
  const currentPackageData = formContext.order.packageList[currentPackageIndex];

  // React Hook Form setup
  const packageForm = useForm<z.infer<typeof packageFormSchema>>({
    resolver: zodResolver(packageFormSchema),
    mode: "onChange",
    defaultValues: currentPackageData,
  });

  useEffect(() => {
    packageForm.reset(currentPackageData); // Reset the form values whenever the current package changes
  }, [currentPackageData, packageForm.reset]);

  function onSubmit(values: z.infer<typeof packageFormSchema>) {
    const updatedPackages = [...formContext.order.packageList];
    updatedPackages[currentPackageIndex] = values; // Update only the current package
    formContext.updatePackageList(updatedPackages); // Save updated packageList to context
  }

  return (
    <Form {...packageForm}>
      <form
        onSubmit={packageForm.handleSubmit(onSubmit)}
        className="space-y-6 m-2 p-2 rounded-xl border border-3 border-omnivoxorange overflow-scroll max-h-[80vh]"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Package {currentPackageIndex + 1}
        </h2>
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          Dimensions
        </h3>
        <FormField
          control={packageForm.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <Input placeholder="Enter weight" {...field} />
              </FormControl>
              <FormDescription>Weight of the package.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={packageForm.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <Input placeholder="Enter height" {...field} />
              </FormControl>
              <FormDescription>Height of the package.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={packageForm.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length</FormLabel>
              <FormControl>
                <Input placeholder="Enter length" {...field} />
              </FormControl>
              <FormDescription>Length of the package.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={packageForm.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Width</FormLabel>
              <FormControl>
                <Input placeholder="Enter width" {...field} />
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
            control={packageForm.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-row grow items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Category</FormLabel>
                  <FormDescription>Category of your package</FormDescription>
                </div>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          field.value === undefined && "text-muted-foreground"
                        )}
                      >
                        {field.value !== undefined
                          ? categories[field.value]
                          : "Select Category"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search Category..." />
                        <CommandList>
                          <CommandEmpty>No Category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category, index) => (
                              <CommandItem
                                key={index}
                                onSelect={() => field.onChange(index)} // Set category as index
                              >
                                {category}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value === index
                                      ? "opacity-100 stroke-omnivoxblue"
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
            control={packageForm.control}
            name="isFragile"
            render={({ field }) => (
              <FormItem className="flex flex-row grow items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Fragile Package</FormLabel>
                  <FormDescription>Mark if package is fragile</FormDescription>
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
        <Button
          type="submit"
          className="w-full py-2 bg-omnivoxblue text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Save Package Information
        </Button>
      </form>
    </Form>
  );
}
