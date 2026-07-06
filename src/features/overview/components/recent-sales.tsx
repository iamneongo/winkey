import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProductRecord } from '@/lib/catalog';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);

export function RecentSales({ products }: { products: ProductRecord[] }) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Cập nhật gần đây</CardTitle>
        <CardDescription>Những sản phẩm mới được đồng bộ gần nhất từ cơ sở dữ liệu.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-5'>
          {products.map((product) => (
            <div key={product.id} className='flex items-center gap-3'>
              <div className='relative h-12 w-12 overflow-hidden rounded-xl border bg-muted/40'>
                <Image src={product.photo_url} alt={product.name} fill sizes='48px' className='object-cover' />
              </div>
              <div className='min-w-0 flex-1 space-y-1'>
                <p className='truncate text-sm leading-none font-medium'>{product.name}</p>
                <p className='text-muted-foreground truncate text-xs'>{product.description}</p>
                <p className='text-muted-foreground text-xs capitalize'>{product.category}</p>
              </div>
              <div className='text-right text-sm font-medium'>
                <div>{formatCurrency(product.price)}</div>
                <div className='text-muted-foreground text-xs'>{product.reviews_count} đánh giá</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
