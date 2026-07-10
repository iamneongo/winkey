"use client";

import React from "react";
import { CartProvider } from "./context/CartContext";
import { MarketplaceHeader } from "./components/marketplace/MarketplaceHeader";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {/* Global Background elements */}
      <div className="bg-glow" />
      <div className="bg-glow-2" />

      {/* Global Navbar */}
      <MarketplaceHeader />

      {/* Page content */}
      <main style={{ flexGrow: 1, minHeight: "80vh" }}>
        {children}
      </main>

      {/* Cart drawer overlay panel */}
      <CartDrawer />

      {/* Global Footer */}
      <Footer />
    </CartProvider>
  );
}
