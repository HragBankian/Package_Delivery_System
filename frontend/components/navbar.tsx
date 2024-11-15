import omnivoxLogo from "@/public/logos/logo-omnivox.png";
import Image from "next/image";
import Link from "next/link";
import UserButton from "./UserButton";

export const dynamic = "force-dynamic";

export default function Navbar() {
  return (
    <div>
      <div
        className={`omnivoxorange fixed z-30 flex w-full flex-row border-b border-omnivoxorange p-4 shadow-2xl transition duration-300 md:px-8 lg:px-16 ${
          0 > 10 ? "bg-omnivoxorange/30 backdrop-blur-xl" : "bg-omnivoxorange"
        }`}
      >
        <div
          className={`flex flex-row items-center transition-all duration-1000`}
        >
          <Link
            className={`duration-250 flex flex-row items-center gap-1 font-sans text-omnivoxblue text-3xl font-medium`}
            href={"/"}
          >
            <Image
              src={omnivoxLogo}
              alt="Omnivox Logo"
              width={50}
              height={50}
            />
            Omnivox 2.0
          </Link>
        </div>

        <div
          className={`mx-auto flex flex-row items-center transition-all duration-500 md:gap-12`}
        >
          <Link
            className="font-roboto flex flex-row items-center truncate text-white transition duration-150 hover:text-omnivoxblue hover:ease-in-out"
            href={"/"}
          >
            Home
          </Link>
          <Link
            className="font-roboto flex flex-row items-center truncate text-white transition duration-150 hover:text-omnivoxblue hover:ease-in-out"
            href={"/tracking"}
          >
            Order Tracker
          </Link>

          <Link
            className="font-roboto flex flex-row items-center truncate text-white transition duration-150 hover:text-omnivoxblue hover:ease-in-out"
            href={"/reviews"}
          >
            Leave Us A Review
          </Link>

          <div className="relative group flex items-center">
            {/* Dropdown Button */}
            <button className="font-roboto flex items-center text-white min-h-12 transition duration-150 hover:text-omnivoxblue">
              Request a Delivery
            </button>

            {/* Dropdown Menu */}
            <div className="absolute left-0 bg-orange-400 rounded shadow-lg mt-32 hidden group-hover:block">
              <Link
                className="block px-4 py-2 text-white hover:bg-orange-300 hover:text-omnivoxblue whitespace-nowrap"
                href={"/order/locations"}
              >
                Create New Request
              </Link>
              <Link
                className="block px-4 py-2 text-white hover:bg-orange-300 hover:text-omnivoxblue whitespace-nowrap"
                href={"/order/continue"}
              >
                Continue a Request
              </Link>
            </div>
          </div>

          <UserButton />
        </div>
        <button
          aria-label="menu"
          className="ml-auto flex flex-col gap-1.5 self-center md:hidden"
        >
          <span
            className={`block h-0.5 w-6 rounded-sm 
                    transition-all duration-300 ease-out ${
                      false
                        ? "translate-y-2 rotate-45 bg-white"
                        : "-translate-y-0.5 bg-white"
                    }`}
          ></span>
          <span
            className={`block h-0.5 w-6 rounded-sm 
                    transition-all duration-300 ease-out ${
                      false ? "bg-transparent" : "-translate-y-0.5 bg-white"
                    }`}
          ></span>
          <span
            className={`block h-0.5 w-6 rounded-sm 
                    transition-all duration-300 ease-out ${
                      false
                        ? "-translate-y-2 -rotate-45 bg-white"
                        : "-translate-y-0.5 bg-white"
                    }`}
          ></span>
        </button>
      </div>
      <div
        className={`fixed left-[10%] top-[20%] flex w-[80%] flex-col items-center justify-center gap-1.5 rounded-lg border border-omnivoxorange bg-zinc-950/50 py-6 drop-shadow-xl backdrop-blur-xl backdrop-brightness-150 transition-all duration-300 ease-out md:hidden ${
          false ? "opacity-1 z-30" : "z-0 opacity-0"
        }`}
      >
        <Link
          className="font-roboto flex flex-row text-2xl text-white transition duration-150 hover:text-omnivoxblue hover:ease-in-out"
          href={"/"}
        >
          Home
        </Link>
        <hr className="my-8 h-px w-[70%] border-0 bg-white"></hr>
        <Link
          className="font-roboto flex flex-row text-2xl text-white transition duration-150 hover:text-omnivoxblue hover:ease-in-out"
          href={"/"}
        >
          Order Tracker
        </Link>
        <hr className="my-8 h-px w-[70%] border-0 bg-white"></hr>
        <Link
          className="font-roboto flex flex-row text-2xl text-white transition duration-150 hover:text-omnivoxblue hover:ease-in-out"
          href={"/"}
        >
          Contact Us
        </Link>
        <hr className="my-8 h-px w-[70%] border-0 bg-white"></hr>
        <Link
          className="font-roboto flex flex-row text-2xl text-white transition duration-150 hover:text-omnivoxblue hover:ease-in-out"
          href={"/"}
        >
          Our Story
        </Link>
      </div>
    </div>
  );
}
