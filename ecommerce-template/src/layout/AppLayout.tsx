import type { ReactNode } from "react";
import { Navbar } from "../core/components/Navbar";
import { Footer } from "../core/components/Footer";
import { useCartStore, selectCartCount } from "../features/cart/cart.store";

export function AppLayout({ children }: { children: ReactNode }) {
  const cartCount = useCartStore(selectCartCount);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar cartCount={cartCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}