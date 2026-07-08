import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { RegisterButton } from './register-button';
import { PayoutForm } from './payout-form';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '../don-hang/[id]/copy-button'; // Reuse copy button
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCommissionsByAffiliate } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

interface Commission {
  id: number;
  order_id: number;
  amount: string | number;
  status: string;
  created_at: string;
  total_amount: string | number;
}

export default async function AffiliatePage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/auth/sign-in');

  const { rows: affiliates } = await db.query(`
    SELECT a.* FROM affiliates a
    JOIN customers c ON a.customer_id = c.id
    WHERE c.clerk_id = $1
  `, [userId]);

  const affiliate = affiliates[0];

  if (!affiliate) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cộng tác viên (Affiliate)</h1>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-3">Trở thành Đối tác của WinKey</h2>
          <p className="text-blue-800 mb-6 max-w-lg mx-auto">
            Chia sẻ link giới thiệu của bạn và nhận hoa hồng lên tới <strong>10%</strong> cho mỗi đơn hàng mua bản quyền thành công. Đăng ký hoàn toàn miễn phí!
          </p>
          <RegisterButton />
        </div>
      </div>
    );
  }

  if (affiliate.status === 'suspended') {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cộng tác viên</h1>
        <div className="bg-red-50 text-red-800 p-6 rounded-lg border border-red-200">
          <h2 className="text-lg font-bold mb-2">Tài khoản tạm khóa</h2>
          <p>Tài khoản Cộng tác viên của bạn hiện đang bị tạm khóa. Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.</p>
        </div>
      </div>
    );
  }

  // Load commissions
  const commissions: Commission[] = await getCommissionsByAffiliate(affiliate.id);
  const totalEarned = commissions.reduce((sum: number, c: Commission) => sum + Number(c.amount), 0);
  const totalPending = commissions.filter((c: Commission) => c.status === 'pending' || c.status === 'approved').reduce((sum: number, c: Commission) => sum + Number(c.amount), 0);
  const totalPaid = commissions.filter((c: Commission) => c.status === 'paid').reduce((sum: number, c: Commission) => sum + Number(c.amount), 0);

  // Pagination for commissions
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 10;
  const totalPages = Math.ceil(commissions.length / limit);
  const paginatedCommissions = commissions.slice((page - 1) * limit, page * limit);
  
  const hasApprovedCommissions = commissions.some((c: Commission) => c.status === 'approved');
  const refLink = `https://winkey.vn/?ref=${affiliate.referral_code}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard Cộng tác viên</h1>
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
          <span className="text-sm font-medium text-blue-800">Link giới thiệu của bạn:</span>
          <code className="text-blue-900 font-mono font-bold bg-white px-2 py-1 rounded">{refLink}</code>
          <CopyButton text={refLink} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Số dư khả dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(Number(affiliate.balance))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Hoa hồng chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Tổng đã kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalEarned)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Tổng đã rút</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalPaid)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Lịch sử hoa hồng</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Ngày phát sinh</TableHead>
                    <TableHead>Tổng đơn</TableHead>
                    <TableHead>Hoa hồng</TableHead>
                    <TableHead className="text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCommissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Chưa có lịch sử hoa hồng nào. Hãy chia sẻ link giới thiệu của bạn!
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCommissions.map((c: Commission) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">
                          #{c.order_id}
                        </TableCell>
                        <TableCell className="text-sm">{new Date(c.created_at).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell className="text-sm">{formatCurrency(Number(c.total_amount))}</TableCell>
                        <TableCell className="font-semibold text-blue-600">+{formatCurrency(Number(c.amount))}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={
                            c.status === 'paid' ? 'default' : 
                            c.status === 'approved' ? 'outline' : 'secondary'
                          } className={c.status === 'approved' ? 'border-blue-500 text-blue-600' : ''}>
                            {c.status === 'paid' ? 'Đã rút' : c.status === 'approved' ? 'Khả dụng' : 'Chờ duyệt'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <p className="text-sm text-gray-500">
                    Trang {page} / {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild disabled={page <= 1}>
                      <Link href={`/tai-khoan/affiliate?page=${page - 1}`}>Trước</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
                      <Link href={`/tai-khoan/affiliate?page=${page + 1}`}>Sau</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Rút tiền</h2>
          <Card>
            <CardContent className="pt-6">
              {Number(affiliate.balance) <= 0 ? (
                <div className="text-center py-6">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-gray-400">₫</span>
                  </div>
                  <p className="text-gray-500 text-sm">Số dư khả dụng của bạn chưa đủ để thực hiện rút tiền.</p>
                </div>
              ) : !hasApprovedCommissions ? (
                <div className="text-center py-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                  <p className="text-sm">Chưa có khoản hoa hồng nào được duyệt (khả dụng). Xin vui lòng đợi thêm.</p>
                </div>
              ) : (
                <PayoutForm />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
