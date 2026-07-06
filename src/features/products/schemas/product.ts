import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm cần ít nhất 2 ký tự.'),
  category: z.string().min(1, 'Hãy chọn danh mục.'),
  price: z.number({ message: 'Hãy nhập giá bán.' }),
  description: z.string().min(10, 'Mô tả cần ít nhất 10 ký tự.'),
  photo_url: z.string().optional()
});

export type ProductFormValues = {
  name: string;
  category: string;
  price: number | undefined;
  description: string;
  photo_url?: string;
};
