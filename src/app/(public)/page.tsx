import React from "react";
import { getStorefrontProducts } from "@/lib/catalog";
import { MarketplaceShell } from "../components/marketplace/MarketplaceShell";
import { MarketplaceHero } from "../components/marketplace/MarketplaceHero";
import { FeaturedCategories } from "../components/marketplace/FeaturedCategories";
import { FeaturedProducts } from "../components/marketplace/FeaturedProducts";
import { ComingSoonState } from "../components/marketplace/ComingSoonState";

export default async function Home() {
  const products = await getStorefrontProducts();
  const hasProducts = products.length > 0;

  return (
    <MarketplaceShell>
      {hasProducts ? (
        <>
          <MarketplaceHero />
          <FeaturedCategories />
          <FeaturedProducts products={products} />
        </>
      ) : (
        <ComingSoonState />
      )}
    </MarketplaceShell>
  );
}
