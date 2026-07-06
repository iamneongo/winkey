import { z } from 'zod';

export const productMutationSchema = z.object({
  name: z.string().trim().min(2, 'Tên sản phẩm cần ít nhất 2 ký tự.'),
  category: z.enum(['windows', 'office', 'combo'], {
    message: 'Danh mục không hợp lệ.'
  }),
  price: z.coerce.number().finite().min(0, 'Giá bán phải lớn hơn hoặc bằng 0.'),
  description: z.string().trim().min(10, 'Mô tả cần ít nhất 10 ký tự.'),
  photo_url: z.string().trim().optional().or(z.literal(''))
});

export const userMutationSchema = z.object({
  first_name: z.string().trim().min(2, 'Tên cần ít nhất 2 ký tự.'),
  last_name: z.string().trim().min(2, 'Họ cần ít nhất 2 ký tự.'),
  email: z.string().trim().email('Email chưa đúng định dạng.'),
  phone: z.string().trim().min(6, 'Số điện thoại chưa hợp lệ.'),
  role: z.string().trim().min(1, 'Hãy chọn vai trò.'),
  status: z.string().trim().min(1, 'Hãy chọn trạng thái.')
});

export const supportRequestSchema = z.object({
  name: z.string().trim().min(2, 'Họ và tên cần ít nhất 2 ký tự.'),
  email: z.string().trim().email('Email chưa đúng định dạng.'),
  issue: z.enum(['windows', 'office', 'payment', 'other'], {
    message: 'Loại yêu cầu không hợp lệ.'
  }),
  message: z.string().trim().min(10, 'Vui lòng mô tả chi tiết hơn.')
});

export const managedUploadDeleteSchema = z.object({
  url: z.string().trim().min(1, 'Thiếu đường dẫn ảnh cần xóa.')
});
