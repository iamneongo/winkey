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
import { getCommissionsByAffiliate } from '@/lib/catalog';
import { AccountPagination } from '../account-pagination';

export const dynamic = 'force-dynamic';

interface Commission {
  id: number;
  order_id: number;
  amount: string | number;
  status: string;
  created_at: string;
  total_amount: string | number;
}

function commissionStatusMeta(status: string): {
  label: string;
  variant: 'default' | 'outline' | 'secondary';
  className: string;
} {
  if (status === 'paid') return { label: 'Đã rút', variant: 'default', className: '' };
  if (status === 'approved') return { label: 'Khả dụng', variant: 'outline', className: 'border-blue-500 text-blue-600' };
  return { label: 'Chờ duyệt', variant: 'secondary', className: '' };
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
        <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center sm:p-8">
          <h2 className="mb-3 text-xl font-bold text-blue-900 sm:text-2xl">Trở thành Đối tác của WinKey</h2>
          <p className="mx-auto mb-6 max-w-lg text-blue-800">
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
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const limit = 10;
  const totalPages = Math.ceil(commissions.length / limit);
  const paginatedCommissions = commissions.slice((page - 1) * limit, page * limit);
  
  const hasApprovedCommissions = commissions.some((c: Commission) => c.status === 'approved');
  const refLink = `https://winkey.vn/?ref=${affiliate.referral_code}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard Cộng tác viên</h1>
        <div className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center">
          <span className="shrink-0 text-sm font-medium text-blue-800">Link giới thiệu của bạn:</span>
          <code className="min-w-0 flex-1 break-all rounded bg-white px-2 py-1 font-mono text-sm font-bold text-blue-900">{refLink}</code>
          <CopyButton text={refLink} className="w-full shrink-0 sm:w-auto" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Số dư khả dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold break-words text-blue-600 lg:text-2xl">{formatCurrency(Number(affiliate.balance))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Hoa hồng chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold break-words text-yellow-600 lg:text-2xl">{formatCurrency(totalPending)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Tổng đã kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold break-words text-blue-600 lg:text-2xl">{formatCurrency(totalEarned)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Tổng đã rút</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold break-words text-slate-800 lg:text-2xl">{formatCurrency(totalPaid)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <h2 className="text-xl font-bold">Lịch sử hoa hồng</h2>
          <Card>
            <CardContent className="p-0">
              {/* Desktop: table */}
              <div className="hidden overflow-x-auto lg:block">
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
                      paginatedCommissions.map((c: Commission) => {
                        const meta = commissionStatusMeta(c.status);
                        return (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">#{c.order_id}</TableCell>
                            <TableCell className="whitespace-nowrap text-sm">{new Date(c.created_at).toLocaleDateString('vi-VN')}</TableCell>
                            <TableCell className="whitespace-nowrap text-sm">{formatCurrency(Number(c.total_amount))}</TableCell>
                            <TableCell className="whitespace-nowrap font-semibold text-blue-600">+{formatCurrency(Number(c.amount))}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={meta.variant} className={meta.className}>{meta.label}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile / tablet: commission cards */}
              <div className="lg:hidden">
                {paginatedCommissions.length === 0 ? (
                  <p className="px-4 py-8 text-center text-gray-500">
                    Chưa có lịch sử hoa hồng nào. Hãy chia sẻ link giới thiệu của bạn!
                  </p>
                ) : (
                  <ul className="divide-y">
                    {paginatedCommissions.map((c: Commission) => {
                      const meta = commissionStatusMeta(c.status);
                      return (
                        <li key={c.id} className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">#{c.order_id}</span>
                            <Badge variant={meta.variant} className={`shrink-0 ${meta.className}`}>{meta.label}</Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 text-sm">
                            <div className="text-gray-500">
                              <div>Ngày: {new Date(c.created_at).toLocaleDateString('vi-VN')}</div>
                              <div>Tổng đơn: {formatCurrency(Number(c.total_amount))}</div>
                            </div>
                            <div className="text-base font-semibold text-blue-600">+{formatCurrency(Number(c.amount))}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <AccountPagination page={page} totalPages={totalPages} basePath="/tai-khoan/affiliate" />
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
