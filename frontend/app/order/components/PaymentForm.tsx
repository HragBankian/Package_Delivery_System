"use client";
export default function PayementForm() {
  return (
    <form
      onSubmit={() => null}
      className="space-y-6 m-2 p-2 rounded-xl border border-3 bg-gray-100"
    >
      <h2 className="text-2xl font-bold mb-4 text-center rounded-xl border border-3">
        Payment
      </h2>
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
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Make Payment
      </button>
    </form>
  );
}
