import PageContainer from '@/components/layout/page-container';
import { getDashboardOverviewData } from '@/lib/catalog';
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { RecentSales } from './recent-sales';

export default async function OverViewPage() {
  const overview = await getDashboardOverviewData();

  return (
    <PageContainer>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <div className='col-span-4'>
          <BarGraph data={overview.categoryBreakdown} />
        </div>
        <div className='col-span-4 md:col-span-3'>
          <RecentSales products={overview.recentProducts} />
        </div>
        <div className='col-span-4'>
          <AreaGraph data={overview.priceComparison} />
        </div>
        <div className='col-span-4 md:col-span-3'>
          <PieGraph data={overview.categoryBreakdown} />
        </div>
      </div>
    </PageContainer>
  );
}
