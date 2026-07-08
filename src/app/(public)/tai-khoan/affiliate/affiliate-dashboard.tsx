'use client';

import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AffiliateDashboard({ affiliate }: { affiliate: { referral_code?: string; balance?: number; commission_rate?: string | number } & Record<string, unknown> }) {
  const refLink = typeof window !== 'undefined' ? `${window.location.origin}?ref=${affiliate.referral_code}` : '';

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(refLink);
      toast.success('Đã copy link giới thiệu');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-500 font-medium mb-1">Tổng hoa hồng</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(affiliate.balance || 0)}</p>
        </div>
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-500 font-medium mb-1">Mức hoa hồng</h3>
          <p className="text-2xl font-bold text-blue-600">{Number(affiliate.commission_rate)}%</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">Link giới thiệu của bạn</h3>
        <p className="text-sm text-gray-600 mb-4">Chia sẻ link này cho bạn bè. Khi họ mua hàng qua link này, bạn sẽ nhận được hoa hồng.</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            readOnly 
            value={refLink} 
            className="flex-1 px-3 py-2 border rounded-md bg-white text-sm"
          />
          <Button onClick={copyToClipboard}>Copy Link</Button>
        </div>
      </div>
    </div>
  );
}
