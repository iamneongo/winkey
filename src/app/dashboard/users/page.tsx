import Link from 'next/link';
import { auth, clerkClient } from '@clerk/nextjs/server';
import PageContainer from '@/components/layout/page-container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usersInfoContent } from '@/features/users/info-content';
import { redirect } from 'next/navigation';
import { InviteMemberDialog } from './invite-dialog';

export const metadata = {
  title: 'WinKey Admin | Thành viên'
};

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getMembershipRoleLabel(role: string) {
  if (role === 'org:admin') {
    return 'Quản trị viên';
  }

  if (role === 'org:member') {
    return 'Thành viên';
  }

  return role.replace('org:', '').replace(/-/g, ' ');
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDate(value: Date | number | null) {
  if (!value) {
    return 'Chưa có dữ liệu';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value instanceof Date ? value : new Date(value));
}

export default async function UsersPage(props: PageProps) {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect('/auth/sign-in?redirect_url=/admin/users');
  }

  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === 'string' ? searchParams.q.trim() : '';

  if (!orgId) {
    return (
      <PageContainer
        pageTitle='Thành viên'
        pageDescription='Trang này lấy dữ liệu trực tiếp từ Clerk theo tổ chức đang hoạt động.'
        infoContent={usersInfoContent}
        access={false}
        accessFallback={
          <div className='mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center'>
            <h3 className='text-xl font-semibold'>Bạn chưa chọn tổ chức trong Clerk</h3>
            <p className='text-muted-foreground mt-2 text-sm'>
              Hãy chọn hoặc tạo organization để xem danh sách thành viên admin thật của WinKey.
            </p>
            <div className='mt-4'>
              <Button asChild>
                <Link href='/admin/workspaces'>Mở quản lý tổ chức</Link>
              </Button>
            </div>
          </div>
        }
      >
        <div />
      </PageContainer>
    );
  }

  const client = await clerkClient();
  const [organization, membershipsResponse, invitationsResponse] = await Promise.all([
    client.organizations.getOrganization({
      organizationId: orgId,
      includeMembersCount: true
    }),
    client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
      limit: 100,
      orderBy: '+first_name',
      ...(query ? { query } : {})
    }),
    client.organizations.getOrganizationInvitationList({
      organizationId: orgId,
      limit: 100
    })
  ]);

  const memberships = membershipsResponse.data;
  const pendingInvitations = invitationsResponse.data.filter(inv => inv.status === 'pending');

  return (
    <PageContainer
      pageTitle='Thành viên'
      pageDescription={`Danh sách thành viên đang lấy trực tiếp từ Clerk cho tổ chức ${organization.name}.`}
      infoContent={usersInfoContent}
      pageHeaderAction={
        <div className="flex items-center gap-2">
          <Button asChild variant='outline'>
            <Link href='/admin/workspaces/team'>Quản lý trong Clerk</Link>
          </Button>
          <InviteMemberDialog />
        </div>
      }
    >
      <div className='grid gap-4'>


        <Card>
          <CardHeader className='gap-3'>
            <div>
              <CardTitle>Danh sách thành viên</CardTitle>
              <CardDescription>
                Tìm theo tên hoặc email từ organization đang active trong Clerk.
              </CardDescription>
            </div>
            <form action='/admin/users' className='flex flex-col gap-2 md:flex-row'>
              <Input
                type='search'
                name='q'
                defaultValue={query}
                placeholder='Tìm theo tên hoặc email...'
                className='md:min-w-80'
              />
              <div className='flex gap-2'>
                <Button type='submit'>Lọc</Button>
                {query && (
                  <Button asChild type='button' variant='outline'>
                    <Link href='/admin/users'>Xóa lọc</Link>
                  </Button>
                )}
              </div>
            </form>
          </CardHeader>
          <CardContent className='space-y-3'>
            {memberships.length === 0 ? (
              <div className='text-muted-foreground rounded-xl border border-dashed px-4 py-10 text-center text-sm'>
                Không tìm thấy thành viên nào trong Clerk với bộ lọc hiện tại.
              </div>
            ) : (
              memberships.map((membership) => {
                const displayName =
                  membership.publicUserData?.firstName || membership.publicUserData?.lastName
                    ? `${membership.publicUserData?.firstName ?? ''} ${membership.publicUserData?.lastName ?? ''}`.trim()
                    : membership.publicUserData?.identifier ?? 'Người dùng Clerk';
                const email = membership.publicUserData?.identifier ?? 'Chưa có email chính';

                return (
                  <div
                    key={membership.id}
                    className='flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between'
                  >
                    <div className='flex items-center gap-3'>
                      <Avatar className='size-11'>
                        <AvatarImage src={membership.publicUserData?.imageUrl} alt={displayName} />
                        <AvatarFallback>{getInitials(displayName || 'WK')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-semibold'>{displayName}</div>
                        <div className='text-muted-foreground text-sm'>{email}</div>
                      </div>
                    </div>
                    <div className='flex flex-wrap items-center gap-2 text-sm'>
                      <Badge variant={membership.role === 'org:admin' ? 'default' : 'outline'}>
                        {getMembershipRoleLabel(membership.role)}
                      </Badge>
                      <span className='text-muted-foreground'>
                        Tham gia: {formatDate(membership.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {pendingInvitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Lời mời đang chờ ({pendingInvitations.length})</CardTitle>
              <CardDescription>
                Các lời mời đã được gửi đi nhưng chưa được chấp nhận.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className='flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between'
                >
                  <div className='flex items-center gap-3'>
                    <Avatar className='size-11'>
                      <AvatarFallback>{getInitials(invitation.emailAddress)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='font-semibold'>{invitation.emailAddress}</div>
                      <div className='text-muted-foreground text-sm'>
                        Trạng thái: Đang chờ
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-wrap items-center gap-2 text-sm'>
                    <Badge variant={invitation.role === 'org:admin' ? 'default' : 'outline'}>
                      {getMembershipRoleLabel(invitation.role)}
                    </Badge>
                    <span className='text-muted-foreground'>
                      Gửi lúc: {formatDate(invitation.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
