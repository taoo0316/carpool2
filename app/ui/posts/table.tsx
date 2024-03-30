import { UpdatePost, DeletePost } from '@/app/ui/posts/buttons';
import PostStatus from '@/app/ui/posts/status';
import { fetchFilteredPosts } from '@/app/lib/data';
import Link from 'next/link';
import { formatTimeForDisplay } from '@/app/lib/utils';

export default async function PostsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const posts = await fetchFilteredPosts(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {posts?.map((post) => (
                <div
                  key={post.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <Link href={`/dashboard/posts/${post.id}`} key={post.id} className="mb-2 w-full">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{post.name}</p>
                      </div>
                      <p className="text-sm text-gray-500">{formatTimeForDisplay(post.ride_time.toString())}</p>
                    </div>
                    <PostStatus status={post.status} />
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p>{post.start_location}</p>
                      <p>{post.end_location}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdatePost id={post.id} />
                      <DeletePost id={post.id} />
                    </div>
                  </div>
                  </Link>
                </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  User
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Start
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  End 
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {posts?.map((post) => (
                <tr
                  key={post.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                > 
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/dashboard/posts/${post.id}`} key={post.id} className="mb-2 w-full">
                      <div className="flex items-center gap-3">
                        <p>{post.name}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={`/dashboard/posts/${post.id}`} key={post.id} className="mb-2 w-full">
                      {formatTimeForDisplay(post.ride_time.toString())}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={`/dashboard/posts/${post.id}`} key={post.id} className="mb-2 w-full">
                      {post.start_location}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={`/dashboard/posts/${post.id}`} key={post.id} className="mb-2 w-full">
                      {post.end_location}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={`/dashboard/posts/${post.id}`} key={post.id} className="mb-2 w-full">
                      <PostStatus status={post.status} />
                    </Link>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePost id={post.id} />
                      <DeletePost id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
