'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Check, ShoppingCart } from 'lucide-react';
import { Product, useCart } from '../context/CartContext';
import styles from './components.module.css';

interface ProductCardProps {
  product: Product;
  variant?: 'full' | 'compact';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'full' }) => {
  const { addToCart } = useCart();
  const isCompact = variant === 'compact';

  const formatPrice = (num: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(num);

  return (
    <article className={`glass ${styles.prodCard} group flex flex-col gap-4 overflow-hidden p-4 sm:p-5`}>
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(20,90,255,0.08), rgba(0,0,0,0.02)), #ffffff',
          border: '1px solid rgba(0, 0, 0, 0.06)'
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={
            isCompact
              ? '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 220px'
              : '(max-width: 640px) 90vw, (max-width: 1400px) 45vw, (max-width: 1600px) 30vw, 240px'
          }
          className='object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none'
        />
        {product.tag && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '6px 10px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.92)',
              color: 'var(--color-midnight-ink)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.01em'
            }}
          >
            {product.tag}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-midnight-ink)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {product.category === 'windows'
            ? 'Windows'
            : product.category === 'office'
              ? 'Microsoft Office'
              : 'Combo bản quyền'}
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(22, 202, 46, 0.1)',
            color: 'var(--color-emerald-status)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: 700
          }}
        >
          <span style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%' }} />
          <span>Sẵn sàng</span>
        </div>
      </div>

      <div>
        <h3
          className={`${styles.cardTitle} line-clamp-2`}
          style={{ fontSize: isCompact ? '1rem' : '1.2rem', fontWeight: 800, marginBottom: '6px' }}
        >
          {product.name}
        </h3>

        <div className={styles.rating} style={{ marginBottom: '0' }}>
          <div className={styles.ratingStars} style={{ color: '#f59e0b' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                stroke='currentColor'
              />
            ))}
          </div>
          <span className={styles.ratingText} style={{ fontSize: '0.7rem', color: 'var(--color-ash)' }}>
            {product.rating} ({product.reviewsCount} đánh giá)
          </span>
        </div>
      </div>

      {!isCompact && (
        <ul className={styles.featureList} style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, padding: 0 }}>
          {product.features.map((feature) => (
            <li
              key={feature}
              className={styles.featureItem}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none' }}
            >
              <Check size={14} style={{ color: 'var(--color-signal-blue)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(0, 0, 0, 0.06)', paddingTop: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: isCompact ? '12px' : '16px'
          }}
        >
          <span
            style={{
              fontSize: isCompact ? '1.1rem' : '1.45rem',
              fontWeight: 700,
              color: 'var(--color-signal-blue)',
              letterSpacing: '-0.5px'
            }}
          >
            {formatPrice(product.price)}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-ash)', textDecoration: 'line-through' }}>
            {formatPrice(product.originalPrice)}
          </span>
        </div>

        {isCompact ? (
          <button
            type='button'
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
            className='flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={15} aria-hidden='true' />
            <span>Thêm vào giỏ</span>
          </button>
        ) : (
          <button
            className='btn-grad'
            onClick={() => addToCart(product)}
            style={{
              width: '100%',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              textTransform: 'none',
              letterSpacing: '0',
              fontWeight: 600
            }}
          >
            <ShoppingCart size={16} />
            <span>Thêm vào giỏ hàng</span>
          </button>
        )}
      </div>
    </article>
  );
};
