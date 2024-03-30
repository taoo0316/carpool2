import { Metadata } from 'next';
import { Suspense } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { PostsTableSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function UsersPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  // Dummy user profile data
  const userProfile = {
    name: "Zhu Wentao",
    email: "zwt2000sg@outlook.com",
    // Dummy posts authored by the user
    postsAuthored: [
      { id: 1, title: "Post 1", content: "We are going to NTU:)" },
      { id: 2, title: "Post 2", content: "Let us hop on a supper ride!" },
    ],
    // Dummy posts hearted/followed by the user
    postsHearted: [
      { id: 3, title: "Post 1", content: "Sending off a friend to Changi!" },
      { id: 4, title: "Post 2", content: "Who wants to go to Sentosa during recess week?" },
    ]
  };

  return (
    <div className="w-full">
    <div className="flex w-full items-center justify-between">
      <h1 className={`${lusitana.className} text-2xl`}>Profile</h1>
    </div>
    <div style={{ marginBottom: '30px' }}></div>
    <p className="mt-4 text-gray-600">This page displays the user profile, which includes the user's information, posts and liked/followed posts.</p>
    <div style={{ marginBottom: '50px' }}></div>
    <div style={styles.container}>
      <div style={styles.profileInfo}>
        <p><strong>Name:</strong> {userProfile.name}</p>
        <p><strong>Email:</strong> {userProfile.email}</p>
      </div>
      <div style={styles.posts}>
        <h2 className={`${lusitana.className}`}>Posts Authored</h2>
        <ul>
          {userProfile.postsAuthored.map(post => (
            <li key={post.id} style={styles.post}>
              <strong>{post.title}</strong>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      </div>
      <div style={styles.posts}>
        <h2 className={`${lusitana.className}`}>Posts Liked/Followed</h2>
        <ul>
          {userProfile.postsHearted.map(post => (
            <li key={post.id} style={styles.post}>
              <strong>{post.title}</strong>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  profileInfo: {
    marginBottom: '20px',
  },
  posts: {
    marginBottom: '20px',
  },
  post: {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
  },
};
