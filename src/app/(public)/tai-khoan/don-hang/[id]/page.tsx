import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import { getOrderByIdForCustomer } from '@/lib/catalog';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeft, Key, ShoppingBag, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from './copy-button';

export const dynamic = 'force-dynamic';

export default async function CustomerOrderDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/auth/sign-in');

  const { id } = await props.params;
  const orderId = parseInt(id, 10);
  if (isNaN(orderId)) notFound();

  const { rows } = await db.query('SELECT id FROM customers WHERE clerk_id = $1', [userId]);
  const customerId = rows[0]?.id;

  if (!customerId) {
    notFound(); // Customer not found or not linked
  }

  const order = await getOrderByIdForCustomer(orderId, customerId);

  if (!order) {
    notFound(); // Order doesn't belong to this customer or doesn't exist
  }

  let items: { name?: string; product_id?: number; id?: number; quantity: number; price: string | number }[] = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  } catch (e) {
    console.error(e);
  }

  const isPaid = order.payment_status === 'paid';

  return (
    <div>
      <div className="mb-4">
        <Link href="/tai-khoan/don-hang" className="text-sm text-blue-600 flex items-center hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách đơn hàng
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Đặt lúc {new Date(order.created_at).toLocaleString('vi-VN')}
          </p>
        </div>
        <Badge variant={isPaid ? 'default' : (order.payment_status === 'failed' ? 'destructive' : 'secondary')} className="text-sm px-3 py-1">
          {isPaid ? 'Đã thanh toán' : (order.payment_status === 'failed' ? 'Thất bại' : 'Đang xử lý')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* License Key Section */}
          {isPaid && (
            <Card className="border-blue-200 shadow-sm overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-2 text-blue-800">
                <Key className="w-5 h-5" />
                <h2 className="font-semibold text-lg">Khóa Bản Quyền (License Key)</h2>
              </div>
              <CardContent className="p-6">
                {order.license_key ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Sử dụng mã dưới đây để kích hoạt sản phẩm của bạn.</p>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <code className="flex-1 text-lg font-mono font-bold text-center tracking-wider text-gray-800">
                        {order.license_key}
                      </code>
                      <CopyButton text={order.license_key} />
                    </div>
                    <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                      <strong>Hướng dẫn kích hoạt:</strong> Mở phần mềm tương ứng, tìm mục nhập Product Key / License Key và dán mã này vào. Vui lòng bảo mật mã của bạn.
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-yellow-600 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-medium">Hệ thống đang xuất key...</p>
                    <p className="text-sm mt-1">Vui lòng chờ trong giây lát và tải lại trang, hoặc liên hệ hỗ trợ nếu quá lâu.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingBag className="w-5 h-5" />
                Sản phẩm đã mua
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {items.map((item, idx: number) => (
                  <div key={idx} className="py-4 flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name || `Sản phẩm ID: ${item.product_id || item.id || 'N/A'}`}</p>
                      <p className="text-sm text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(Number(item.price))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5" />
                Thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Trạng thái</span>
                <span className="font-medium">{isPaid ? 'Thành công' : order.payment_status}</span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày thanh toán</span>
                  <span className="font-medium">{new Date(order.paid_at).toLocaleString('vi-VN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-medium">{formatCurrency(Number(order.total_amount))}</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="font-bold text-gray-900">Tổng cộng</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(Number(order.total_amount))}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
