'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LicenseKeyManagerProps {
  productId: number;
}

export function LicenseKeyManager({ productId }: LicenseKeyManagerProps) {
  const [keysInput, setKeysInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({ total: 0, available: 0, used: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch(`/api/admin/license-keys?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch key stats', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmit = async () => {
    const keysArray = keysInput
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (keysArray.length === 0) {
      toast.error('Vui lòng nhập ít nhất 1 key.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/license-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, keys: keysArray })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Đã thêm thành công ${data.count} key mới.`);
        setKeysInput('');
        fetchStats();
      } else {
        toast.error(data.error || 'Có lỗi xảy ra khi thêm key.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi thêm key.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quản lý Kho Key (License Keys)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingStats ? (
          <p className="text-sm text-gray-500">Đang tải thống kê...</p>
        ) : (
          <div className="flex gap-4 text-sm mb-4">
            <div className="px-3 py-1 bg-gray-100 rounded-md">
              Tổng số: <span className="font-bold">{stats.total}</span>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md">
              Khả dụng: <span className="font-bold">{stats.available}</span>
            </div>
            <div className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md">
              Đã dùng: <span className="font-bold">{stats.used}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Nhập key mới (mỗi key 1 dòng)</label>
          <textarea
            className="w-full min-h-[120px] p-3 border rounded-md text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="XXXX-XXXX-XXXX-XXXX&#10;YYYY-YYYY-YYYY-YYYY"
            value={keysInput}
            onChange={(e) => setKeysInput(e.target.value)}
          />
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting || keysInput.trim().length === 0}>
          {isSubmitting ? 'Đang thêm...' : 'Thêm Key'}
        </Button>
      </CardContent>
    </Card>
  );
}
