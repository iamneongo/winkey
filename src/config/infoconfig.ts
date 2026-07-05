import type { InfobarContent } from '@/components/ui/infobar';

export const workspacesInfoContent: InfobarContent = {
  title: 'Quản lý không gian làm việc',
  sections: [
    {
      title: 'Tổng quan',
      description:
        'Trang này giúp bạn tạo, đổi và chuyển nhanh giữa các workspace. Mỗi workspace giữ riêng đội ngũ, quyền và phần thiết lập liên quan.',
      links: [
        {
          title: 'Clerk Organizations',
          url: 'https://clerk.com/docs/organizations/overview'
        }
      ]
    },
    {
      title: 'Tạo workspace mới',
      description:
        'Khi cần tách team hoặc dự án, hãy tạo workspace mới rồi gán thành viên vào đúng nơi làm việc của họ. Cách này giúp dữ liệu gọn và dễ phân quyền.',
      links: []
    },
    {
      title: 'Chuyển ngữ cảnh làm việc',
      description:
        'Workspace đang chọn sẽ quyết định những trang và dữ liệu nào được phép truy cập. Nếu thấy tính năng bị ẩn, hãy kiểm tra lại workspace hiện tại trước.',
      links: []
    }
  ]
};

export const teamInfoContent: InfobarContent = {
  title: 'Quản lý nhóm',
  sections: [
    {
      title: 'Tổng quan',
      description:
        'Trang nhóm tập trung cho việc mời thành viên, xem vai trò và quản lý quyền theo workspace. Đây là nơi phù hợp để kiểm soát ai được làm gì.',
      links: [
        {
          title: 'Clerk Organizations',
          url: 'https://clerk.com/docs/organizations/overview'
        }
      ]
    },
    {
      title: 'Vai trò và quyền',
      description:
        'Hãy giữ bộ vai trò ngắn, rõ và gắn với công việc thật. Càng ít vai trò trùng nghĩa, việc quản trị càng dễ và ít sai sót.',
      links: []
    },
    {
      title: 'Điều hướng theo quyền',
      description:
        'Sidebar trong admin đang đọc `src/config/nav-config.ts`. Mục nào có `access` sẽ chỉ hiện khi đúng workspace, đúng vai trò hoặc đúng quyền.',
      links: []
    }
  ]
};

export const billingInfoContent: InfobarContent = {
  title: 'Thanh toán và gói dịch vụ',
  sections: [
    {
      title: 'Tổng quan',
      description:
        'Trang này dùng để theo dõi gói đang dùng, quyền lợi đang mở và phạm vi sử dụng của từng workspace.',
      links: [
        {
          title: 'Clerk Billing',
          url: 'https://clerk.com/docs/billing/overview'
        }
      ]
    },
    {
      title: 'Quản lý gói',
      description:
        'Chỉ nên mở các gói thật sự cần bán. Tên gói, quyền lợi và giới hạn nên được viết ngắn, dễ hiểu và bám sát cách đội ngũ tư vấn với khách hàng.',
      links: []
    },
    {
      title: 'Kiểm soát truy cập',
      description:
        'Plan và feature có thể được dùng để mở khóa chức năng ở cả server và client. Khi có thay đổi về giá hoặc quyền, hãy cập nhật cùng lúc ở logic và nội dung hiển thị.',
      links: []
    }
  ]
};

export const productInfoContent: InfobarContent = {
  title: 'Quản lý sản phẩm',
  sections: [
    {
      title: 'Một nguồn dữ liệu chung',
      description:
        'Danh sách sản phẩm trong admin hiện dùng chung PostgreSQL với storefront. Khi bạn thêm hoặc sửa sản phẩm ở đây, trang bán hàng sẽ đọc lại cùng nguồn dữ liệu đó.',
      links: []
    },
    {
      title: 'Thêm sản phẩm',
      description:
        'Bạn chỉ cần nhập tên, danh mục, giá bán và mô tả. Hệ thống sẽ tự tạo slug, ảnh minh họa theo danh mục và bộ điểm nổi bật mặc định để storefront hiển thị ngay.',
      links: []
    },
    {
      title: 'Sửa và xóa',
      description:
        'Mọi thay đổi đều cập nhật trực tiếp vào PostgreSQL. Sau khi lưu, bảng quản trị và giao diện khách hàng sẽ cùng đọc dữ liệu mới.',
      links: []
    },
    {
      title: 'Lọc và tìm kiếm',
      description:
        'Bảng hỗ trợ lọc theo danh mục, tìm theo tên và phân trang. Dùng cách này khi danh mục sản phẩm bắt đầu nhiều để không phải cuộn quá dài.',
      links: []
    }
  ]
};
