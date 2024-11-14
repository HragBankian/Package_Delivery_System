'use client';

export default function PaymentForm() {
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
            <form className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Payment</h2>

                <div className="grid grid-cols-2 gap-6">
                    <input type="text" placeholder="First Name" className="p-3 border rounded-lg w-full" />
                    <input type="text" placeholder="Last Name" className="p-3 border rounded-lg w-full" />
                </div>

                <input type="text" placeholder="Card Number" className="w-full p-3 border rounded-lg" />

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <input type="text" placeholder="Expiration Date (MM/YY)" className="p-3 border rounded-lg w-full" />
                    <input type="text" placeholder="CVV" className="p-3 border rounded-lg w-full" />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Make Payment
                </button>
            </form>
        </div>
    );
}
