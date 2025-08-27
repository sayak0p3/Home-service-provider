import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import NextAuthSessionProvider from "./provider";
import { Toaster } from "@/components/ui/sonner";


const inter = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Home Service App",
  description: "Booking home services made easy",
  icons: {
    icon: "/logo.svg", // Path to your favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <NextAuthSessionProvider>
        <div className=" mx-6 md:mx-16">
          <Header/>
          <Toaster />
        {children}
        </div>
       </NextAuthSessionProvider>
        </body>
    </html>
  );
}
