"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: "windows" | "office" | "combo" | string;
  tag?: string;
  rating: number;
  reviewsCount: number;
  reviews_count?: number;
  description?: string;
  features: string[];
  activationDuration?: "lifetime" | "yearly";
  renewalReminder?: boolean;
  supportedDeliveryMethods?: Array<"online" | "ship-code" | "ship-disk">;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartCount: number;
  /** Increments whenever the cart is force-reset (e.g. on sign-out) so consumers can reset their local checkout state. */
  resetSignal: number;
}

const CART_STORAGE_KEY = "win_keys_cart";
const CartContext = createContext<CartContextType | undefined>(undefined);

function persistCart(newCart: CartItem[]) {
  if (typeof window === "undefined") return;
  // Keep storage clean: remove the key entirely when the cart is empty
  if (newCart.length === 0) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } else {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const { isLoaded, userId } = useAuth();
  // `undefined` = auth state not observed yet (avoids treating the first load as a transition).
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
    }
  }, []);

  // Clear the cart when the user transitions from signed-in -> signed-out.
  // We wait for Clerk to be loaded and only act on a real transition, so a guest
  // cart is never wiped just because `isSignedIn` is momentarily undefined on load.
  useEffect(() => {
    if (!isLoaded) return;
    const previousUserId = prevUserIdRef.current;

    if (previousUserId === undefined) {
      // First observed auth state — record it without treating it as a transition.
      prevUserIdRef.current = userId ?? null;
      return;
    }

    if (previousUserId && !userId) {
      setCart([]);
      persistCart([]);
      setIsCartOpen(false);
      setResetSignal((n) => n + 1);
    }

    prevUserIdRef.current = userId ?? null;
  }, [isLoaded, userId]);

  // Keep the in-memory cart in sync across tabs (e.g. sign-out in another tab clears storage).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return;
      if (!event.newValue) {
        setCart([]);
        return;
      }
      try {
        setCart(JSON.parse(event.newValue));
      } catch {
        /* ignore malformed payloads from other tabs */
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    persistCart(newCart);
  };

  const addToCart = (product: Product) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    const newCart =
      existingIndex >= 0
        ? cart.map((item, index) =>
            index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...cart, { product, quantity: 1 }];

    saveCart(newCart);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    saveCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    saveCart(
      cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
        resetSignal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
