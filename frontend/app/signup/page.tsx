"use client";
import AuthForm from "@/components/AuthForm";
import { useState } from "react";

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (data: {
    fullName: string;
    address: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer/add?fullName=${data.fullName}&address=${data.address}&email=${data.email}&password=${data.password}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }

      setSuccess(true); // Indicates successful signup
    } catch (err: any) {
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
          Create an Account
        </h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mb-4">
            Signup successful! You can now log in.
          </p>
        )}
        <AuthForm mode="Signup" onSubmit={handleSignup} />
        {loading && (
          <p className="text-gray-700 dark:text-gray-300 text-center mt-4">
            Signing up, please wait...
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
