import { Product } from "../context/CartContext";

export const PRODUCTS: Product[] = [
  {
    id: "win11pro",
    name: "Windows 11 Professional Retail",
    price: 249000, // 249k VND
    originalPrice: 799000,
    image: "win11pro",
    category: "windows",
    tag: "Bán Chạy Nhất",
    rating: 4.9,
    reviewsCount: 1240,
    features: [
      "Kích hoạt online 100% vĩnh viễn",
      "Hỗ trợ cập nhật Windows Update trọn đời",
      "Kèm link tải trực tiếp từ Microsoft",
      "Hỗ trợ cả bản 32-bit và 64-bit",
      "Bảo hành 1 đổi 1 nhanh chóng"
    ]
  },
  {
    id: "win11home",
    name: "Windows 11 Home Retail License",
    price: 199000,
    originalPrice: 590000,
    image: "win11home",
    category: "windows",
    rating: 4.8,
    reviewsCount: 420,
    features: [
      "Kích hoạt chính hãng vĩnh viễn",
      "Phù hợp cho người dùng cá nhân/gia đình",
      "Link tải ISO sạch từ hãng",
      "Bảo hành trọn đời theo máy",
      "Hỗ trợ cài đặt từ xa miễn phí"
    ]
  },
  {
    id: "win10pro",
    name: "Windows 10 Professional Retail",
    price: 189000,
    originalPrice: 499000,
    image: "win10pro",
    category: "windows",
    tag: "Giá Tốt",
    rating: 4.9,
    reviewsCount: 2310,
    features: [
      "Key Retail chính hãng kích hoạt online",
      "Ổn định nhất cho máy tính văn phòng & gaming",
      "Hỗ trợ nâng cấp lên Windows 11 Pro miễn phí",
      "Bảo hành 1 đổi 1 trọn đời",
      "Nhận key qua Email trong 1-3 phút"
    ]
  },
  {
    id: "office2021",
    name: "Microsoft Office 2021 Pro Plus",
    price: 299000,
    originalPrice: 990000,
    image: "office2021",
    category: "office",
    tag: "Khuyên Dùng",
    rating: 4.9,
    reviewsCount: 1540,
    features: [
      "Bộ công cụ: Word, Excel, PowerPoint, Access...",
      "Kích hoạt online theo tài khoản Microsoft",
      "Bản quyền sử dụng vĩnh viễn",
      "Không phát sinh chi phí duy trì",
      "Hỗ trợ cài đặt Ultraview từ xa"
    ]
  },
  {
    id: "office365",
    name: "Microsoft Office 365 Personal (1 Năm)",
    price: 249000,
    originalPrice: 890000,
    image: "office365",
    category: "office",
    rating: 4.7,
    reviewsCount: 680,
    features: [
      "5 thiết bị sử dụng cùng lúc",
      "Tặng kèm 1TB lưu trữ đám mây OneDrive",
      "Cập nhật tính năng AI Copilot mới nhất",
      "Hỗ trợ Windows, Mac, iPad, iPhone, Android",
      "Kích hoạt trên tài khoản cá nhân chính chủ"
    ]
  },
  {
    id: "combo-pro",
    name: "Combo Siêu Tiết Kiệm: Win 11 Pro + Office 2021",
    price: 449000,
    originalPrice: 1789000,
    image: "combopro",
    category: "combo",
    tag: "Ưu Đãi Đặc Biệt",
    rating: 5.0,
    reviewsCount: 890,
    features: [
      "Combo 2 Key bản quyền chính hãng tốt nhất",
      "Tiết kiệm thêm 20% so với mua lẻ",
      "Bàn giao siêu tốc qua Email/Zalo",
      "Bảo hành trọn đời cả 2 sản phẩm",
      "Hỗ trợ kỹ thuật 24/7 trọn đời"
    ]
  }
];
