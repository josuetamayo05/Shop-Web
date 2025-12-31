import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
    productId: string;
    quantity: number;
};

type CartState = {
    items: CartItem[];

    addToCart: (productId: string, qty?: number, maxQty?: number) => void;
    removeFromCart: (productId: string) => void;
    setQuantity: (productId: string, qty: number, maxQty?: number) => void;
    clearCart: () => void;
};

function normalizeQty(qty: number){
  const n = Number.isFinite(qty) ? Math.floor(qty):1;
  return n
}

function clampQty(qty: number, maxQty?: number){
  if(typeof maxQty==="number" && Number.isFinite(maxQty)){
    return Math.min(qty,Math.floor(maxQty));
  }
  return qty;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (productId, qty = 1, maxQty) => {
        let amount=normalizeQty(qty);
        if(amount<=0)return;

        const items=get().items;
        const existing=items.find((i)=>i.productId===productId);

        const currentQty=existing?.quantity ?? 0;
        const nextQty=clampQty(currentQty+ amount,maxQty);

        // Si ya está al máximo, no cambies nada
        if(nextQty===currentQty) return;
        
        if(!existing){
          set({items: [...items,{productId,quantity: nextQty}]});
          return;
        }
        set({
          items: items.map((i) => i.productId === productId ? { ...i, quantity: nextQty } : i
          ),
        });
      },

      removeFromCart: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      setQuantity: (productId, qty, maxQty) => {
        let amount = normalizeQty(qty);
        amount=clampQty(amount,maxQty)
        
        if(amount<=0){
          set({ items: get().items.filter((i)=>i.productId!==productId)});
          return;
        }

        set({items:get().items.map((i)=>i.productId===productId?{...i,quantity: amount}:i),
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