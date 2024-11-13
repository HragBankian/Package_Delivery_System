'use client';
import Image from "next/image";
import Link from "next/link";
import omnivoxLogo from "@/public/logos/logo-omnivox.png";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [reviews] = useState([
    "Amazing service! My package arrived super fast!",
    "I love the real-time tracking feature. Very reliable.",
    "Easy to use and great customer support.",
  ]);

  return (
      <div className="homepage-bg grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {/* Main Section */}
        <main className="opaque-box flex flex-col gap-8 row-start-2 items-center sm:items-start mt-20 sm:mt-32 p-4">
          {/* Logo and Title */}
          <Link
              className="duration-250 flex flex-row items-center gap-1 font-sans text-omnivoxblue text-6xl font-medium"
              href={"/"}
          >
            <Image src={omnivoxLogo} alt="Omnivox Logo" width={100} height={50} />
            Omnivox 2.0
          </Link>
        </main>

        {/* Key Features Section */}
        <section className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
          <div className="opaque-box p-4">
            <h3 className="featuresTitle">Fast Delivery</h3>
            <p>Get your orders delivered within 24 hours.</p>
          </div>
          <div className="opaque-box p-4">
            <h3 className="featuresTitle">Real-Time Tracking</h3>
            <p>Track your package with ease.</p>
          </div>
          <div className="opaque-box p-4">
            <h3 className="featuresTitle">Secure Payments</h3>
            <p>All transactions are fully encrypted.</p>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="mt-16 bg-orange-300 p-6 rounded-lg border border-black">
          <h2 className="text-2xl font-bold text-center mb-6">What Our Customers Say:</h2>
          <div className="flex overflow-x-auto gap-4">
            {reviews.map((review, index) => (
                <div key={index} className="bg-white p-4 rounded shadow min-w-[300px]">
                  <p>{review}</p>
                  <span className="text-sm text-gray-600">-Customer </span>
                </div>
            ))}
          </div>
        </section>

        {/* FAQ and Newsletter Section */}
        <section className="mt-16 flex flex-col sm:flex-row gap-8 items-start ">
          {/* FAQ Section */}
          <div className="flex-1 w-[500px] max-w-[500px] min-w-[400px] h-[400px] p-8 rounded-lg shadow-lg overflow-hidden overflow-y-auto bg-orange-300 border border-black">
            <h2 className="text-3xl font-bold">FAQs</h2>
            <details className="mt-6">
              <summary className="font-semibold cursor-pointer">How do I track my order?</summary>
              <p className="mt-4">Simply click on Order Tracker in the navbar and enter your order number!</p>
            </details>
            <details className="mt-6">
              <summary className="font-semibold cursor-pointer">What payment methods are accepted?</summary>
              <p className="mt-4">We accept credit cards, PayPal, and bank transfers.</p>
            </details>
            <details className="mt-6">
              <summary className="font-semibold cursor-pointer">What is the delivery time?</summary>
              <p className="mt-4">Most packages are delivered within 1-3 business days.</p>
            </details>
          </div>

          {/* Newsletter Signup Section */}
          <div className="flex-1 w-full max-w-2xl h-[400px] bg-blue-100 p-8 rounded-lg text-center shadow-lg flex flex-col justify-between border border-black">
            <div>
              <h2 className="text-3xl font-bold">Subscribe to Our Newsletter</h2>
              <p className="mt-6">Get the latest updates and offers.</p>
            </div>
            <div className="mt-8 flex items-center justify-center gap-4">
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="p-4 border rounded-lg w-full max-w-xs"
              />
              <button className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* Social Media Links */}
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-16 opaque-box">
          <h3 className="text-xl font-bold">Follow Us:</h3>
          <div className="flex gap-4">
            <Link href="https://facebook.com" target="_blank">
              <img src="/logos/facebook logo.png" alt="Facebook" className="h-8" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <img src="/logos/instagram logo.png" alt="Instagram" className="h-8" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <img src="/logos/x logo.png" alt="X (Twitter)" className="h-8" />
            </Link>
          </div>
        </footer>
      </div>
  );
}
