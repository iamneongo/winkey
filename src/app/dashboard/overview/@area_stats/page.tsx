import { AreaGraph } from '@/features/overview/components/area-graph';
import { getDashboardOverviewData } from '@/lib/catalog';

export default async function AreaStats() {
  const overview = await getDashboardOverviewData();
  return <AreaGraph data={overview.priceComparison} />;
}
