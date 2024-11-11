import { OrderFormContextProvider } from "@/components/multistep-form-context";
import { Steps } from "./components/Steps";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
