import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { getOrdersByCustomer } from '@/lib/catalog';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AccountPagination } from '../account-pagination';

export const dynamic = 'force-dynamic';

type RawOrder = {
  id: number;
  created_at: string;
  items: string | { name?: string; product_id?: number; id?: number; quantity: number }[];
  total_amount: string | number;
  payment_status: string;
};

function summariseItems(items: RawOrder['items']): string {
  try {
    const parsed = typeof items === 'string' ? JSON.parse(items) : items;
    if (parsed && parsed.length > 0) {
      let name = parsed[0].name || `Sản phẩm ID: ${parsed[0].product_id || parsed[0].id || 'N/A'}`;
      if (parsed.length > 1) name += ` và ${parsed.length - 1} sản phẩm khác`;
      return name;
    }
  } catch (e) {
    console.error(e);
  }
  return 'Sản phẩm';
}

function statusMeta(status: string): { label: string; variant: 'default' | 'destructive' | 'secondary' } {
  if (status === 'paid') return { label: 'Đã thanh toán', variant: 'default' };
  if (status === 'failed') return { label: 'Thất bại', variant: 'destructive' };
  return { label: 'Đang xử lý', variant: 'secondary' };
}

export default async function CustomerOrders(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/auth/sign-in');

  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);

  const { rows } = await db.query('SELECT id FROM customers WHERE clerk_id = $1', [userId]);
  const customerId = rows[0]?.id;

  if (!customerId) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-bold">Đơn hàng của tôi</h1>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          <p>Tài khoản của bạn chưa được liên kết đầy đủ hoặc bạn chưa có đơn hàng nào.</p>
          <p className="mt-2 text-sm">Đơn hàng của bạn có thể không hiển thị nếu đặt lúc chưa đăng nhập. Liên hệ hỗ trợ với email nếu bạn cần trợ giúp.</p>
        </div>
      </div>
    );
  }

  const { orders, total, totalPages } = await getOrdersByCustomer(customerId, { page, limit: 10 });

  const rowsView = (orders as RawOrder[]).map((order) => ({
    id: order.id,
    date: new Date(order.created_at).toLocaleDateString('vi-VN'),
    name: summariseItems(order.items),
    total: formatCurrency(Number(order.total_amount)),
    status: statusMeta(order.payment_status)
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Đơn hàng của tôi</h1>

      {rowsView.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-gray-50 py-10 text-center">
          <p className="mb-4 text-gray-500">Bạn chưa có đơn hàng nào.</p>
          <Button asChild>
            <Link href="/cua-hang">Mua sắm ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border bg-white">
          {/* Desktop: table */}
          <div className="hidden overflow-x-auto lg:block">
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
                {rowsView.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell className="whitespace-nowrap">{order.date}</TableCell>
                    <TableCell className="max-w-[240px] truncate" title={order.name}>{order.name}</TableCell>
                    <TableCell className="whitespace-nowrap font-semibold text-[var(--color-signal-blue)]">{order.total}</TableCell>
                    <TableCell>
                      <Badge variant={order.status.variant}>{order.status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild className="border-gray-200 bg-white text-[var(--color-midnight-ink)] hover:bg-gray-50">
                        <Link href={`/tai-khoan/don-hang/${order.id}`}>Chi tiết</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile / tablet: order cards */}
          <ul className="divide-y lg:hidden">
            {rowsView.map((order) => (
              <li key={order.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold">#{order.id}</span>
                  <Badge variant={order.status.variant} className="shrink-0">{order.status.label}</Badge>
                </div>
                <p className="mt-2 font-medium break-words text-gray-900">{order.name}</p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                  <div className="text-sm text-gray-500">
                    <span>Ngày đặt: {order.date}</span>
                    <div className="mt-0.5 text-lg font-bold text-[var(--color-signal-blue)]">{order.total}</div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="border-gray-200 bg-white text-[var(--color-midnight-ink)] hover:bg-gray-50">
                    <Link href={`/tai-khoan/don-hang/${order.id}`}>Chi tiết</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <AccountPagination
            page={page}
            totalPages={totalPages}
            basePath="/tai-khoan/don-hang"
            totalLabel={`Trang ${page} / ${totalPages} (Tổng ${total} đơn hàng)`}
          />
        </div>
      )}
    </div>
  );
}
