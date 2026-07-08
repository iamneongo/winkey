'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

interface QRPaymentScreenProps {
  qrImage: string;
  amount: number;
  orderId: number;
  onSuccess: () => void;
  onTimeout: () => void;
  onCancel: () => void;
}

export function QRPaymentScreen({
  qrImage,
  amount,
  orderId,
  onSuccess,
  onTimeout,
  onCancel
}: QRPaymentScreenProps) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds
  const isPollingRef = useRef(true);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      isPollingRef.current = false;
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  // Polling order status
  useEffect(() => {
    const pollStatus = async () => {
      if (!isPollingRef.current) return;
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.order && data.order.payment_status === 'paid') {
          isPollingRef.current = false;
          onSuccess();
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    const interval = setInterval(pollStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId, onSuccess]);

  const handleCancel = () => {
    if (confirm('Bạn có chắc chắn muốn hủy thanh toán này không? Đơn hàng vẫn được lưu lại.')) {
      onCancel();
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = (timeLeft / 900) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Thanh toán đơn hàng #{orderId}</h2>
        <p className="text-muted-foreground text-sm">
          Mở ứng dụng ngân hàng và quét mã QR bên dưới để thanh toán.
        </p>
      </div>

      <Card className="p-4 bg-white shadow-sm overflow-hidden flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrImage} alt="Mã QR thanh toán" className="max-w-full h-auto object-contain max-h-[350px]" />
      </Card>

      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">Số tiền cần thanh toán</p>
        <p className="text-2xl font-bold text-blue-600">{formatCurrency(amount)}</p>
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Thời gian còn lại</span>
          <span className="font-mono font-medium text-red-500">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleCancel}>
        Hủy thanh toán
      </Button>
    </div>
  );
}
