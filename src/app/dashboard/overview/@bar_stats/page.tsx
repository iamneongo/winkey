import { BarGraph } from '@/features/overview/components/bar-graph';
import { getDashboardOverviewData } from '@/lib/catalog';

export default async function BarStats() {
  const overview = await getDashboardOverviewData();
  return <BarGraph data={overview.categoryBreakdown} />;
}
