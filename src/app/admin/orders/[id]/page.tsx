import PageContainer from '@/components/layout/page-container';
import { getOrderById } from '@/lib/catalog';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { StatusSelect } from './status-select';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    notFound();
  }

  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  // Parse items safely
  let items = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    if (!Array.isArray(items)) items = [items];
  } catch (e) {
    console.error('Failed to parse items for order', orderId, e);
  }

  return (
    <PageContainer pageTitle={`Chi tiết đơn hàng #${order.id}`} pageDescription="Quản lý chi tiết giao dịch">
      <div className="mb-4">
        <Link href="/admin/orders" className="text-sm text-blue-600 flex items-center hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách đơn hàng
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Sản phẩm đã đặt</CardTitle>
              <Badge variant={order.payment_status === 'paid' ? 'default' : order.payment_status === 'failed' ? 'destructive' : 'secondary'}>
                {order.payment_status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {items.map((item: { name?: string; product_id: number; quantity: number; price: string | number }, idx: number) => (
                  <div key={idx} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name || `Sản phẩm ID: ${item.product_id}`}</p>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(Number(item.price))}
                    </div>
                  </div>
                ))}
                <div className="py-4 flex justify-between items-center font-bold text-lg">
                  <p>Tổng tiền</p>
                  <p className="text-blue-600">{formatCurrency(Number(order.total_amount))}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bản quyền (License Key)</CardTitle>
            </CardHeader>
            <CardContent>
              {order.license_key ? (
                <div className="p-4 bg-gray-50 border rounded-md font-mono text-center text-lg tracking-wider">
                  {order.license_key}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md text-sm">
                  Chưa có License Key nào được cấp cho đơn hàng này. (Sẽ tự động cấp khi thanh toán thành công).
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thay đổi trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusSelect orderId={order.id} currentStatus={order.payment_status} />
              <p className="text-xs text-gray-500 mt-2">
                Lưu ý: Thay đổi thủ công sẽ không kích hoạt tự động cấp phát key.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Họ tên:</span>{' '}
                <span className="font-medium">{order.customer_name || 'Chưa có tên'}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>{' '}
                <span className="font-medium">{order.customer_email || order.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Điện thoại:</span>{' '}
                <span className="font-medium">{order.customer_phone || '—'}</span>
              </div>
              <div>
                <span className="text-gray-500">Hình thức nhận:</span>{' '}
                <span className="font-medium">
                  {order.delivery_method === 'online'
                    ? 'Kích hoạt online'
                    : order.delivery_method === 'ship-code'
                      ? 'Ship mã bản quyền'
                      : order.delivery_method === 'ship-disk'
                        ? 'Ship đĩa cứng'
                        : '—'}
                </span>
              </div>
              {order.shipping_address && (
                <div>
                  <span className="text-gray-500">Địa chỉ:</span>{' '}
                  <span className="font-medium break-words">{order.shipping_address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Ngày tạo:</span>{' '}
                <span className="font-medium">{new Date(order.created_at).toLocaleString('vi-VN')}</span>
              </div>
              {order.paid_at && (
                <div>
                  <span className="text-gray-500">Ngày thanh toán:</span>{' '}
                  <span className="font-medium">{new Date(order.paid_at).toLocaleString('vi-VN')}</span>
                </div>
              )}
              {order.invoice_reference && (
                <div>
                  <span className="text-gray-500">Mã Invoice:</span>{' '}
                  <span className="font-medium break-all">{order.invoice_reference}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
