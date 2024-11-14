"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

interface AuthFormProps {
  mode: "Signup" | "Login";
  onSubmit: (data: {
    email: string;
    password: string;
    fullName?: string;
  }) => void;
  resetForm?: boolean;
}

// Define Zod schemas for validation
const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters")
    .optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, resetForm }) => {
  const schema = mode === "Signup" ? signupSchema : loginSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const { reset } = form;

  // Reset form when `resetForm` prop changes
  useEffect(() => {
    if (resetForm) reset();
  }, [resetForm, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">{mode}</h2>

          {mode === "Signup" && (
            <>
              <FormField
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === "Login" ? (
            <p>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-300"
              >
                Register
              </Link>
            </p>
          ) : (
            <p>
              Have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-300">
                Login
              </Link>
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-omnivoxblue hover:bg-blue-400"
          >
            {mode}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
