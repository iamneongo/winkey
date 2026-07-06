export type { ProductRecord as Product } from '@/lib/catalog';

export type ProductFilters = {
  page?: number;
  limit?: number;
  categories?: string;
  search?: string;
  sort?: string;
};

export type ProductsResponse = {
  success: boolean;
  time: string;
  message: string;
  total_products: number;
  offset: number;
  limit: number;
  products: import('@/lib/catalog').ProductRecord[];
};

export type ProductByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  product: import('@/lib/catalog').ProductRecord;
};

export type ProductMutationPayload = {
  name: string;
  category: string;
  price: number;
  description: string;
  photo_url?: string;
};
