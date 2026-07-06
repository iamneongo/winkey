import type { SearchParams } from 'nuqs/server';
import PageContainer from '@/components/layout/page-container';
import UserListingPage from '@/features/users/components/user-listing';
import { UserFormSheetTrigger } from '@/features/users/components/user-form-sheet';
import { usersInfoContent } from '@/features/users/info-content';
import { searchParamsCache } from '@/lib/searchparams';

export const metadata = {
  title: 'WinKey Admin | Thành viên'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function UsersPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Thành viên'
      pageDescription='Quản lý tài khoản nội bộ cho admin, bán hàng và chăm sóc khách hàng.'
      infoContent={usersInfoContent}
      pageHeaderAction={<UserFormSheetTrigger />}
    >
      <UserListingPage />
    </PageContainer>
  );
}
