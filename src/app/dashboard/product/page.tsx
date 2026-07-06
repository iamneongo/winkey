import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Icons } from '@/components/icons';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import ProductListingPage from '@/features/products/components/product-listing';
import { productInfoContent } from '@/config/infoconfig';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'WinKey Admin | Sản phẩm'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Sản phẩm'
      pageDescription='Quản lý danh mục đang hiển thị trên storefront và đồng bộ dữ liệu bán hàng.'
      infoContent={productInfoContent}
      pageHeaderAction={
        <Link href='/admin/product/new' className={cn(buttonVariants(), 'text-xs md:text-sm')}>
          <Icons.add className='mr-2 h-4 w-4' /> Thêm sản phẩm
        </Link>
      }
    >
      <ProductListingPage />
    </PageContainer>
  );
}
