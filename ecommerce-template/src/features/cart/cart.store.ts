import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
    productId: string;
    quantity: number;
};

type CartState = {
    items: CartItem[];

    addToCart: (productId: string, qty?: number) => void;
    removeFromCart: (productId: string) => void;
    setQuantity: (productId: string, qty: number) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (productId, qty = 1) => {
        const amount = Number.isFinite(qty) ? Math.floor(qty) : 1;
        if (amount <= 0) return;

        const items = get().items;
        const existing = items.find((i) => i.productId === productId);

        if (!existing) {
          set({ items: [...items, { productId, quantity: amount }] });
          return;
        }

        set({
          items: items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + amount }
              : i
          ),
        });
      },

      removeFromCart: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      setQuantity: (productId, qty) => {
        const amount = Number.isFinite(qty) ? Math.floor(qty) : 1;

        if (amount <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
          return;
        }

        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: amount } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-v1"
    }
  )
);


export const selectCartCount = (s: Pick<CartState, "items">) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);