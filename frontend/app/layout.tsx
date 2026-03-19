import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareIntel AI - Explainable Clinical Support",
  description: "AI healthcare assistant for patient analysis and diagnosis with ethical justification.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <footer className="border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
            © 2026 CareIntel AI – Intelligent, Ethical, Explainable Healthcare.
          </footer>
        </div>
      </body>
    </html>
  );
}
