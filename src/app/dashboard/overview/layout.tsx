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
import React from 'react';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const overview = await getDashboardOverviewData();

  const stats = [
    {
      title: 'Sản phẩm đang bán',
      value: overview.summary.totalProducts.toLocaleString('vi-VN'),
      change: `${overview.categoryBreakdown[0]?.value ?? 0} Windows`,
      trend: 'up' as const,
      note: `Office: ${overview.categoryBreakdown[1]?.value ?? 0} | Combo: ${overview.categoryBreakdown[2]?.value ?? 0}`
    },
    {
      title: 'Thành viên nội bộ',
      value: overview.summary.totalUsers.toLocaleString('vi-VN'),
      change: `${overview.summary.activeUsers} hoạt động`,
      trend: 'up' as const,
      note: 'Tổng số tài khoản đang được dùng để vận hành hệ thống WinKey.'
    },
    {
      title: 'Giá bán trung bình',
      value: formatCurrency(overview.summary.averagePrice),
      change: formatCurrency(overview.summary.averageOriginalPrice),
      trend: 'up' as const,
      note: 'So sánh giữa giá đang bán và giá niêm yết trung bình của toàn bộ catalog.'
    },
    {
      title: 'Tổng lượt đánh giá',
      value: overview.summary.totalReviews.toLocaleString('vi-VN'),
      change: `${overview.summary.averageRating}/5`,
      trend: 'up' as const,
      note: 'Lấy trực tiếp từ dữ liệu sản phẩm hiện có trong cơ sở dữ liệu.'
    }
  ];

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-2xl font-bold tracking-tight'>Tổng quan WinKey</h2>
          <p className='text-muted-foreground text-sm'>
            Toàn bộ khối thống kê bên dưới đang lấy trực tiếp từ dữ liệu thật trong Postgres.
          </p>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => {
            const TrendIcon = stat.trend === 'up' ? Icons.trendingUp : Icons.trendingDown;

            return (
              <Card key={stat.title} className='@container/card'>
                <CardHeader>
                  <CardDescription>{stat.title}</CardDescription>
                  <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                    {stat.value}
                  </CardTitle>
                  <CardAction>
                    <Badge variant='outline'>
                      <TrendIcon />
                      {stat.change}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className='items-start text-sm text-muted-foreground'>
                  {stat.note}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{sales}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 min-h-0 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
