import type { ReactNode } from "react";
import { Navbar } from "../core/components/Navbar";
import { Footer } from "../core/components/Footer";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}