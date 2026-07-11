/**
 * Single source of truth for the marketplace left-sidebar categories.
 *
 * `id` is the slug used both in the `?category=` query param and matched
 * against the storefront product's `category` field. Only `windows`,
 * `office` and `combo` currently have products in the catalog; the remaining
 * marketing categories resolve to an empty product list (see resolveCategoryParam).
 *
 * Kept free of server-only imports so it can be shared by server and client code.
 */
export type MarketplaceCategory = {
  id: string;
  label: string;
  img: string;
};

export const marketplaceCategories: MarketplaceCategory[] = [
  { id: 'windows', label: 'Windows', img: 'https://thesvg.org/icons/windows/default.svg' },
  { id: 'office', label: 'Microsoft Office', img: 'https://thesvg.org/icons/microsoft-office/default.svg' },
  { id: 'combo', label: 'Combo ưu đãi', img: 'https://thesvg.org/icons/microsoft/default.svg' },
  { id: 'ai-tools', label: 'AI Tools', img: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
  { id: 'am-nhac', label: 'Âm nhạc bản quyền', img: 'https://thesvg.org/icons/apple-music/default.svg' },
  { id: 'video', label: 'Video & Stock Media', img: 'https://thesvg.org/icons/youtube/default.svg' },
  { id: 'thiet-ke', label: 'Thiết kế & Template', img: 'https://thesvg.org/icons/figma/default.svg' },
  { id: 'digital-marketing', label: 'Digital Marketing', img: 'https://thesvg.org/icons/google-ads/default.svg' },
  { id: 'website', label: 'Website & Hosting', img: 'https://thesvg.org/icons/github/default.svg' }
];

const categoryById = new Map(marketplaceCategories.map((category) => [category.id, category]));

export function isKnownCategory(id: string | null | undefined): boolean {
  return typeof id === 'string' && categoryById.has(id);
}

export function getCategoryLabel(id: string | null | undefined): string | null {
  if (typeof id !== 'string') return null;
  return categoryById.get(id)?.label ?? null;
}

/**
 * Resolve a raw `?category=` value into a safe filter descriptor.
 * - missing/empty        -> no filter (show all products)
 * - a known category id  -> filter by that category
 * - an unknown value     -> safe fallback to "all" (never throws)
 */
export function resolveCategoryParam(raw: string | string[] | undefined): {
  activeCategory: string | null;
  label: string | null;
} {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !isKnownCategory(value)) {
    return { activeCategory: null, label: null };
  }
  return { activeCategory: value, label: getCategoryLabel(value) };
}
