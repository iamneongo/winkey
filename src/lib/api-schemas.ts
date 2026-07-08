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

export const blogMutationSchema = z.object({
  title: z.string().trim().min(2, 'Tiêu đề cần ít nhất 2 ký tự.'),
  slug: z.string().trim().min(2, 'Đường dẫn cần ít nhất 2 ký tự.'),
  content: z.string().trim().min(10, 'Nội dung cần ít nhất 10 ký tự.'),
  cover_url: z.string().trim().optional().or(z.literal('')),
  is_published: z.boolean().default(false)
});

export const orderCreateSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Họ và tên là bắt buộc'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
    deliveryMethod: z.enum(['online', 'ship-code', 'ship-disk']),
    shippingAddress: z.string().optional(),
  }),
  items: z.array(z.any()).min(1, 'Giỏ hàng không được để trống'),
  total: z.number().min(0, 'Tổng tiền không hợp lệ'),
  referral_code: z.string().optional().nullable(),
  clerk_id: z.string().optional().nullable(),
});

