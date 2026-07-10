import React from "react";
import { getStorefrontProducts } from "@/lib/catalog";
import { MarketplaceSidebar } from "../components/marketplace/MarketplaceSidebar";
import { MarketplaceHero } from "../components/marketplace/MarketplaceHero";
import { FeaturedCategories } from "../components/marketplace/FeaturedCategories";
import { FeaturedProducts } from "../components/marketplace/FeaturedProducts";
import { MarketplaceRightPanel } from "../components/marketplace/MarketplaceRightPanel";

export default async function Home() {
  const products = await getStorefrontProducts();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 flex gap-6">
        {/* Left Sidebar */}
        <MarketplaceSidebar />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <MarketplaceHero />
          <FeaturedCategories />
          <FeaturedProducts products={products} />
        </div>

        {/* Right Sidebar */}
        <MarketplaceRightPanel />
      </div>
    </div>
  );
}
