'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { Product } from '../api/types';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import { productByIdOptions } from '../api/queries';
import { LicenseKeyManager } from './license-key-manager';

type TProductViewPageProps = {
  productId: string;
};

export default function ProductViewPage({ productId }: TProductViewPageProps) {
  if (productId === 'new') {
    return <ProductForm initialData={null} pageTitle='Tạo sản phẩm mới' />;
  }

  return <EditProductView productId={Number(productId)} />;
}

function EditProductView({ productId }: { productId: number }) {
  const { data } = useSuspenseQuery(productByIdOptions(productId));

  if (!data?.success || !data?.product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProductForm initialData={data.product as Product} pageTitle='Cập nhật sản phẩm' />
      <LicenseKeyManager productId={productId} />
    </div>
  );
}
