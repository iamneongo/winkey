import PageContainer from '@/components/layout/page-container';
import { getGuidesPaginated } from '@/lib/catalog';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit, Plus } from 'lucide-react';
import { DeleteButton } from './delete-button';
import { Input } from '@/components/ui/input';

export const dynamic = 'force-dynamic';

export default async function AdminGuidesPage(props: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || '1', 10);
  const query = searchParams.q || '';

  const { guides, total, totalPages } = await getGuidesPaginated({ page, limit: 15, query });

  return (
    <PageContainer pageTitle="Quản lý Hướng dẫn" pageDescription="Tạo và chỉnh sửa bài viết hướng dẫn sử dụng">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <form className="flex gap-2 w-full sm:w-auto">
          <Input 
            name="q" 
            defaultValue={query} 
            placeholder="Tìm theo tiêu đề..." 
            className="max-w-xs"
          />
          <Button type="submit" variant="secondary">Tìm</Button>
        </form>
        
        <Button asChild>
          <Link href="/admin/guides/new">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Chuyên mục</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Không tìm thấy bài viết nào
                  </TableCell>
                </TableRow>
              ) : (
                guides.map((guide: { id: number; title: string; category: string; sort_order: number; is_published: boolean }) => (
                  <TableRow key={guide.id}>
                    <TableCell className="font-medium max-w-sm truncate" title={guide.title}>
                      {guide.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {guide.category === 'windows' ? 'Windows' : guide.category === 'office' ? 'Office' : 'Chung'}
                      </Badge>
                    </TableCell>
                    <TableCell>{guide.sort_order}</TableCell>
                    <TableCell>
                      <Badge variant={guide.is_published ? 'default' : 'secondary'} className={guide.is_published ? 'bg-blue-100 text-blue-800' : ''}>
                        {guide.is_published ? 'Xuất bản' : 'Bản nháp'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/guides/${guide.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <DeleteButton id={guide.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-gray-500">
                Trang {page} / {totalPages} (Tổng {total})
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild disabled={page <= 1}>
                  <Link href={`/admin/guides?page=${page - 1}&q=${query}`}>Trước</Link>
                </Button>
                <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
                  <Link href={`/admin/guides?page=${page + 1}&q=${query}`}>Sau</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
