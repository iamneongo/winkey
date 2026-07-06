'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

type PriceComparisonItem = {
  name: string;
  salePrice: number;
  listPrice: number;
};

const chartConfig = {
  salePrice: {
    label: 'Giá bán',
    color: 'var(--chart-1)'
  },
  listPrice: {
    label: 'Giá niêm yết',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function AreaGraph({ data }: { data: PriceComparisonItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Giá bán và giá niêm yết
          <Badge variant='outline'>
            <Icons.billing />
            Dữ liệu thật
          </Badge>
        </CardTitle>
        <CardDescription>So sánh các sản phẩm nổi bật theo số lượt đánh giá hiện có.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-[280px] min-h-[280px] w-full'>
          <AreaChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='name'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 10)}
            />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey='listPrice'
              type='natural'
              fill='var(--color-listPrice)'
              fillOpacity={0.18}
              stroke='var(--color-listPrice)'
              strokeWidth={1.5}
            />
            <Area
              dataKey='salePrice'
              type='natural'
              fill='var(--color-salePrice)'
              fillOpacity={0.28}
              stroke='var(--color-salePrice)'
              strokeWidth={1.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
