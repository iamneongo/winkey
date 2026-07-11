import { db, isDatabaseConfigured } from '@/lib/db';

export type ProductRecord = {
  id: number;
  slug: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  original_price: number;
  photo_url: string;
  category: string;
  tag: string | null;
  rating: number;
  reviews_count: number;
  features: string[];
  is_active: boolean;
  updated_at: string;
};

export type UserRecord = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
};

type ProductMutationPayload = {
  name: string;
  category: string;
  price: number;
  description: string;
  photo_url?: string;
};

type UserMutationPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
};

type SupportRequestPayload = {
  name: string;
  email: string;
  issue: string;
  message: string;
};

export type BlogRecord = {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogMutationPayload = {
  title: string;
  slug: string;
  content: string;
  cover_url?: string;
  is_published: boolean;
};

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  description: string;
  created_at: Date | string;
  price: number | string;
  original_price: number | string;
  photo_url: string;
  category: string;
  tag: string | null;
  rating: number | string;
  reviews_count: number;
  features: string[];
  is_active: boolean;
  updated_at: Date | string;
};

type UserRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  created_at: Date | string;
  updated_at: Date | string;
};

type BlogRow = {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_url: string;
  is_published: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

const productPhotoMap: Record<string, string> = {
  win11pro: 'https://thesvg.org/icons/windows/default.svg',
  win11home: 'https://thesvg.org/icons/windows/default.svg',
  win10pro: 'https://thesvg.org/icons/windows/default.svg',
  office2021: 'https://thesvg.org/icons/microsoft-office/default.svg',
  office365: 'https://thesvg.org/icons/microsoft-365/default.svg',
  'combo-pro': 'https://thesvg.org/icons/microsoft/default.svg'
};

const seedProducts = [
  {
    slug: 'win11pro',
    name: 'Windows 11 Professional Retail',
    description: 'Bản quyền vĩnh viễn cho máy cá nhân, kỹ thuật viên và doanh nghiệp nhỏ.',
    price: 249000,
    original_price: 799000,
    category: 'windows',
    tag: 'Bán chạy',
    rating: 4.9,
    reviews_count: 1240,
    photo_url: productPhotoMap.win11pro,
    features: [
      'Kích hoạt online vĩnh viễn',
      'Cập nhật Windows Update đầy đủ',
      'Hỗ trợ cài đặt từ xa',
      'Dùng cho 32-bit và 64-bit',
      'Bảo hành 1 đổi 1'
    ]
  },
  {
    slug: 'win11home',
    name: 'Windows 11 Home Retail License',
    description: 'Gói phù hợp cho nhu cầu học tập, làm việc và gia đình.',
    price: 199000,
    original_price: 590000,
    category: 'windows',
    tag: null,
    rating: 4.8,
    reviews_count: 420,
    photo_url: productPhotoMap.win11home,
    features: [
      'Kích hoạt chính hãng',
      'Phù hợp người dùng cá nhân',
      'Link ISO sạch từ Microsoft',
      'Bảo hành theo máy',
      'Hỗ trợ cài đặt miễn phí'
    ]
  },
  {
    slug: 'win10pro',
    name: 'Windows 10 Professional Retail',
    description: 'Lựa chọn ổn định cho máy văn phòng, học tập và gaming.',
    price: 189000,
    original_price: 499000,
    category: 'windows',
    tag: 'Giá tốt',
    rating: 4.9,
    reviews_count: 2310,
    photo_url: productPhotoMap.win10pro,
    features: [
      'Key Retail kích hoạt online',
      'Ổn định cho văn phòng và gaming',
      'Nâng cấp Windows 11 dễ dàng',
      'Bảo hành trọn đời',
      'Nhận key nhanh qua email'
    ]
  },
  {
    slug: 'office2021',
    name: 'Microsoft Office 2021 Pro Plus',
    description: 'Bộ ứng dụng Office đầy đủ cho học tập và công việc lâu dài.',
    price: 299000,
    original_price: 990000,
    category: 'office',
    tag: 'Khuyên dùng',
    rating: 4.9,
    reviews_count: 1540,
    photo_url: productPhotoMap.office2021,
    features: [
      'Word, Excel, PowerPoint, Access',
      'Kích hoạt online theo tài khoản',
      'Bản quyền dùng vĩnh viễn',
      'Không phát sinh phí duy trì',
      'Hỗ trợ cài đặt từ xa'
    ]
  },
  {
    slug: 'office365',
    name: 'Microsoft 365 Personal (1 năm)',
    description: 'Giải pháp thuê bao linh hoạt cho nhiều thiết bị và cập nhật liên tục.',
    price: 249000,
    original_price: 890000,
    category: 'office',
    tag: null,
    rating: 4.7,
    reviews_count: 680,
    photo_url: productPhotoMap.office365,
    features: [
      'Dùng trên nhiều thiết bị',
      'Tặng 1TB OneDrive',
      'Nhận tính năng mới liên tục',
      'Hỗ trợ Windows, Mac, mobile',
      'Kích hoạt trên tài khoản cá nhân'
    ]
  },
  {
    slug: 'combo-pro',
    name: 'Combo Win 11 Pro + Office 2021',
    description: 'Combo tiết kiệm cho người cần đủ hệ điều hành và Office bản quyền.',
    price: 449000,
    original_price: 1789000,
    category: 'combo',
    tag: 'Ưu đãi mạnh',
    rating: 5,
    reviews_count: 890,
    photo_url: productPhotoMap['combo-pro'],
    features: [
      'Gồm 2 key bản quyền',
      'Tiết kiệm hơn mua lẻ',
      'Bàn giao nhanh qua email',
      'Bảo hành trọn đời',
      'Hỗ trợ kỹ thuật 24/7'
    ]
  }
] as const;

const seedUsers = [
  {
    first_name: 'Minh',
    last_name: 'Anh',
    email: 'minhanh@winkey.vn',
    phone: '0901 234 567',
    status: 'Đang hoạt động',
    role: 'Quản trị viên'
  },
  {
    first_name: 'Gia',
    last_name: 'Hân',
    email: 'giahan@winkey.vn',
    phone: '0902 345 678',
    status: 'Đang hoạt động',
    role: 'Chăm sóc khách hàng'
  },
  {
    first_name: 'Quốc',
    last_name: 'Bảo',
    email: 'quocbao@winkey.vn',
    phone: '0903 456 789',
    status: 'Đang hoạt động',
    role: 'Kế toán'
  },
  {
    first_name: 'Phương',
    last_name: 'Linh',
    email: 'phuonglinh@winkey.vn',
    phone: '0904 567 890',
    status: 'Đã mời',
    role: 'Bán hàng'
  }
] as const;

function getSeedProductRecords(): ProductRecord[] {
  const now = new Date().toISOString();

  return seedProducts.map((product, index) => ({
    id: index + 1,
    slug: product.slug,
    name: product.name,
    description: product.description,
    created_at: now,
    price: product.price,
    original_price: product.original_price,
    photo_url: product.photo_url,
    category: product.category,
    tag: product.tag,
    rating: product.rating,
    reviews_count: product.reviews_count,
    features: [...product.features],
    is_active: true,
    updated_at: now
  }));
}

function getSeedUserRecords(): UserRecord[] {
  const now = new Date().toISOString();

  return seedUsers.map((user, index) => ({
    id: index + 1,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    role: user.role,
    created_at: now,
    updated_at: now
  }));
}

function mapStorefrontProduct(product: ProductRecord) {
  return {
    id: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price,
    image: product.photo_url,
    category: (product.category === 'windows' ||
    product.category === 'office' ||
    product.category === 'combo'
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
}

function getFallbackOverviewData() {
  const products = getSeedProductRecords();
  const users = getSeedUserRecords();

  const categoryCounts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  const activeUsers = users.filter((user) => user.status === 'Đang hoạt động').length;
  const averagePrice = products.length
    ? Math.round(products.reduce((sum, product) => sum + product.price, 0) / products.length)
    : 0;
  const averageOriginalPrice = products.length
    ? Math.round(products.reduce((sum, product) => sum + product.original_price, 0) / products.length)
    : 0;
  const totalReviews = products.reduce((sum, product) => sum + product.reviews_count, 0);
  const averageRating = products.length
    ? Number(
        (
          products.reduce((sum, product) => sum + product.rating, 0) / products.length
        ).toFixed(1)
      )
    : 0;

  const topProducts = [...products]
    .sort((left, right) => right.reviews_count - left.reviews_count)
    .slice(0, 6);

  return {
    summary: {
      totalProducts: products.length,
      totalUsers: users.length,
      activeUsers,
      averagePrice,
      averageOriginalPrice,
      totalReviews,
      averageRating
    },
    categoryBreakdown: [
      { label: 'Windows', value: categoryCounts.windows ?? 0 },
      { label: 'Office', value: categoryCounts.office ?? 0 },
      { label: 'Combo', value: categoryCounts.combo ?? 0 }
    ],
    priceComparison: topProducts.map((product) => ({
      name: product.name
        .replace('Microsoft ', '')
        .replace('Professional ', 'Pro ')
        .replace('Retail', '')
        .trim(),
      salePrice: product.price,
      listPrice: product.original_price
    })),
    recentProducts: products.slice(0, 5)
  };
}

function mapBlog(row: BlogRow): BlogRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    cover_url: row.cover_url ?? '',
    is_published: row.is_published,
    created_at: toIsoString(row.created_at),
    updated_at: toIsoString(row.updated_at)
  };
}

let initPromise: Promise<void> | null = null;

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapProduct(row: ProductRow): ProductRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    created_at: toIsoString(row.created_at),
    price: Number(row.price),
    original_price: Number(row.original_price),
    photo_url: row.photo_url,
    category: row.category,
    tag: row.tag,
    rating: Number(row.rating),
    reviews_count: row.reviews_count,
    features: row.features,
    is_active: row.is_active,
    updated_at: toIsoString(row.updated_at)
  };
}

function mapUser(row: UserRow): UserRecord {
  return {
    ...row,
    created_at: toIsoString(row.created_at),
    updated_at: toIsoString(row.updated_at)
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function hasBrokenEncoding(value?: string | null) {
  return Boolean(value && /[ÃÄÂ]/.test(value));
}

function getProductPhoto(category: string, slug?: string) {
  if (slug && productPhotoMap[slug]) {
    return productPhotoMap[slug];
  }

  if (category === 'windows') return productPhotoMap.win11pro;
  if (category === 'office') return productPhotoMap.office2021;
  return productPhotoMap['combo-pro'];
}

function getDefaultFeatures(category: string) {
  if (category === 'windows') {
    return [
      'Kích hoạt online nhanh',
      'Bản quyền ổn định',
      'Hỗ trợ cài đặt từ xa',
      'Dùng lâu dài',
      'Giao key qua email'
    ];
  }

  if (category === 'office') {
    return [
      'Bộ ứng dụng đầy đủ',
      'Cài đặt đơn giản',
      'Hỗ trợ tài khoản Microsoft',
      'Dùng ổn định',
      'Có hỗ trợ kỹ thuật'
    ];
  }

  return [
    'Tiết kiệm hơn mua lẻ',
    'Bàn giao nhanh',
    'Gồm nhiều gói bản quyền',
    'Bảo hành rõ ràng',
    'Có hỗ trợ sau bán'
  ];
}

async function getUniqueSlug(name: string, ignoreId?: number) {
  const baseSlug = slugify(name) || 'san-pham';
  let candidate = baseSlug;
  let attempt = 1;

  while (true) {
    const { rows } = await db.query<{ id: number }>(
      `SELECT id
       FROM products
       WHERE slug = $1
         AND ($2::int IS NULL OR id <> $2)
       LIMIT 1`,
      [candidate, ignoreId ?? null]
    );

    if (rows.length === 0) return candidate;

    attempt += 1;
    candidate = `${baseSlug}-${attempt}`;
  }
}

export async function ensureDatabaseReady() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL,
        price NUMERIC(12, 2) NOT NULL,
        original_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
        photo_url TEXT NOT NULL,
        tag TEXT,
        rating NUMERIC(3, 2) NOT NULL DEFAULT 5,
        reviews_count INTEGER NOT NULL DEFAULT 0,
        features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        status TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS guides (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        category TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_published BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_notifications (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT,
        ref_id INTEGER,
        ref_type TEXT,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS support_requests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        issue TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        cover_url TEXT,
        is_published BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        clerk_id TEXT UNIQUE,
        first_name TEXT,
        last_name TEXT,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Migration: make clerk_id nullable for existing DBs and add phone column
    await db.query(`
      DO $$ BEGIN
        ALTER TABLE customers ALTER COLUMN clerk_id DROP NOT NULL;
      EXCEPTION WHEN OTHERS THEN NULL;
      END $$;
    `);
    await db.query(`
      DO $$ BEGIN
        ALTER TABLE customers ADD COLUMN phone TEXT;
      EXCEPTION WHEN duplicate_column THEN NULL;
      END $$;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS affiliates (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
        referral_code VARCHAR(50) UNIQUE NOT NULL,
        commission_rate DECIMAL(5,2) DEFAULT 10.00,
        balance DECIMAL(12,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS payout_requests (
        id SERIAL PRIMARY KEY,
        affiliate_id INTEGER REFERENCES affiliates(id),
        amount NUMERIC(12,2) NOT NULL,
        bank_name TEXT NOT NULL,
        bank_account TEXT NOT NULL,
        account_name TEXT NOT NULL,
        note TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
        affiliate_id INTEGER REFERENCES affiliates(id) ON DELETE SET NULL,
        total_amount NUMERIC(12, 2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        items JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS commissions (
        id SERIAL PRIMARY KEY,
        affiliate_id INTEGER REFERENCES affiliates(id) ON DELETE CASCADE,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        amount NUMERIC(12, 2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Payment columns on orders (idempotent ALTERs)
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'onepay'`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS onepay_user_reference TEXT`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS onepay_user_id TEXT`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS onepay_invoice_reference TEXT`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS onepay_invoice_id TEXT`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending'`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS license_key_id INTEGER`);
    // Store the recipient details on each order. Customer records are mutable
    // profile data and must not rewrite the historical details of older orders.
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_method TEXT`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT`);
    await db.query(`
      UPDATE orders o
      SET customer_name = NULLIF(TRIM(CONCAT_WS(' ', c.first_name, c.last_name)), ''),
          customer_email = c.email,
          customer_phone = c.phone
      FROM customers c
      WHERE o.customer_id = c.id
        AND (o.customer_name IS NULL OR o.customer_email IS NULL)
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
        fund_transfer_id TEXT UNIQUE NOT NULL,
        bank_txn_ref TEXT,
        amount NUMERIC(12, 2) NOT NULL,
        raw_payload JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS license_keys (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        key_value TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'available',
        order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
        assigned_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_notifications (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT,
        ref_id INTEGER,
        ref_type TEXT,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS payout_requests (
        id SERIAL PRIMARY KEY,
        affiliate_id INTEGER REFERENCES affiliates(id) ON DELETE CASCADE,
        amount NUMERIC(12, 2) NOT NULL,
        bank_name TEXT NOT NULL,
        bank_account TEXT NOT NULL,
        account_name TEXT NOT NULL,
        note TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const productCount = await db.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM products');
    if (Number(productCount.rows[0]?.count ?? 0) === 0) {
      for (const product of seedProducts) {
        await db.query(
          `INSERT INTO products (
             slug, name, description, category, price, original_price,
             photo_url, tag, rating, reviews_count, features
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            product.slug,
            product.name,
            product.description,
            product.category,
            product.price,
            product.original_price,
            product.photo_url,
            product.tag,
            product.rating,
            product.reviews_count,
            product.features
          ]
        );
      }
    }

    const userCount = await db.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM users');
    if (Number(userCount.rows[0]?.count ?? 0) === 0) {
      for (const user of seedUsers) {
        await db.query(
          `INSERT INTO users (first_name, last_name, email, phone, status, role)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [user.first_name, user.last_name, user.email, user.phone, user.status, user.role]
        );
      }
    }

    const existingProducts = await db.query<{
      id: number;
      slug: string;
      name: string;
      photo_url: string;
      description: string;
      tag: string | null;
      features: string[];
    }>('SELECT id, slug, name, photo_url, description, tag, features FROM products');

    for (const row of existingProducts.rows) {
      const seed = seedProducts.find((item) => item.slug === row.slug);
      if (!seed) continue;

      const needsPhotoRefresh =
        !row.photo_url ||
        row.photo_url.includes('slingacademy.com') ||
        row.photo_url.includes('thesvg.org');

      const needsTextRefresh =
        hasBrokenEncoding(row.name) ||
        hasBrokenEncoding(row.description) ||
        hasBrokenEncoding(row.tag) ||
        row.features.some((feature) => hasBrokenEncoding(feature));

      if (!needsPhotoRefresh && !needsTextRefresh) continue;

      await db.query(
        `UPDATE products
         SET name = $2,
             description = $3,
             photo_url = $4,
             tag = $5,
             rating = $6,
             reviews_count = $7,
             features = $8,
             updated_at = NOW()
         WHERE id = $1`,
        [
          row.id,
          seed.name,
          seed.description,
          needsPhotoRefresh ? seed.photo_url : row.photo_url,
          seed.tag,
          seed.rating,
          seed.reviews_count,
          seed.features
        ]
      );
    }

    const existingUsers = await db.query<{
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      status: string;
      role: string;
    }>('SELECT id, email, first_name, last_name, status, role FROM users');

    for (const row of existingUsers.rows) {
      const seed = seedUsers.find((item) => item.email === row.email);
      if (!seed) continue;

      const needsRefresh =
        hasBrokenEncoding(row.first_name) ||
        hasBrokenEncoding(row.last_name) ||
        hasBrokenEncoding(row.status) ||
        hasBrokenEncoding(row.role);

      if (!needsRefresh) continue;

      await db.query(
        `UPDATE users
         SET first_name = $2,
             last_name = $3,
             status = $4,
             role = $5,
             updated_at = NOW()
         WHERE id = $1`,
        [row.id, seed.first_name, seed.last_name, seed.status, seed.role]
      );
    }
  })();

  return initPromise;
}

function parseMultiValue(value?: string | string[]) {
  if (!value) return [];
  const items = Array.isArray(value) ? value : String(value).split(/[.,]/);
  return items.map((item) => item.trim()).filter(Boolean);
}

function parseProductSort(sort?: string) {
  if (!sort) return 'ORDER BY updated_at DESC';

  try {
    const parsed = JSON.parse(sort) as Array<{ id: string; desc: boolean }>;
    const first = parsed[0];
    const columnMap: Record<string, string> = {
      id: 'id',
      name: 'name',
      category: 'category',
      price: 'price',
      created_at: 'created_at',
      updated_at: 'updated_at'
    };
    const column = first ? columnMap[first.id] : null;
    return column ? `ORDER BY ${column} ${first.desc ? 'DESC' : 'ASC'}` : 'ORDER BY updated_at DESC';
  } catch {
    return 'ORDER BY updated_at DESC';
  }
}

function parseUserSort(sort?: string) {
  if (!sort) return 'ORDER BY updated_at DESC';

  try {
    const parsed = JSON.parse(sort) as Array<{ id: string; desc: boolean }>;
    const first = parsed[0];
    const columnMap: Record<string, string> = {
      id: 'id',
      name: 'first_name',
      phone: 'phone',
      role: 'role',
      status: 'status',
      created_at: 'created_at',
      updated_at: 'updated_at'
    };
    const column = first ? columnMap[first.id] : null;
    return column ? `ORDER BY ${column} ${first.desc ? 'DESC' : 'ASC'}` : 'ORDER BY updated_at DESC';
  } catch {
    return 'ORDER BY updated_at DESC';
  }
}

export async function getProductsFromDb({
  page = 1,
  limit = 10,
  categories,
  search,
  sort
}: {
  page?: number;
  limit?: number;
  categories?: string | string[];
  search?: string;
  sort?: string;
}) {
  await ensureDatabaseReady();

  const values: Array<string | number | string[]> = [];
  const conditions: string[] = ['is_active = TRUE'];
  const categoryFilters = parseMultiValue(categories);

  if (categoryFilters.length > 0) {
    values.push(categoryFilters);
    conditions.push(`category = ANY($${values.length}::text[])`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(name ILIKE $${values.length} OR description ILIKE $${values.length} OR category ILIKE $${values.length})`
    );
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;
  const offset = (page - 1) * limit;
  const totalQuery = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM products ${whereClause}`,
    values
  );

  values.push(limit, offset);
  const productQuery = await db.query<ProductRow>(
    `SELECT *
     FROM products
     ${whereClause}
     ${parseProductSort(sort)}
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Đã tải danh sách sản phẩm.',
    total_products: Number(totalQuery.rows[0]?.count ?? 0),
    offset,
    limit,
    products: productQuery.rows.map((row) => mapProduct(row))
  };
}

export async function getProductByIdFromDb(id: number) {
  await ensureDatabaseReady();

  const result = await db.query<ProductRow>('SELECT * FROM products WHERE id = $1 LIMIT 1', [id]);
  if (result.rows.length === 0) {
    return {
      success: false,
      message: `Không tìm thấy sản phẩm #${id}.`
    };
  }

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Đã tải chi tiết sản phẩm.',
    product: mapProduct(result.rows[0])
  };
}

export async function createProductInDb(data: ProductMutationPayload) {
  await ensureDatabaseReady();

  const slug = await getUniqueSlug(data.name);
  const result = await db.query<ProductRow>(
    `INSERT INTO products (
       slug, name, description, category, price, original_price,
       photo_url, tag, rating, reviews_count, features
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, 5, 0, $8)
     RETURNING *`,
    [
      slug,
      data.name,
      data.description,
      data.category,
      data.price,
      Math.round(data.price * 2.4),
      data.photo_url?.trim() || getProductPhoto(data.category, slug),
      getDefaultFeatures(data.category)
    ]
  );

  return {
    success: true,
    message: 'Đã tạo sản phẩm mới.',
    product: mapProduct(result.rows[0])
  };
}

export async function updateProductInDb(id: number, data: ProductMutationPayload) {
  await ensureDatabaseReady();

  const existing = await db.query<{ id: number }>('SELECT id FROM products WHERE id = $1 LIMIT 1', [id]);
  if (existing.rows.length === 0) {
    return {
      success: false,
      message: `Không tìm thấy sản phẩm #${id}.`
    };
  }

  const slug = await getUniqueSlug(data.name, id);
  const result = await db.query<ProductRow>(
    `UPDATE products
     SET slug = $2,
         name = $3,
         description = $4,
         category = $5,
         price = $6,
         photo_url = $7,
         features = $8,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      slug,
      data.name,
      data.description,
      data.category,
      data.price,
      data.photo_url?.trim() || getProductPhoto(data.category, slug),
      getDefaultFeatures(data.category)
    ]
  );

  return {
    success: true,
    message: 'Đã cập nhật sản phẩm.',
    product: mapProduct(result.rows[0])
  };
}

export async function deleteProductInDb(id: number) {
  await ensureDatabaseReady();

  const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  if (result.rows.length === 0) {
    return {
      success: false,
      message: `Không tìm thấy sản phẩm #${id}.`
    };
  }

  return {
    success: true,
    message: 'Đã xóa sản phẩm.'
  };
}

export async function getUsersFromDb({
  page = 1,
  limit = 10,
  roles,
  search,
  sort
}: {
  page?: number;
  limit?: number;
  roles?: string | string[];
  search?: string;
  sort?: string;
}) {
  await ensureDatabaseReady();

  const values: Array<string | number | string[]> = [];
  const conditions: string[] = [];
  const roleFilters = parseMultiValue(roles);

  if (roleFilters.length > 0) {
    values.push(roleFilters);
    conditions.push(`role = ANY($${values.length}::text[])`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(first_name ILIKE $${values.length} OR last_name ILIKE $${values.length} OR email ILIKE $${values.length} OR phone ILIKE $${values.length})`
    );
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;
  const totalQuery = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM users ${whereClause}`,
    values
  );

  values.push(limit, offset);
  const userQuery = await db.query<UserRow>(
    `SELECT *
     FROM users
     ${whereClause}
     ${parseUserSort(sort)}
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  return {
    success: true,
    time: new Date().toISOString(),
    message: 'Đã tải danh sách nhân sự.',
    total_users: Number(totalQuery.rows[0]?.count ?? 0),
    offset,
    limit,
    users: userQuery.rows.map((row) => mapUser(row))
  };
}

export async function createUserInDb(data: UserMutationPayload) {
  await ensureDatabaseReady();

  const result = await db.query<UserRow>(
    `INSERT INTO users (first_name, last_name, email, phone, role, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.first_name, data.last_name, data.email, data.phone, data.role, data.status]
  );

  return {
    success: true,
    message: 'Đã thêm thành viên mới.',
    user: mapUser(result.rows[0])
  };
}

export async function updateUserInDb(id: number, data: UserMutationPayload) {
  await ensureDatabaseReady();

  const result = await db.query<UserRow>(
    `UPDATE users
     SET first_name = $2,
         last_name = $3,
         email = $4,
         phone = $5,
         role = $6,
         status = $7,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, data.first_name, data.last_name, data.email, data.phone, data.role, data.status]
  );

  if (result.rows.length === 0) {
    return {
      success: false,
      message: `Không tìm thấy người dùng #${id}.`
    };
  }

  return {
    success: true,
    message: 'Đã cập nhật thông tin thành viên.',
    user: mapUser(result.rows[0])
  };
}

export async function deleteUserInDb(id: number) {
  await ensureDatabaseReady();

  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  if (result.rows.length === 0) {
    return {
      success: false,
      message: `Không tìm thấy người dùng #${id}.`
    };
  }

  return {
    success: true,
    message: 'Đã xóa thành viên.'
  };
}

export async function createSupportRequestInDb(data: SupportRequestPayload) {
  await ensureDatabaseReady();

  const result = await db.query<{ id: number; created_at: Date | string }>(
    `INSERT INTO support_requests (name, email, issue, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    [data.name, data.email, data.issue, data.message]
  );

  return {
    success: true,
    message: 'Đã ghi nhận yêu cầu hỗ trợ.',
    request: {
      id: result.rows[0].id,
      created_at: toIsoString(result.rows[0].created_at)
    }
  };
}

export async function getDashboardOverviewData() {
  if (!isDatabaseConfigured()) {
    return getFallbackOverviewData();
  }

  try {
    await ensureDatabaseReady();

  const [productResult, userResult] = await Promise.all([
    db.query<ProductRow>('SELECT * FROM products WHERE is_active = TRUE ORDER BY updated_at DESC'),
    db.query<UserRow>('SELECT * FROM users ORDER BY updated_at DESC')
  ]);

  const products = productResult.rows.map((row) => mapProduct(row));
  const users = userResult.rows.map((row) => mapUser(row));

  const categoryCounts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  const activeUsers = users.filter((user) => user.status === 'Đang hoạt động').length;
  const averagePrice = products.length
    ? Math.round(products.reduce((sum, product) => sum + product.price, 0) / products.length)
    : 0;
  const averageOriginalPrice = products.length
    ? Math.round(products.reduce((sum, product) => sum + product.original_price, 0) / products.length)
    : 0;
  const totalReviews = products.reduce((sum, product) => sum + product.reviews_count, 0);
  const averageRating = products.length
    ? Number(
        (
          products.reduce((sum, product) => sum + product.rating, 0) / products.length
        ).toFixed(1)
      )
    : 0;

  const topProducts = [...products]
    .sort((left, right) => right.reviews_count - left.reviews_count)
    .slice(0, 6);

    return {
    summary: {
      totalProducts: products.length,
      totalUsers: users.length,
      activeUsers,
      averagePrice,
      averageOriginalPrice,
      totalReviews,
      averageRating
    },
    categoryBreakdown: [
      { label: 'Windows', value: categoryCounts.windows ?? 0 },
      { label: 'Office', value: categoryCounts.office ?? 0 },
      { label: 'Combo', value: categoryCounts.combo ?? 0 }
    ],
    priceComparison: topProducts.map((product) => ({
      name: product.name
        .replace('Microsoft ', '')
        .replace('Professional ', 'Pro ')
        .replace('Retail', '')
        .trim(),
      salePrice: product.price,
      listPrice: product.original_price
    })),
    recentProducts: products.slice(0, 5)
    };
  } catch (error) {
    console.error('Falling back to seed overview data because the database is unavailable.', error);
    return getFallbackOverviewData();
  }
}

export async function getStorefrontProducts() {
  if (!isDatabaseConfigured()) {
    return getSeedProductRecords().map(mapStorefrontProduct);
  }

  try {
    const data = await getProductsFromDb({ page: 1, limit: 100 });

    return data.products.map((product) => mapStorefrontProduct(product));
  } catch (error) {
    console.error('Falling back to seed storefront products because the database is unavailable.', error);
    return getSeedProductRecords().map(mapStorefrontProduct);
  }
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  if (!isDatabaseConfigured()) {
    const seed = getSeedProductRecords().find((p) => p.slug === slug && p.is_active);
    return seed ?? null;
  }

  try {
    await ensureDatabaseReady();
    const result = await db.query<ProductRow>(
      'SELECT * FROM products WHERE slug = $1 AND is_active = TRUE LIMIT 1',
      [slug]
    );
    if (result.rows.length === 0) return null;
    return mapProduct(result.rows[0]);
  } catch (error) {
    console.error('Failed to get product by slug, falling back to seed data.', error);
    const seed = getSeedProductRecords().find((p) => p.slug === slug && p.is_active);
    return seed ?? null;
  }
}

export async function getRelatedProducts(category: string, excludeSlug: string, limit = 4): Promise<ProductRecord[]> {
  if (!isDatabaseConfigured()) {
    return getSeedProductRecords()
      .filter((p) => p.category === category && p.slug !== excludeSlug && p.is_active)
      .slice(0, limit);
  }

  try {
    await ensureDatabaseReady();
    const result = await db.query<ProductRow>(
      'SELECT * FROM products WHERE category = $1 AND slug <> $2 AND is_active = TRUE ORDER BY reviews_count DESC LIMIT $3',
      [category, excludeSlug, limit]
    );
    return result.rows.map(mapProduct);
  } catch (error) {
    console.error('Failed to get related products, falling back to seed data.', error);
    return getSeedProductRecords()
      .filter((p) => p.category === category && p.slug !== excludeSlug && p.is_active)
      .slice(0, limit);
  }
}

export async function getBlogs(options?: {
  page?: number;
  limit?: number;
  /** @deprecated use status instead */
  publishedOnly?: boolean;
  q?: string;
  status?: 'published' | 'draft';
}) {
  if (!isDatabaseConfigured()) {
    return { blogs: [], totalCount: 0 };
  }
  try {
    await ensureDatabaseReady();
    const limit = options?.limit ?? 15;
    const offset = ((options?.page ?? 1) - 1) * limit;

    const conditions: string[] = [];
    const countParams: unknown[] = [];
    const queryParams: unknown[] = [];

    // status filter (new param takes precedence over legacy publishedOnly)
    if (options?.status === 'published') {
      conditions.push(`is_published = TRUE`);
    } else if (options?.status === 'draft') {
      conditions.push(`is_published = FALSE`);
    } else if (options?.publishedOnly) {
      conditions.push(`is_published = TRUE`);
    }

    // text search on title
    if (options?.q && options.q.trim() !== '') {
      const paramIdx = conditions.length + 1;
      conditions.push(`title ILIKE $${paramIdx}`);
      countParams.push(`%${options.q.trim()}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Build count query params (only the search term if present)
    const countResult = await db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM blogs ${whereClause}`,
      countParams
    );
    const totalCount = parseInt(countResult.rows[0].count, 10);

    // Build data query params: search term(s) first, then limit & offset
    queryParams.push(...countParams);
    const limitIdx = queryParams.length + 1;
    const offsetIdx = queryParams.length + 2;
    queryParams.push(limit, offset);

    const result = await db.query<BlogRow>(
      `SELECT * FROM blogs ${whereClause} ORDER BY created_at DESC LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      queryParams
    );
    return {
      blogs: result.rows.map(mapBlog),
      totalCount
    };
  } catch (e) {
    console.error('Failed to get blogs', e);
    return { blogs: [], totalCount: 0 };
  }
}

export async function getBlog(idOrSlug: string | number) {
  if (!isDatabaseConfigured()) return null;
  try {
    await ensureDatabaseReady();
    let result;
    if (typeof idOrSlug === 'number') {
      result = await db.query<BlogRow>('SELECT * FROM blogs WHERE id = $1', [idOrSlug]);
    } else {
      result = await db.query<BlogRow>('SELECT * FROM blogs WHERE slug = $1', [idOrSlug]);
    }
    if (result.rows.length === 0) return null;
    return mapBlog(result.rows[0]);
  } catch (e) {
    console.error('Failed to get blog', e);
    return null;
  }
}

export async function createBlog(data: BlogMutationPayload) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const result = await db.query<BlogRow>(
    `INSERT INTO blogs (title, slug, content, cover_url, is_published)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.title, data.slug, data.content, data.cover_url ?? '', data.is_published]
  );
  return mapBlog(result.rows[0]);
}

export async function updateBlog(id: number, data: BlogMutationPayload) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const result = await db.query<BlogRow>(
    `UPDATE blogs SET title = $1, slug = $2, content = $3, cover_url = $4, is_published = $5, updated_at = NOW()
     WHERE id = $6 RETURNING *`,
    [data.title, data.slug, data.content, data.cover_url ?? '', data.is_published, id]
  );
  return mapBlog(result.rows[0]);
}

export async function deleteBlog(id: number) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  await db.query('DELETE FROM blogs WHERE id = $1', [id]);
}

// ─── License Keys ─────────────────────────────────────────────────────────────

export async function getLicenseKeyStats(productId: number) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const { rows } = await db.query(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
       SUM(CASE WHEN status = 'used' THEN 1 ELSE 0 END) as used
     FROM license_keys
     WHERE product_id = $1`,
    [productId]
  );
  return {
    total: Number(rows[0]?.total || 0),
    available: Number(rows[0]?.available || 0),
    used: Number(rows[0]?.used || 0),
  };
}

export async function addLicenseKeys(productId: number, keys: string[]): Promise<number> {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  let count = 0;
  for (const key of keys) {
    try {
      await db.query(
        `INSERT INTO license_keys (product_id, key_value) VALUES ($1, $2) ON CONFLICT (key_value) DO NOTHING`,
        [productId, key.trim()]
      );
      count++;
    } catch {
      // skip duplicates
    }
  }
  return count;
}

export async function assignLicenseKey(orderId: number, productId: number): Promise<string | null> {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const client = await (db as unknown as import('pg').Pool).connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `SELECT id, key_value FROM license_keys
       WHERE product_id = $1 AND status = 'available'
       LIMIT 1 FOR UPDATE SKIP LOCKED`,
      [productId]
    );
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }
    const { id: keyId, key_value } = result.rows[0];
    await client.query(
      `UPDATE license_keys SET status = 'used', order_id = $1, assigned_at = NOW() WHERE id = $2`,
      [orderId, keyId]
    );
    await client.query(
      `UPDATE orders SET license_key_id = $1 WHERE id = $2`,
      [keyId, orderId]
    );
    await client.query('COMMIT');
    return key_value as string;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getLicenseKeyForOrder(orderId: number): Promise<string | null> {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const result = await db.query(
    `SELECT lk.key_value FROM license_keys lk
     JOIN orders o ON o.license_key_id = lk.id
     WHERE o.id = $1 AND o.payment_status = 'paid'`,
    [orderId]
  );
  return result.rows[0]?.key_value ?? null;
}

export async function getLicenseKeyStockCount(productId: number): Promise<number> {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const result = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM license_keys WHERE product_id = $1 AND status = 'available'`,
    [productId]
  );
  return Number(result.rows[0]?.count ?? 0);
}

// ─── Admin Notifications ──────────────────────────────────────────────────────

export async function createNotification(params: {
  type: string;
  title: string;
  body?: string;
  refId?: number;
  refType?: string;
}) {
  if (!isDatabaseConfigured()) return;
  try {
    await ensureDatabaseReady();
    await db.query(
      `INSERT INTO admin_notifications (type, title, body, ref_id, ref_type)
       VALUES ($1, $2, $3, $4, $5)`,
      [params.type, params.title, params.body ?? null, params.refId ?? null, params.refType ?? null]
    );
  } catch (err) {
    console.error('[Notification] Failed to create notification:', err);
  }
}

export async function getNotificationUnreadCount(): Promise<number> {
  if (!isDatabaseConfigured()) return 0;
  try {
    await ensureDatabaseReady();
    const result = await db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM admin_notifications WHERE is_read = FALSE`
    );
    return Number(result.rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

export async function getNotifications(params: { limit?: number; offset?: number; unreadOnly?: boolean } = {}) {
  if (!isDatabaseConfigured()) return [];
  await ensureDatabaseReady();
  const { limit = 20, offset = 0, unreadOnly = false } = params;
  const where = unreadOnly ? 'WHERE is_read = FALSE' : '';
  const result = await db.query(
    `SELECT * FROM admin_notifications ${where} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

export async function markNotificationRead(id: number) {
  if (!isDatabaseConfigured()) return;
  await ensureDatabaseReady();
  await db.query(`UPDATE admin_notifications SET is_read = TRUE WHERE id = $1`, [id]);
}

export async function markAllNotificationsRead() {
  if (!isDatabaseConfigured()) return;
  await ensureDatabaseReady();
  await db.query(`UPDATE admin_notifications SET is_read = TRUE WHERE is_read = FALSE`);
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrdersPaginated(params: {
  page?: number;
  limit?: number;
  status?: string;
  query?: string;
}) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const { page = 1, limit = 20, status, query } = params;
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  if (status) { conditions.push(`o.payment_status = $${idx++}`); values.push(status); }
  if (query) {
    conditions.push(
      `(COALESCE(o.customer_email, c.email) ILIKE $${idx} OR COALESCE(o.customer_name, CONCAT_WS(' ', c.first_name, c.last_name)) ILIKE $${idx} OR o.id::text = $${idx})`
    );
    values.push(`%${query}%`);
    idx++;
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await db.query(
    `SELECT o.*,
       COALESCE(o.customer_email, c.email) AS customer_email,
       COALESCE(o.customer_name, NULLIF(TRIM(CONCAT_WS(' ', c.first_name, c.last_name)), '')) AS customer_name,
       COALESCE(o.customer_phone, c.phone) AS customer_phone
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     ${where}
     ORDER BY o.created_at DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );
  const countResult = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM orders o LEFT JOIN customers c ON o.customer_id = c.id ${where}`,
    values
  );
  const total = Number(countResult.rows[0]?.count ?? 0);
  return { orders: result.rows, total, totalPages: Math.ceil(total / limit) };
}

export async function getOrderById(id: number) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const result = await db.query(
    `SELECT o.*,
       COALESCE(o.customer_email, c.email) AS customer_email,
       COALESCE(o.customer_name, NULLIF(TRIM(CONCAT_WS(' ', c.first_name, c.last_name)), '')) AS customer_name,
       COALESCE(o.customer_phone, c.phone) AS customer_phone,
       lk.key_value as license_key,
       a.referral_code, a.commission_rate
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     LEFT JOIN license_keys lk ON o.license_key_id = lk.id
     LEFT JOIN affiliates a ON o.affiliate_id = a.id
     WHERE o.id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function getOrdersByCustomer(customerId: number, params: { page?: number; limit?: number } = {}) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const { page = 1, limit = 10 } = params;
  const offset = (page - 1) * limit;
  const result = await db.query(
    `SELECT o.*, lk.key_value as license_key
     FROM orders o
     LEFT JOIN license_keys lk ON o.license_key_id = lk.id
     WHERE o.customer_id = $1
     ORDER BY o.created_at DESC
     LIMIT $2 OFFSET $3`,
    [customerId, limit, offset]
  );
  const countResult = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM orders WHERE customer_id = $1`,
    [customerId]
  );
  const total = Number(countResult.rows[0]?.count ?? 0);
  return { 
    orders: result.rows, 
    totalCount: total,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

// ─── Affiliates ───────────────────────────────────────────────────────────────

export async function getAffiliateByClerkId(clerkId: string) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const result = await db.query(
    `SELECT a.*, c.first_name, c.last_name, c.email, c.clerk_id
     FROM affiliates a
     JOIN customers c ON a.customer_id = c.id
     WHERE c.clerk_id = $1`,
    [clerkId]
  );
  return result.rows[0] ?? null;
}

export async function getAffiliateById(id: number) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const result = await db.query(
    `SELECT a.*, c.first_name, c.last_name, c.email
     FROM affiliates a
     JOIN customers c ON a.customer_id = c.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function getCommissionsByAffiliate(affiliateId: number) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const result = await db.query(
    `SELECT cm.*, o.total_amount FROM commissions cm
     JOIN orders o ON cm.order_id = o.id
     WHERE cm.affiliate_id = $1
     ORDER BY cm.created_at DESC`,
    [affiliateId]
  );
  return result.rows;
}

export async function getAffiliatesStats() {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const result = await db.query(`
    SELECT
      COUNT(*)::text AS total_affiliates,
      COALESCE(SUM(CASE WHEN cm.status = 'pending' THEN cm.amount ELSE 0 END), 0)::text AS total_pending,
      COALESCE(SUM(CASE WHEN cm.status = 'paid' THEN cm.amount ELSE 0 END), 0)::text AS total_paid
    FROM affiliates a
    LEFT JOIN commissions cm ON cm.affiliate_id = a.id
  `);
  return result.rows[0];
}

export async function getAffiliatesPaginated(params: { page: number; limit: number; query?: string }) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();

  const { page, limit, query } = params;
  const offset = (page - 1) * limit;

  let whereClause = '';
  const values: (string | number)[] = [];

  if (query) {
    whereClause = `WHERE c.email ILIKE $1 OR c.first_name ILIKE $1 OR c.last_name ILIKE $1 OR a.referral_code ILIKE $1`;
    values.push(`%${query}%`);
  }

  const countQuery = `
    SELECT COUNT(*) 
    FROM affiliates a
    JOIN customers c ON a.customer_id = c.id
    ${whereClause}
  `;
  const { rows: countRows } = await db.query(countQuery, values);
  const total = parseInt(countRows[0].count, 10);

  const dataQuery = `
    SELECT a.*, c.first_name, c.last_name, c.email
    FROM affiliates a
    JOIN customers c ON a.customer_id = c.id
    ${whereClause}
    ORDER BY a.created_at DESC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;
  values.push(limit, offset);

  const { rows } = await db.query(dataQuery, values);

  return {
    affiliates: rows,
    total,
    totalPages: Math.ceil(total / limit),
  };
}


export async function getOrderByIdForCustomer(orderId: number, customerId: number) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  
  const { rows } = await db.query(
    `SELECT o.*, l.key_value as license_key 
     FROM orders o
     LEFT JOIN license_keys l ON o.license_key_id = l.id
     WHERE o.id = $1 AND o.customer_id = $2`,
    [orderId, customerId]
  );
  return rows[0] || null;
}

// ─── Guides ─────────────────────────────────────────────────────────────

export async function getGuidesPaginated(params: { page: number; limit: number; query?: string }) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();

  const { page, limit, query } = params;
  const offset = (page - 1) * limit;

  let whereClause = '';
  const values: (string | number)[] = [];

  if (query) {
    whereClause = `WHERE title ILIKE $1`;
    values.push(`%${query}%`);
  }

  const countQuery = `SELECT COUNT(*) FROM guides ${whereClause}`;
  const { rows: countRows } = await db.query(countQuery, values);
  const total = parseInt(countRows[0].count, 10);

  const dataQuery = `
    SELECT * FROM guides
    ${whereClause}
    ORDER BY sort_order ASC, created_at DESC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;
  values.push(limit, offset);

  const { rows } = await db.query(dataQuery, values);

  return {
    guides: rows,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPublicGuides() {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const { rows } = await db.query(`
    SELECT * FROM guides 
    WHERE is_published = TRUE 
    ORDER BY category, sort_order ASC, created_at DESC
  `);
  return rows;
}

export async function getGuideBySlug(slug: string) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const { rows } = await db.query(`SELECT * FROM guides WHERE slug = $1`, [slug]);
  return rows[0] || null;
}

export async function getGuideById(id: number) {
  if (!isDatabaseConfigured()) throw new Error('DB not configured');
  await ensureDatabaseReady();
  const { rows } = await db.query(`SELECT * FROM guides WHERE id = $1`, [id]);
  return rows[0] || null;
}
