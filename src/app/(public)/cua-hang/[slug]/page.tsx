import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Star, ChevronRight } from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '@/lib/catalog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AddToCartButton } from './add-to-cart-button';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Sản phẩm không tồn tại - WinKey' };
  }

  return {
    title: `${product.name} - WinKey`,
    description: product.description,
    openGraph: {
      title: `${product.name} - WinKey`,
      description: product.description,
      images: product.photo_url ? [{ url: product.photo_url }] : []
    }
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function getCategoryLabel(category: string) {
  if (category === 'windows') return 'Windows';
  if (category === 'office') return 'Microsoft Office';
  return 'Combo bản quyền';
}

function getDiscountPercent(price: number, originalPrice: number) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [product, relatedProducts] = await Promise.all([
    getProductBySlug(slug),
    getProductBySlug(slug).then(async (p) =>
      p ? getRelatedProducts(p.category, slug, 4) : []
    )
  ]);

  if (!product) {
    notFound();
  }

  const discountPercent = getDiscountPercent(product.price, product.original_price);

  const cartProduct = {
    id: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price,
    image: product.photo_url,
    category: (product.category === 'windows' || product.category === 'office' || product.category === 'combo'
      ? product.category
      : 'combo') as 'windows' | 'office' | 'combo',
    tag: product.tag ?? undefined,
    rating: product.rating,
    reviewsCount: product.reviews_count,
    features: product.features,
    activationDuration: (product.slug === 'office365' ? 'yearly' : 'lifetime') as 'yearly' | 'lifetime',
    renewalReminder: product.slug === 'office365',
    supportedDeliveryMethods:
      product.slug === 'office365'
        ? (['online', 'ship-code'] as Array<'online' | 'ship-code' | 'ship-disk'>)
        : (['online', 'ship-code', 'ship-disk'] as Array<'online' | 'ship-code' | 'ship-disk'>)
  };

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px', background: '#fcfcfc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '32px', fontSize: '0.85rem' }}>
          <Link href="/" style={{ color: 'var(--color-ash)', textDecoration: 'none' }}>Trang chủ</Link>
          <ChevronRight size={14} style={{ color: 'var(--color-ash)' }} />
          <Link href="/cua-hang" style={{ color: 'var(--color-ash)', textDecoration: 'none' }}>Cửa hàng</Link>
          <ChevronRight size={14} style={{ color: 'var(--color-ash)' }} />
          <span style={{ color: 'var(--color-midnight-ink)', fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* Main Layout */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
        >
          {/* Left: Image */}
          <div
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(20,90,255,0.06), rgba(0,0,0,0.01)), #ffffff',
              border: '1px solid rgba(0,0,0,0.07)',
              aspectRatio: '4/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <img
              src={product.photo_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {product.tag && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px'
                }}
              >
                <Badge variant="default" style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
                  {product.tag}
                </Badge>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Category + availability */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-midnight-ink)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {getCategoryLabel(product.category)}
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

            {/* Product name */}
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-midnight-ink)',
                lineHeight: 1.25,
                margin: 0
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-ash)' }}>
                {product.rating} ({product.reviews_count} đánh giá)
              </span>
            </div>

            <Separator />

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  color: 'var(--color-signal-blue)',
                  letterSpacing: '-1px'
                }}
              >
                {formatPrice(product.price)}
              </span>
              {product.original_price > product.price && (
                <>
                  <span
                    style={{
                      fontSize: '1.1rem',
                      color: 'var(--color-ash)',
                      textDecoration: 'line-through'
                    }}
                  >
                    {formatPrice(product.original_price)}
                  </span>
                  {discountPercent > 0 && (
                    <Badge variant="destructive" style={{ fontSize: '0.8rem', padding: '3px 10px' }}>
                      -{discountPercent}%
                    </Badge>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.95rem', color: 'var(--color-ash)', lineHeight: 1.7, margin: 0 }}>
              {product.description}
            </p>

            <Separator />

            {/* Features */}
            <div>
              <h3
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--color-midnight-ink)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Tính năng nổi bật
              </h3>
              <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', listStyle: 'none' }}
                  >
                    <Check
                      size={16}
                      style={{
                        color: 'var(--color-signal-blue)',
                        flexShrink: 0,
                        background: 'rgba(37, 99, 235, 0.08)',
                        borderRadius: '50%',
                        padding: '2px'
                      }}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-ash)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Add to cart */}
            <AddToCartButton product={cartProduct} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--color-midnight-ink)',
                marginBottom: '32px'
              }}
            >
              Sản phẩm liên quan
            </h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
            >
              {relatedProducts.map((related) => {
                const relatedDiscount = getDiscountPercent(related.price, related.original_price);
                return (
                  <Link
                    key={related.slug}
                    href={`/cua-hang/${related.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="glass"
                      style={{
                        borderRadius: '16px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          aspectRatio: '16/10',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, rgba(20,90,255,0.06), rgba(0,0,0,0.01)), #ffffff',
                          border: '1px solid rgba(0,0,0,0.06)'
                        }}
                      >
                        <img
                          src={related.photo_url}
                          alt={related.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-midnight-ink)', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                          {related.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-signal-blue)' }}>
                            {formatPrice(related.price)}
                          </span>
                          {relatedDiscount > 0 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-ash)', textDecoration: 'line-through' }}>
                              {formatPrice(related.original_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
