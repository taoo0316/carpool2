import Pagination from '@/app/ui/posts/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/posts/table';
import { CreatePost } from '@/app/ui/posts/buttons';
import { lusitana } from '@/app/ui/fonts';
import { PostsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchPostsPages } from '@/app/lib/data';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Posts',
};
 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPostsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Posts</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search posts..." />
        <CreatePost />
      </div>
      <p className="mt-4 text-gray-600">This page displays a list of rideshare posts. You can search for specific posts using the search bar above. You may also create posts by clicking on the plus sign.</p>
       <Suspense key={query + currentPage} fallback={<PostsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}