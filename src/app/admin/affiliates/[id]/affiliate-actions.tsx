'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  updateCommissionRate,
  updateAffiliateStatus,
  markCommissionsPaid
} from '../actions';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AffiliateActionsProps {
  affiliateId: number;
  initialRate: number;
  initialStatus: string;
  balance: number;
  hasApprovedCommissions: boolean;
}

export function AffiliateActions({
  affiliateId,
  initialRate,
  initialStatus,
  balance,
  hasApprovedCommissions
}: AffiliateActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [rate, setRate] = useState(initialRate.toString());
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();

  const handleSaveRate = async () => {
    const rateNum = Number(rate);
    if (isNaN(rateNum) || rateNum < 1 || rateNum > 50) {
      toast.error('Tỉ lệ hoa hồng phải từ 1 đến 50');
      return;
    }

    startTransition(async () => {
      try {
        await updateCommissionRate(affiliateId, rateNum);
        toast.success('Đã cập nhật tỉ lệ hoa hồng');
        router.refresh();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Lỗi cập nhật hoa hồng';
        toast.error(msg);
      }
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      try {
        await updateAffiliateStatus(affiliateId, newStatus);
        toast.success('Đã cập nhật trạng thái');
        router.refresh();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Lỗi cập nhật trạng thái';
        toast.error(msg);
        setStatus(initialStatus);
      }
    });
  };

  const handlePayout = async () => {
    if (!confirm('Xác nhận đã thanh toán toàn bộ số dư hoa hồng cho CTV này? Thao tác này không thể hoàn tác.')) return;

    startTransition(async () => {
      try {
        await markCommissionsPaid(affiliateId);
        toast.success('Đã xác nhận thanh toán hoa hồng');
        router.refresh();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Lỗi xác nhận thanh toán';
        toast.error(msg);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Tỉ lệ & Trạng thái</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Tỉ lệ hoa hồng (%)</label>
              <Input
                type="number"
                min="1"
                max="50"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                disabled={isPending}
              />
            </div>
            <Button onClick={handleSaveRate} disabled={isPending || Number(rate) === initialRate}>
              Lưu tỉ lệ
            </Button>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">Trạng thái tài khoản</label>
            <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="suspended">Tạm khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thanh toán (Payout)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 border rounded-md text-center">
            <div className="text-sm text-gray-500 mb-1">Số dư khả dụng</div>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(balance)}</div>
          </div>
          
          <Button 
            className="w-full" 
            size="lg" 
            variant="default"
            onClick={handlePayout}
            disabled={isPending || !hasApprovedCommissions || balance <= 0}
          >
            Xác nhận đã thanh toán số dư
          </Button>
          
          {!hasApprovedCommissions && balance > 0 && (
            <p className="text-xs text-red-500 text-center">
              * Chưa có khoản hoa hồng nào được duyệt (approved) để thanh toán.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
