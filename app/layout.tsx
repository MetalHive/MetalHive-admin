import type { Metadata } from "next";
import { interDisplay } from "./fonts";
import "./globals.css";
import AdminGuard from "./Components/AdminGuard";
import { ToastProvider } from "./Components/Toast";



export const metadata: Metadata = {
  title: "Metal Hive",
  description: "This is an app for selling scrap metals",
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interDisplay.variable}`}
      >
        <ToastProvider>
          <AdminGuard>{children}</AdminGuard>
        </ToastProvider>
      </body>
    </html>
  );
}
