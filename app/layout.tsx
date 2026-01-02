import type { Metadata } from "next";
import { interDisplay } from "./fonts";
import "./globals.css";



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
        {children}
      </body>
    </html>
  );
}
