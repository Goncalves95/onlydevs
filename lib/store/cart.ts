"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  price: number; // in cents
  currency: "CHF" | "EUR";
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

// Cookie-backed storage — NOT localStorage, per spec
const cookieStorage = createJSONStorage(() => ({
  getItem(key: string): string | null {
    return Cookies.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    // 7-day expiry, SameSite=Lax, no Secure flag in dev
    Cookies.set(key, value, {
      expires: 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  },
  removeItem(key: string): void {
    Cookies.remove(key);
  },
}));

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(item) {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem(variantId) {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity(variantId, quantity) {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart() {
        set({ items: [] });
      },

      total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "onlydevs-cart",
      storage: cookieStorage,
      // Only persist items, not computed functions
      partialize: (state) => ({ items: state.items }),
    }
  )
);
