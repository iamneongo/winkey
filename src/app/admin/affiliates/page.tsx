import PageContainer from '@/components/layout/page-container';
import { getAffiliatesPaginated, getAffiliatesStats } from '@/lib/catalog';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Banknote, History } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAffiliatesPage(props: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || '1', 10);
  const query = searchParams.q || '';

  const stats = await getAffiliatesStats();
  const { affiliates, total, totalPages } = await getAffiliatesPaginated({ page, limit: 20, query });

  return (
    <PageContainer pageTitle="Quản lý Cộng tác viên" pageDescription="Hệ thống Affiliate và Hoa hồng">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng số CTV</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_affiliates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Hoa hồng chờ duyệt & chưa trả</CardTitle>
            <History className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(Number(stats.total_pending))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Đã thanh toán</CardTitle>
            <Banknote className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(Number(stats.total_paid))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách CTV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cộng tác viên</TableHead>
                  <TableHead>Mã giới thiệu</TableHead>
                  <TableHead>Tỉ lệ HH</TableHead>
                  <TableHead>Số dư khả dụng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      Không tìm thấy cộng tác viên nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  affiliates.map((a: { id: number; first_name: string; last_name: string; email: string; referral_code: string; commission_rate: string | number; balance: string | number; status: string }) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="font-medium">{a.first_name} {a.last_name}</div>
                        <div className="text-xs text-muted-foreground">{a.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-blue-600 bg-blue-50/50">
                          {a.referral_code}
                        </Badge>
                      </TableCell>
                      <TableCell>{Number(a.commission_rate)}%</TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        {formatCurrency(Number(a.balance))}
                      </TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'active' ? 'default' : 'secondary'} className={a.status === 'active' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''}>
                          {a.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/affiliates/${a.id}`}>Chi tiết</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Trang {page} / {totalPages} (Tổng {total} CTV)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild disabled={page <= 1}>
                  <Link href={`/admin/affiliates?page=${page - 1}&q=${query}`}>Trước</Link>
                </Button>
                <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
                  <Link href={`/admin/affiliates?page=${page + 1}&q=${query}`}>Sau</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
