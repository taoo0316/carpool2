const { db } = require('@vercel/postgres');
const {
  users,
  posts,
  comments,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedPosts(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "posts" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID NOT NULL,
    carpoolers INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    ride_service VARCHAR(255) NOT NULL,
    ride_time DATETIME NOT NULL,
    post_time DATETIME NOT NULL,
    description STRING,
    start_location: STRING NOT NULL,
    end_location: STRING NOT NULL,
  );
`;

    console.log(`Created "posts" table`);

    // Insert data into the "invoices" table
    const insertedPosts = await Promise.all(
      posts.map(
        (post) => client.sql`
        INSERT INTO posts (
          author_id,
          start_location,
          end_location,
          ride_time,
          post_time,
          ride_service,
          description,
          carpoolers,
          status)
        VALUES (
          ${post.author_id}, 
          ${post.start_location}, 
          ${post.end_location}, 
          ${post.ride_time},
          ${post.post_time},
          ${post.ride_service},   
          ${post.description},
          ${post.carpoolers},
          ${post.status})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedPosts.length} posts`);

    return {
      createTable,
      posts: insertedPosts,
    };
  } catch (error) {
    console.error('Error seeding posts:', error);
    throw error;
  }
}

async function seedComments(client) {
  try {
    // Create the "comments" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        post_id UUID NOT NULL,
        author_id UUID NOT NULL,
        content STRING,
        comment_time DATETIME
      );
    `;

    console.log(`Created "comments" table`);

    // Insert data into the "comments" table
    const insertedComments = await Promise.all(
      comments.map(
        (comment) => client.sql`
        INSERT INTO comments (
          post_id,
          author_id,
          content,
          comment_time,
        VALUES (
          ${comment.post_id}, 
          ${comment.author_id}, 
          ${comment.content}, 
          ${comment.comment_time})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedComments.length} comments`);

    return {
      createTable,
      revenue: insertedComments,
    };
  } catch (error) {
    console.error('Error seeding comments:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedPosts(client);
  await seedComments(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
