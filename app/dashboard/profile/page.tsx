import UsersTable from '@/app/ui/users/table';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {

  const query = searchParams?.query || '';
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <UsersTable query={query}/>
      </Suspense>
    )
}