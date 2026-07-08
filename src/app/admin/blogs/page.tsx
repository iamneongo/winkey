import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getBlogs } from '@/lib/catalog';
import { Plus, Edit, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { DeleteButton } from './delete-button';

export const metadata = {
  title: 'WinKey Admin | Bài viết'
};

export const dynamic = 'force-dynamic';

const LIMIT = 15;

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function formatDate(value: Date | string) {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export default async function BlogsPage(props: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/sign-in?redirect_url=/admin/blogs');
  }

  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === 'string' ? searchParams.q.trim() : '';
  const rawStatus = typeof searchParams.status === 'string' ? searchParams.status : '';
  const status =
    rawStatus === 'published' || rawStatus === 'draft'
      ? (rawStatus as 'published' | 'draft')
      : undefined;
  const page = Math.max(1, parseInt(typeof searchParams.page === 'string' ? searchParams.page : '1', 10) || 1);

  const { blogs, totalCount } = await getBlogs({ q, status, page, limit: LIMIT });
  const totalPages = Math.ceil(totalCount / LIMIT);

  function buildHref(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const merged = { q, status: rawStatus, page: String(page), ...overrides };
    if (merged.q) p.set('q', merged.q);
    if (merged.status) p.set('status', merged.status);
    if (merged.page && merged.page !== '1') p.set('page', merged.page);
    const qs = p.toString();
    return `/admin/blogs${qs ? `?${qs}` : ''}`;
  }

  const tabItems = [
    { label: 'Tất cả', value: '' },
    { label: 'Đã xuất bản', value: 'published' },
    { label: 'Bản nháp', value: 'draft' }
  ] as const;

  return (
    <PageContainer
      pageTitle="Bài viết"
      pageDescription={`Quản lý các bài viết trên blog của WinKey. Tổng cộng có ${totalCount} bài viết.`}
      pageHeaderAction={
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm bài viết
          </Link>
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Search + filter row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search form */}
          <form method="GET" action="/admin/blogs" className="flex gap-2 w-full sm:max-w-sm">
            {status && <input type="hidden" name="status" value={status} />}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Tìm theo tiêu đề…"
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary">
              Tìm
            </Button>
          </form>

          {/* Status filter tabs */}
          <div className="flex gap-1 border rounded-lg p-1 w-fit">
            {tabItems.map((tab) => {
              const isActive = rawStatus === tab.value;
              return (
                <Link
                  key={tab.value}
                  href={buildHref({ status: tab.value || undefined, page: '1' })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Table */}
        {blogs.length === 0 ? (
          <div className="text-center py-16 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-4">
              {q || status ? 'Không tìm thấy bài viết nào phù hợp.' : 'Chưa có bài viết nào.'}
            </p>
            {!q && !status && (
              <Button asChild variant="outline">
                <Link href="/admin/blogs/new">Tạo bài viết đầu tiên</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Ảnh cover</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Đường dẫn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      {blog.cover_url ? (
                        <div className="relative w-16 h-10 overflow-hidden rounded">
                          <img
                            src={blog.cover_url}
                            alt={blog.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {blog.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[160px] truncate">
                      {blog.slug}
                    </TableCell>
                    <TableCell>
                      {blog.is_published ? (
                        <Badge variant="default">Đã xuất bản</Badge>
                      ) : (
                        <Badge variant="secondary">Bản nháp</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(blog.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/blogs/${blog.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton blogId={blog.id} blogTitle={blog.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Trang {page} / {totalPages} &mdash; {totalCount} bài viết
            </p>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={page <= 1}
              >
                <Link href={buildHref({ page: String(page - 1) })}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Trước
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
              >
                <Link href={buildHref({ page: String(page + 1) })}>
                  Sau
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
