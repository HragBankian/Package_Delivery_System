"use client";
export default function PayementForm() {
  return (
    <div className="space-y-6 m-2 p-2 rounded-xl border border-3 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center rounded-xl border border-3">
        Order Details
      </h2>
      <div>
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          Locations
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <h4 className="block text-gray-700 dark:text-gray-300">
            Pickup Location:
          </h4>
          <h4 className="block text-gray-700 dark:text-gray-300">Montreal</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">
            Drop off Location:
          </h4>
          <h4 className="block text-gray-700 dark:text-gray-300">Halifax</h4>
        </div>
      </div>
      <div>
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">
          Package
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <h4 className="block text-gray-700 dark:text-gray-300">Weight:</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">3kg</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">
            Dimensions:
          </h4>
          <h4 className="block text-gray-700 dark:text-gray-300">
            30cm x 40cm
          </h4>
          <h4 className="block text-gray-700 dark:text-gray-300">Category:</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">Dangerous</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">Fragile:</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">Yes</h4>
        </div>
      </div>
      <div>
        <h3 className="block text-gray-700 text-xl dark:text-gray-300">Fees</h3>
        <div className="grid grid-cols-2 gap-2">
          <h4 className="block text-gray-700 dark:text-gray-300">Base Price</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">30$</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">
            Fragile Fee
          </h4>
          <h4 className="block text-gray-700 dark:text-gray-300">5$</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">
            Dangerous Fee
          </h4>
          <h4 className="block text-gray-700 dark:text-gray-300">5$</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">Taxes</h4>
          <h4 className="block text-gray-700 dark:text-gray-300">6$</h4>
          <h4 className="block font-bold text-gray-700 dark:text-gray-300">
            Total
          </h4>
          <h4 className="block font-bold text-gray-700 dark:text-gray-300">
            46$
          </h4>
        </div>
      </div>
    </div>
  );
}
