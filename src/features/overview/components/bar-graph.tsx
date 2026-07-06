'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

type CategoryChartItem = {
  label: string;
  value: number;
};

const chartConfig = {
  value: {
    label: 'Số lượng',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function BarGraph({ data }: { data: CategoryChartItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Sản phẩm theo danh mục
          <Badge variant='outline'>
            <Icons.product />
            {data.reduce((sum, item) => sum + item.value, 0)}
          </Badge>
        </CardTitle>
        <CardDescription>Phân bổ catalog thật đang hiển thị trên storefront.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-[280px] min-h-[280px] w-full'>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='label' tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='value' fill='var(--color-value)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
