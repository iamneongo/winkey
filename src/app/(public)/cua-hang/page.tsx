import { getStorefrontProducts } from '@/lib/catalog';
import { StorePageClient } from './store-page-client';

export default async function StorePage() {
  const products = await getStorefrontProducts();
  return <StorePageClient products={products} />;
}
