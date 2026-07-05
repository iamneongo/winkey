import { db } from '@/lib/db';

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
};

type UserMutationPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
};

const seedProducts = [
  {
    slug: 'win11pro',
    name: 'Windows 11 Professional Retail',
    description: 'Bản quyền vĩnh viễn cho máy cá nhân và doanh nghiệp nhỏ.',
    price: 249000,
    original_price: 799000,
    category: 'windows',
    tag: 'Bán chạy',
    rating: 4.9,
    reviews_count: 1240,
    photo_url: 'https://api.slingacademy.com/public/sample-products/1.png',
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
    photo_url: 'https://api.slingacademy.com/public/sample-products/2.png',
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
    photo_url: 'https://api.slingacademy.com/public/sample-products/3.png',
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
    photo_url: 'https://api.slingacademy.com/public/sample-products/4.png',
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
    name: 'Microsoft Office 365 Personal (1 năm)',
    description: 'Giải pháp thuê bao linh hoạt cho nhiều thiết bị và cập nhật mới.',
    price: 249000,
    original_price: 890000,
    category: 'office',
    tag: null,
    rating: 4.7,
    reviews_count: 680,
    photo_url: 'https://api.slingacademy.com/public/sample-products/5.png',
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
    photo_url: 'https://api.slingacademy.com/public/sample-products/6.png',
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

let initPromise: Promise<void> | null = null;

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

function getProductPhoto(category: string) {
  if (category === 'windows') return 'https://api.slingacademy.com/public/sample-products/7.png';
  if (category === 'office') return 'https://api.slingacademy.com/public/sample-products/8.png';
  return 'https://api.slingacademy.com/public/sample-products/9.png';
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

async function ensureDatabaseReady() {
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
  const productQuery = await db.query(
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

  const result = await db.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [id]);
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
  const result = await db.query(
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
      getProductPhoto(data.category),
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

  const existing = await db.query('SELECT id FROM products WHERE id = $1 LIMIT 1', [id]);
  if (existing.rows.length === 0) {
    return {
      success: false,
      message: `Không tìm thấy sản phẩm #${id}.`
    };
  }

  const slug = await getUniqueSlug(data.name, id);
  const result = await db.query(
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
    [id, slug, data.name, data.description, data.category, data.price, getProductPhoto(data.category), getDefaultFeatures(data.category)]
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
  const userQuery = await db.query(
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

  const result = await db.query(
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

  const result = await db.query(
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

export async function getStorefrontProducts() {
  const data = await getProductsFromDb({ page: 1, limit: 100 });

  return data.products.map((product) => ({
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
    features: product.features
  }));
}
