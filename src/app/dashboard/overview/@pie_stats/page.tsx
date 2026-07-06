import { PieGraph } from '@/features/overview/components/pie-graph';
import { getDashboardOverviewData } from '@/lib/catalog';

export default async function Stats() {
  const overview = await getDashboardOverviewData();
  return <PieGraph data={overview.categoryBreakdown} />;
}
