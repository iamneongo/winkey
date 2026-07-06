'use client';

import { useOrganization, PricingTable } from '@clerk/nextjs';
import { Icons } from '@/components/icons';
import PageContainer from '@/components/layout/page-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { billingInfoContent } from '@/config/infoconfig';

export default function BillingPage() {
  const { organization, isLoaded } = useOrganization();

  return (
    <PageContainer
      isLoading={!isLoaded}
      access={!!organization}
      accessFallback={
        <div className='flex min-h-[400px] items-center justify-center'>
          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-semibold'>Chưa chọn tổ chức</h2>
            <p className='text-muted-foreground'>
              Hãy chọn hoặc tạo tổ chức trong Clerk trước khi xem thông tin thanh toán.
            </p>
          </div>
        </div>
      }
      infoContent={billingInfoContent}
      pageTitle='Thanh toán và gói dịch vụ'
      pageDescription={`Quản lý cấu hình thanh toán của tổ chức ${organization?.name ?? ''}`}
    >
      <div className='space-y-6'>
        <Alert>
          <Icons.info className='h-4 w-4' />
          <AlertDescription>
            Trang này dùng Clerk Billing. Nếu WinKey chưa vận hành gói tổ chức, bạn có thể xem đây là khu cấu hình nội bộ chuẩn bị cho giai đoạn sau.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Các gói đang khả dụng</CardTitle>
            <CardDescription>Chọn gói phù hợp với nhu cầu vận hành của tổ chức.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mx-auto max-w-4xl'>
              <PricingTable for='organization' />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
