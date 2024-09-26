import Image from "next/image";
import Link from "next/link";
import omnivoxLogo from "@/public/logos/logo-omnivox.png";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Link
          className={`duration-250 flex flex-row items-center gap-1 font-sans text-omnivoxblue text-6xl font-medium`}
          href={"/"}
        >
          <Image
            src={omnivoxLogo}
            alt="Omnivox Logo"
            width={100}
            height={100}
          />
          Omnivox 2.0
        </Link>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Get started by entering your order number.</li>
          <li>Get your order status instantly.</li>
        </ol>
        <input
          className="bg-slate-100 border border-omnivoxorange rounded-lg self-center"
          type="number"
          name="orderTracker"
          id="orderTracker"
          placeholder="Order Number"
        />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
