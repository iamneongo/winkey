import PageContainer from '@/components/layout/page-container';
import { getAffiliateById, getCommissionsByAffiliate } from '@/lib/catalog';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { AffiliateActions } from './affiliate-actions';

export const dynamic = 'force-dynamic';

export default async function AdminAffiliateDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const affiliateId = parseInt(id, 10);

  if (isNaN(affiliateId)) {
    notFound();
  }

  const affiliate = await getAffiliateById(affiliateId);

  if (!affiliate) {
    notFound();
  }

  const commissions = await getCommissionsByAffiliate(affiliateId);
  const hasApprovedCommissions = commissions.some(c => c.status === 'approved');

  return (
    <PageContainer pageTitle={`Chi tiết CTV: ${affiliate.first_name} ${affiliate.last_name}`} pageDescription="Quản lý đối tác và thanh toán hoa hồng">
      <div className="mb-4">
        <Link href="/admin/affiliates" className="text-sm text-blue-600 flex items-center hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách CTV
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">Email</div>
                  <div className="font-medium">{affiliate.email}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Mã giới thiệu</div>
                  <Badge variant="outline" className="font-mono text-blue-600 bg-blue-50/50">
                    {affiliate.referral_code}
                  </Badge>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Ngày tham gia</div>
                  <div className="font-medium">{new Date(affiliate.created_at).toLocaleString('vi-VN')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử Hoa hồng ({commissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {commissions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">CTV này chưa phát sinh hoa hồng nào.</p>
              ) : (
                <div className="divide-y">
                  {commissions.map((c: { id: number; order_id: number; created_at: string; total_amount: string | number; amount: string | number; status: string }) => (
                    <div key={c.id} className="py-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          <Link href={`/admin/orders/${c.order_id}`} className="hover:underline">
                            Đơn hàng #{c.order_id}
                          </Link>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(c.created_at).toLocaleString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Tổng đơn: {formatCurrency(Number(c.total_amount))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">
                          +{formatCurrency(Number(c.amount))}
                        </div>
                        <div className="mt-1">
                          <Badge variant={
                            c.status === 'paid' ? 'default' : 
                            c.status === 'approved' ? 'outline' : 'secondary'
                          } className={c.status === 'approved' ? 'border-blue-500 text-blue-600' : ''}>
                            {c.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <AffiliateActions 
            affiliateId={affiliate.id}
            initialRate={Number(affiliate.commission_rate)}
            initialStatus={affiliate.status}
            balance={Number(affiliate.balance)}
            hasApprovedCommissions={hasApprovedCommissions}
          />
        </div>
      </div>
    </PageContainer>
  );
}
