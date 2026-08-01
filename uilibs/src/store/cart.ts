"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (item: CartItem) => void;
  remove: (slug: string, sizeUk: number, color: string) => void;
  setQty: (slug: string, sizeUk: number, color: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (item) => {
        const items = [...get().items];
        const i = items.findIndex(
          (x) => x.slug === item.slug && x.sizeUk === item.sizeUk && x.color === item.color
        );
        if (i >= 0) {
          items[i] = { ...items[i], qty: items[i].qty + item.qty };
        } else {
          items.push(item);
        }
        set({ items, isOpen: true });
      },
      remove: (slug, sizeUk, color) =>
        set({
          items: get().items.filter(
            (x) => !(x.slug === slug && x.sizeUk === sizeUk && x.color === color)
          ),
        }),
      setQty: (slug, sizeUk, color, qty) => {
        const q = Math.max(1, Math.min(10, Math.floor(qty)));
        set({
          items: get().items.map((x) =>
            x.slug === slug && x.sizeUk === sizeUk && x.color === color
              ? { ...x, qty: q }
              : x
          ),
        });
      },
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      count: () =>
        get().items.reduce((sum, x) => sum + x.qty, 0),
    }),
    { name: "adisa-cart", storage: createJSONStorage(() => localStorage) }
  )
);
