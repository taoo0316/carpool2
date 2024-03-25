import { sql } from '@vercel/postgres';
import {
  User,
  Post,
  Comment,
  LastestPosts,
  PostsTable,
  PostForm,
  UserField,
  UsersTable
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchLatestPosts() {
  noStore();
  try {
    const data = await sql<LastestPosts>`
      SELECT 
        users.name, 
        posts.start_location, 
        posts.end_location, 
        posts.ride_time, 
        posts.ride_service, 
        posts.carpoolers, 
        posts.status
      FROM posts
      JOIN users ON posts.author_id = users.id
      ORDER BY posts.date DESC
      LIMIT 5`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest posts.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    const userCountPromise = sql`SELECT COUNT(*) FROM users`;
    const postCountPromise = sql`SELECT COUNT(*) FROM posts`;
    const postStatusPromise = sql`SELECT
         COUNT(CASE WHEN status = 'open') AS "open",
         COUNT(CASE WHEN status = 'closed') AS "closed"
         FROM posts`;

    const data = await Promise.all([
      userCountPromise,
      postCountPromise,
      postStatusPromise,
    ]);

    const numberOfUsers = Number(data[0].rows[0].count ?? '0');
    const numberOfPosts = Number(data[1].rows[0].count ?? '0');
    const totalOpenPosts = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalClosedPosts = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfUsers,
      numberOfPosts,
      totalOpenPosts,
      totalClosedPosts,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredPosts( query: string, currentPage: number,) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const posts = await sql<PostsTable>`
      SELECT
        users.name, 
        posts.start_location, 
        posts.end_location, 
        posts.ride_time, 
        posts.ride_service, 
        posts.carpoolers, 
        posts.status
      FROM posts
      JOIN users ON posts.author_id = users.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        posts.start_location ILIKE ${`%${query}%`} OR
        posts.end_location ILIKE ${`%${query}%`} OR
        posts.ride_time::text ILIKE ${`%${query}%`} OR
        posts.ride_service ILIKE ${`%${query}%`} OR
        posts.status ILIKE ${`%${query}%`}
      ORDER BY posts.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return posts.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch posts.');
  }
}

export async function fetchPostsPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE
      users.name ILIKE ${`%${query}%`} OR
      posts.start_location ILIKE ${`%${query}%`} OR
      posts.end_location ILIKE ${`%${query}%`} OR
      posts.ride_time::text ILIKE ${`%${query}%`} OR
      posts.ride_service ILIKE ${`%${query}%`} OR
      posts.status ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of posts.');
  }
}

export async function fetchPostById(id: string) {
  noStore();
  try {
    const data = await sql<PostForm>`
      SELECT
        posts.posts.id,
        posts.author_id,
        posts.start_location,
        posts.end_location,
        posts.ride_time,
        posts.post_time,
        posts.ride_service,
        posts.description,
        posts.carpoolers,
        posts.status,
      FROM posts
      WHERE posts.id = ${id};
    `;

    const post = data.rows.map((post) => ({
      ...post
    }));

    return post[0];
  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function fetchUsers() {
  noStore();
  try {
    const data = await sql<UserField>`
      SELECT
        id,
        name
      FROM users
      ORDER BY name ASC
    `;

    const users = data.rows;
    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

export async function fetchFilteredUsers(query: string) {
  noStore();
  try {
    const data = await sql<UsersTable>`
		SELECT
		  users.id,
		  users.name,
		  users.email,
		  COUNT(posts.id) AS total_posts,
		  COUNT(CASE WHEN posts.status = 'open') AS total_open,
		  COUNNT(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_closed
		FROM users
		LEFT JOIN posts ON users.id = posts.author_id
		WHERE
		  users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`}
		GROUP BY users.id, users.name, users.email
		ORDER BY users.name ASC
	  `;

    const users = data.rows.map((user) => ({
      ...user,
    }));

    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch user table.');
  }
}

export async function getUser(email: string) {
  noStore();
  try {
    const user = await sql`SELECT * from USERS where email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
