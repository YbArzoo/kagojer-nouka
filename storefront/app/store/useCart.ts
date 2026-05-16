import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  uniqueId: string; // NEW: e.g., "12-4" (Product 12, Variant 4)
  id: number;
  variant_id?: number | null; // NEW: Stores the specific color/size ID
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  // Omit uniqueId when adding, the store will generate it automatically
  addItem: (item: Omit<CartItem, 'uniqueId'>) => void; 
  decreaseItem: (uniqueId: string) => void;
  removeItem: (uniqueId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const currentItems = get().items;
        
        // NEW: Create a unique string identifier for this exact variant
        const uniqueId = `${item.id}-${item.variant_id || 'base'}`;
        
        const existingItem = currentItems.find((i) => i.uniqueId === uniqueId);
        
        if (existingItem) {
          // If the exact same variant is in cart, add the new quantity to the existing quantity
          set({ items: currentItems.map((i) => i.uniqueId === uniqueId ? { ...i, quantity: i.quantity + item.quantity } : i ) });
        } else {
          // Otherwise, add it as a brand new separate line item
          set({ items: [...currentItems, { ...item, uniqueId, quantity: item.quantity }] });
        }
      },

      decreaseItem: (uniqueId) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.uniqueId === uniqueId);
        if (existingItem?.quantity === 1) {
          set({ items: currentItems.filter((i) => i.uniqueId !== uniqueId) });
        } else {
          set({ items: currentItems.map((i) => i.uniqueId === uniqueId ? { ...i, quantity: i.quantity - 1 } : i ) });
        }
      },

      removeItem: (uniqueId) => set({ items: get().items.filter((i) => i.uniqueId !== uniqueId) }),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    { name: 'kagojer-nouka-cart' }
  )
);