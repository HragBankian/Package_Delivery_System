export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div></div>
      <div className="grid grid-rows-[10%] min-h-screen pt-20">
        <div className="bg-red-400">Progress bar</div>
        <div className="grid grid-cols-2">{children}</div>
      </div>
    </div>
  );
}
