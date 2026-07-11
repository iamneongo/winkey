import React from "react";
import { MarketplaceSidebar } from "./MarketplaceSidebar";
import { MarketplaceRightPanel } from "./MarketplaceRightPanel";

/**
 * Reusable 3-column marketplace layout:
 *  - left category sidebar
 *  - center content (page-specific children)
 *  - right info sidebar
 *
 * The public layout already provides the page-level <main>, so the center
 * column uses <section> to avoid nested <main> landmarks.
 */
export function MarketplaceShell({
  children,
  activeCategory = null
}: {
  children: React.ReactNode;
  activeCategory?: string | null;
}) {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6 flex gap-5 xl:gap-6">
        {/* Left Sidebar */}
        <MarketplaceSidebar activeCategory={activeCategory} />

        {/* Center content */}
        <section aria-label="Nội dung chính" className="flex-1 min-w-0">
          {children}
        </section>

        {/* Right Sidebar */}
        <MarketplaceRightPanel />
      </div>
    </div>
  );
}
