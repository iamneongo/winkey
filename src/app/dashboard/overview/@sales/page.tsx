import { RecentSales } from '@/features/overview/components/recent-sales';
import { getDashboardOverviewData } from '@/lib/catalog';

export default async function Sales() {
  const overview = await getDashboardOverviewData();
  return <RecentSales products={overview.recentProducts} />;
}
