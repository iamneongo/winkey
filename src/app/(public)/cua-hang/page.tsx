import { getStorefrontProducts } from '@/lib/catalog';
import { resolveCategoryParam } from '@/lib/marketplace-categories';
import { MarketplaceShell } from '../../components/marketplace/MarketplaceShell';
import { EmptyProductsState } from '../../components/marketplace/EmptyProductsState';
import { StorePageClient } from './store-page-client';

export default async function StorePage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { activeCategory, label } = resolveCategoryParam(params.category);
  const rawSearch = Array.isArray(params.search) ? params.search[0] : params.search;
  const initialSearch = rawSearch?.trim() ?? '';

  const allProducts = await getStorefrontProducts();
  const products = activeCategory
    ? allProducts.filter((product) => product.category === activeCategory)
    : allProducts;

  return (
    <MarketplaceShell activeCategory={activeCategory}>
      {products.length === 0 ? (
        <EmptyProductsState />
      ) : (
        <StorePageClient
          // Remount when URL params change so the client search state follows the URL.
          key={`${activeCategory ?? 'all'}::${initialSearch}`}
          products={products}
          categoryLabel={label}
          initialSearch={initialSearch}
        />
      )}
    </MarketplaceShell>
  );
}
