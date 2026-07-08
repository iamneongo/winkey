'use client';

import { LabelList, Pie, PieChart } from 'recharts';
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

const categoryColors: Record<string, string> = {
  Windows: 'var(--chart-1)',
  Office: 'var(--chart-2)',
  Combo: 'var(--chart-3)'
};

const chartConfig = {
  value: {
    label: 'Số lượng'
  },
  Windows: {
    label: 'Windows',
    color: 'var(--chart-1)'
  },
  Office: {
    label: 'Office',
    color: 'var(--chart-2)'
  },
  Combo: {
    label: 'Combo',
    color: 'var(--chart-3)'
  }
} satisfies ChartConfig;

export function PieGraph({ data }: { data: CategoryChartItem[] }) {
  const chartData = data.map((item) => ({
    label: item.label,
    value: item.value,
    fill: categoryColors[item.label] ?? 'var(--chart-4)'
  }));

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='flex flex-col items-center pb-0'>
        <CardTitle className='flex items-center gap-2'>
          Tỷ trọng catalog
          <Badge variant='outline'>
            <Icons.badgeCheck />
            {chartData.length} nhóm
          </Badge>
        </CardTitle>
        <CardDescription>Tỷ trọng các nhóm sản phẩm hiện được quản lý trong hệ thống.</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center justify-center pb-0'>
        <ChartContainer
          config={chartConfig}
          className='[&_.recharts-text]:fill-background mx-auto h-[280px] min-h-[280px] w-full max-w-[300px]'
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey='value' hideLabel />} />
            <Pie
              data={chartData}
              innerRadius={36}
              dataKey='value'
              nameKey='label'
              cornerRadius={8}
              paddingAngle={4}
            >
              <LabelList
                dataKey='value'
                stroke='none'
                fontSize={12}
                fontWeight={500}
                fill='currentColor'
                formatter={(value: number) => value.toString()}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
