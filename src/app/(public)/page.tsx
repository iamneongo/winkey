import React from "react";
import { Hero } from "../components/Hero";
import { BentoFeatures } from "../components/BentoFeatures";
import { ProductList } from "../components/ProductList";
import { ProcessSteps } from "../components/ProcessSteps";
import { Testimonials } from "../components/Testimonials";
import { FAQ } from "../components/FAQ";
import { BottomCta } from "../components/BottomCta";
import { getStorefrontProducts } from "@/lib/catalog";

export default async function Home() {
  const products = await getStorefrontProducts();

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Bento Features Section */}
      <BentoFeatures />

      {/* Store Grid Section */}
      <ProductList products={products} />

      {/* Purchasing Process Steps */}
      <ProcessSteps />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ Accordion */}
      <FAQ />

      {/* Bottom CTA Banner */}
      <BottomCta />
    </>
  );
}
