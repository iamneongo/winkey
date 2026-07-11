import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Shared responsive pagination for the account area.
 * Disabled edges render real <button disabled> (not links), so we never
 * generate ?page=0 or ?page=>totalPages URLs.
 */
export function AccountPagination({
  page,
  totalPages,
  basePath,
  totalLabel
}: {
  page: number;
  totalPages: number;
  basePath: string;
  totalLabel?: string;
}) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center text-sm text-gray-500 sm:text-left">
        {totalLabel ?? `Trang ${page} / ${totalPages}`}
      </p>
      <div className="flex gap-2">
        {prevDisabled ? (
          <Button variant="outline" size="sm" disabled className="flex-1 sm:flex-none">
            Trước
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
            <Link href={`${basePath}?page=${page - 1}`}>Trước</Link>
          </Button>
        )}
        {nextDisabled ? (
          <Button variant="outline" size="sm" disabled className="flex-1 sm:flex-none">
            Sau
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
            <Link href={`${basePath}?page=${page + 1}`}>Sau</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
