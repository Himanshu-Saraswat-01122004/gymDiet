import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'] 
});

export const metadata: Metadata = {
  title: "AI Gym Diet Planner",
  description: "Generate personalized diet plans with the power of AI to achieve your fitness goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} bg-gray-900 text-gray-200`}>
        <div className="absolute top-0 left-0 -z-10 h-full w-full bg-gradient-to-br from-gray-900 via-indigo-900/30 to-gray-900" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-[50vh] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />
        {children}
      </body>
    </html>
  );
}
