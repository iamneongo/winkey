import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { getOrdersByCustomer } from '@/lib/catalog';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function CustomerOrders(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/auth/sign-in');

  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || '1', 10);

  const { rows } = await db.query('SELECT id FROM customers WHERE clerk_id = $1', [userId]);
  const customerId = rows[0]?.id;

  if (!customerId) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
          <p>Tài khoản của bạn chưa được liên kết đầy đủ hoặc bạn chưa có đơn hàng nào.</p>
          <p className="text-sm mt-2">Đơn hàng của bạn có thể không hiển thị nếu đặt lúc chưa đăng nhập. Liên hệ hỗ trợ với email nếu bạn cần trợ giúp.</p>
        </div>
      </div>
    );
  }

  const { orders, total, totalPages } = await getOrdersByCustomer(customerId, { page, limit: 10 });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      
      {orders.length === 0 ? (
        <div className="bg-gray-50 text-center py-10 rounded-lg border border-dashed">
          <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào.</p>
          <Button asChild>
            <Link href="/cua-hang">Mua sắm ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: { id: number; created_at: string; items: string | { name?: string; product_id: number; quantity: number }[]; total_amount: string | number; payment_status: string }) => {
                let firstItemName = 'Sản phẩm';
                try {
                  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                  if (items && items.length > 0) {
                    firstItemName = items[0].name || `Sản phẩm ID: ${items[0].product_id || items[0].id || 'N/A'}`;
                    if (items.length > 1) {
                      firstItemName += ` và ${items.length - 1} sản phẩm khác`;
                    }
                  }
                } catch (e) {
                  console.error(e);
                }

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={firstItemName}>{firstItemName}</TableCell>
                    <TableCell className="font-semibold text-[var(--color-signal-blue)]">{formatCurrency(Number(order.total_amount))}</TableCell>
                    <TableCell>
                      <Badge variant={order.payment_status === 'paid' ? 'default' : (order.payment_status === 'failed' ? 'destructive' : 'secondary')}>
                        {order.payment_status === 'paid' ? 'Đã thanh toán' : (order.payment_status === 'failed' ? 'Thất bại' : 'Đang xử lý')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild className="bg-white text-[var(--color-midnight-ink)] hover:bg-gray-50 border-gray-200">
                        <Link href={`/tai-khoan/don-hang/${order.id}`}>Chi tiết</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-gray-500">
                Trang {page} / {totalPages} (Tổng {total} đơn hàng)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild disabled={page <= 1}>
                  <Link href={`/tai-khoan/don-hang?page=${page - 1}`}>Trước</Link>
                </Button>
                <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
                  <Link href={`/tai-khoan/don-hang?page=${page + 1}`}>Sau</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
