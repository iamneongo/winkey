import { MetadataRoute } from 'next';
import { db, isDatabaseConfigured } from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/catalog';

const BASE_URL = 'https://winkey.vn';

const staticPages: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/cua-hang`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/tin-tuc`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/huong-dan`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/ho-tro`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/chinh-sach-bao-mat`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/dieu-khoan-dich-vu`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamic: MetadataRoute.Sitemap = [];

  try {
    if (isDatabaseConfigured()) {
      await ensureDatabaseReady();

      // Product slugs
      const productsResult = await db.query<{ slug: string; updated_at: Date }>(
        `SELECT slug, updated_at FROM products WHERE is_active = TRUE ORDER BY updated_at DESC`
      );
      for (const row of productsResult.rows) {
        dynamic.push({
          url: `${BASE_URL}/cua-hang/${row.slug}`,
          lastModified: row.updated_at,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }

      // Blog slugs
      const blogsResult = await db.query<{ slug: string; updated_at: Date }>(
        `SELECT slug, updated_at FROM blogs WHERE is_published = TRUE ORDER BY updated_at DESC`
      );
      for (const row of blogsResult.rows) {
        dynamic.push({
          url: `${BASE_URL}/tin-tuc/${row.slug}`,
          lastModified: row.updated_at,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // DB không khả dụng → chỉ trả static pages
  }

  return [...staticPages, ...dynamic];
}
