import { OrderFormContextProvider } from "@/components/multistep-form-context";
import { Steps } from "./components/Steps";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-600 text-center">
        <p className="text-lg">Please sign in first</p>
      </div>
    );
  }
  return (
    <div>
      <div></div>
      <div className="grid grid-rows-[10%] min-h-screen pt-20">
        <OrderFormContextProvider>
          <Steps />
          <div className="grid grid-cols-2">{children}</div>
        </OrderFormContextProvider>
      </div>
    </div>
  );
}
