import * as z from 'zod';

export const userSchema = z.object({
  first_name: z.string().min(2, 'Tên cần ít nhất 2 ký tự.'),
  last_name: z.string().min(2, 'Họ cần ít nhất 2 ký tự.'),
  email: z.string().email('Email chưa đúng định dạng.'),
  phone: z.string().min(1, 'Hãy nhập số điện thoại.'),
  role: z.string().min(1, 'Hãy chọn vai trò.'),
  status: z.string().min(1, 'Hãy chọn trạng thái.')
});

export type UserFormValues = z.infer<typeof userSchema>;
