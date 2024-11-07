"use client";
import AuthForm from "@/components/AuthForm";
const Signup: React.FC = () => {
  const handleLogin = async (data: { email: string; password: string }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
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
