'use client';

import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import type { Product } from '@/app/context/CartContext';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
      <button
        className="btn-grad"
        onClick={handleAddToCart}
        style={{
          width: '100%',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '1rem',
          fontWeight: 700,
          borderRadius: '14px',
          textTransform: 'none',
          letterSpacing: '0'
        }}
      >
        <ShoppingCart size={20} />
        <span>Thêm vào giỏ hàng</span>
      </button>

      <button
        onClick={handleBuyNow}
        style={{
          width: '100%',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '1rem',
          fontWeight: 700,
          borderRadius: '14px',
          border: '2px solid var(--color-signal-blue)',
          background: 'transparent',
          color: 'var(--color-signal-blue)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Zap size={20} />
        <span>Mua ngay</span>
      </button>
    </div>
  );
}
