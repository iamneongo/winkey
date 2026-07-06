import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { getDashboardOverviewData } from '@/lib/catalog';
import { AreaGraph } from '@/features/overview/components/area-graph';
import { BarGraph } from '@/features/overview/components/bar-graph';
import { PieGraph } from '@/features/overview/components/pie-graph';
import { RecentSales } from '@/features/overview/components/recent-sales';

export const metadata = {
  title: 'WinKey Admin | Tổng quan'
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);

export default async function AdminOverviewPage() {
  const overview = await getDashboardOverviewData();

  const stats = [
    {
      title: 'Sản phẩm đang bán',
      value: overview.summary.totalProducts.toLocaleString('vi-VN'),
      change: `${overview.categoryBreakdown[0]?.value ?? 0} Windows`,
      note: `Office: ${overview.categoryBreakdown[1]?.value ?? 0} | Combo: ${overview.categoryBreakdown[2]?.value ?? 0}`
    },
    {
      title: 'Thành viên nội bộ',
      value: overview.summary.totalUsers.toLocaleString('vi-VN'),
      change: `${overview.summary.activeUsers} hoạt động`,
      note: 'Bao gồm admin, bán hàng và chăm sóc khách hàng đang vận hành hệ thống.'
    },
    {
      title: 'Giá bán trung bình',
      value: formatCurrency(overview.summary.averagePrice),
      change: formatCurrency(overview.summary.averageOriginalPrice),
      note: 'So sánh giá đang bán với giá niêm yết trung bình của toàn bộ catalog.'
    },
    {
      title: 'Tổng lượt đánh giá',
      value: overview.summary.totalReviews.toLocaleString('vi-VN'),
      change: `${overview.summary.averageRating}/5`,
      note: 'Lấy trực tiếp từ dữ liệu sản phẩm hiện có trong PostgreSQL.'
    }
  ];

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-2xl font-bold tracking-tight'>Tổng quan WinKey</h2>
          <p className='text-muted-foreground text-sm'>
            Toàn bộ số liệu bên dưới đang lấy trực tiếp từ dữ liệu thật của hệ thống.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader>
                <CardDescription>{stat.title}</CardDescription>
                <CardTitle className='text-2xl font-semibold'>{stat.value}</CardTitle>
                <CardAction>
                  <Badge variant='outline'>
                    <Icons.trendingUp />
                    {stat.change}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className='items-start text-sm text-muted-foreground'>
                {stat.note}
              </CardFooter>
            </Card>
          ))}
        </div>

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
      </div>
    </PageContainer>
  );
}
