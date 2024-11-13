"use client";

import { Button } from "@/components/ui/button";

export default function PayementForm() {
  return (
    <form
      onSubmit={() => null}
      className="space-y-6 m-2 p-2 rounded-xl border border-3 border-omnivoxorange"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Payment</h2>
      <div>
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          Cardholder Name
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="email"
              required
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="email"
              required
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          Card Details
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Card Number
            </label>
            <input
              type="email"
              required
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              CVV
            </label>
            <input
              type="email"
              required
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Expiration Date
            </label>
            <input
              type="email"
              required
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full py-2 mt-auto bg-omnivoxblue text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 self-end"
      >
        Make Payment
      </Button>
    </form>
  );
}
