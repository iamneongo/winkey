import type { InfobarContent } from '@/components/ui/infobar';

export const usersInfoContent: InfobarContent = {
  title: 'Quản lý thành viên',
  sections: [
    {
      title: 'Tổng quan',
      description:
        'Trang này dùng React Query kết hợp nuqs để giữ trạng thái lọc, tìm kiếm và phân trang ngay trên URL. Bảng phản hồi nhanh, tải lại trang vẫn giữ nguyên ngữ cảnh.',
      links: [
        {
          title: 'Tài liệu TanStack Query SSR',
          url: 'https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr'
        }
      ]
    },
    {
      title: 'Prefetch ở server, dùng tiếp ở client',
      description:
        'Server nạp sẵn dữ liệu đầu trang rồi truyền xuống client bằng HydrationBoundary. Sau đó client tiếp tục refetch nền để dữ liệu luôn mới mà không làm bảng giật.',
      links: []
    },
    {
      title: 'Giữ trạng thái trên URL',
      description:
        'Phân trang, tìm kiếm và lọc vai trò đều được đồng bộ lên URL. Bạn có thể chia sẻ đúng màn hình đang xem mà không cần thao tác lại từ đầu.',
      links: [
        {
          title: 'Tài liệu nuqs',
          url: 'https://nuqs.47ng.com'
        }
      ]
    },
    {
      title: 'Liên kết với backend thật',
      description:
        'Bảng thành viên hiện đọc và ghi trực tiếp vào PostgreSQL qua Route Handler của Next. Điều này giúp admin và các phần giao diện khác cùng dùng một nguồn dữ liệu rõ ràng, ổn định.',
      links: []
    }
  ]
};
