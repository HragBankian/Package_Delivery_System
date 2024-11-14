"use client";
import AuthForm from "@/components/AuthForm";
import { signIn } from "next-auth/react";

const Signup: React.FC = () => {
  const handleLogin = (data: { email: string; password: string }) => {
    signIn("credentials", data);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <AuthForm mode="Login" onSubmit={handleLogin} />
      </div>
    </div>
  );
};
export default Signup;
