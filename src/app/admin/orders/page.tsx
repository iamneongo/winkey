import PageContainer from '@/components/layout/page-container';
import { getOrdersPaginated } from '@/lib/catalog';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || '1', 10);
  const q = searchParams.q || '';
  const status = searchParams.status === 'all' ? undefined : (searchParams.status as 'pending' | 'paid' | 'failed' | undefined);

  const { orders, total, totalPages } = await getOrdersPaginated({
    page,
    limit: 20,
    status,
    query: q,
  });

  return (
    <PageContainer pageTitle="Quản lý đơn hàng" pageDescription="Theo dõi và xử lý các đơn hàng">
      <Card className="p-6 space-y-6">
        <form className="flex gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium">Tìm kiếm</label>
            <Input name="q" defaultValue={q} placeholder="Email, Tên hoặc Mã đơn..." />
          </div>
          <div className="w-48 space-y-1">
            <label className="text-sm font-medium">Trạng thái</label>
            <Select name="status" defaultValue={status || 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Lọc</Button>
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                    Không tìm thấy đơn hàng nào.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        {order.first_name} {order.last_name}
                      </div>
                      <div className="text-xs text-gray-500">{order.customer_email}</div>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(Number(order.total_amount))}</TableCell>
                    <TableCell>
                      <Badge variant={order.payment_status === 'paid' ? 'default' : order.payment_status === 'failed' ? 'destructive' : 'secondary'}>
                        {order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/orders/${order.id}`}>Xem chi tiết</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Trang {page} / {totalPages} (Tổng {total} đơn hàng)
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild disabled={page <= 1}>
                <Link href={`/admin/orders?page=${page - 1}&q=${q}&status=${status || 'all'}`}>
                  Trước
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
                <Link href={`/admin/orders?page=${page + 1}&q=${q}&status=${status || 'all'}`}>
                  Sau
                </Link>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
