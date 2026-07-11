import React from "react";
import { MarketplaceShell } from "../../components/marketplace/MarketplaceShell";
import { ComingSoonState } from "../../components/marketplace/ComingSoonState";

export default async function ComingSoonPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rawTitle = Array.isArray(params.title) ? params.title[0] : params.title;
  const sectionName = rawTitle && rawTitle.trim() !== "" ? rawTitle.trim() : undefined;

  return (
    <MarketplaceShell>
      <ComingSoonState sectionName={sectionName} />
    </MarketplaceShell>
  );
}
