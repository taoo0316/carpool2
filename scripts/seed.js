const { db } = require('@vercel/postgres');
const {
  users,
  posts,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');
const axios = require('axios');

async function geocodeAddress(address) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: 'AIzaSyAK01h9k7fI3BflEgwN169OX6oWptyqSc0'
      }
    });

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } else {
      // Handle the case where the address is not found or API limits are exceeded
      console.error(`Error processing: ${address}`);
      console.error('Geocoding failed: ' + response.data.status);
      return null;
    }
  } catch (error) {
    // Handle network errors
    console.error('Error during geocoding: ', error);
    return null;
  }
};

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

    // Create the "posts" table with modifications for location using POINT type
    await client.sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        author_id UUID NOT NULL,
        carpoolers INT NOT NULL,
        status TEXT NOT NULL,
        ride_service TEXT NOT NULL,
        ride_time TIMESTAMP NOT NULL,
        post_time TIMESTAMP NOT NULL,
        description TEXT,
        start_location POINT NOT NULL,
        end_location POINT NOT NULL
      );
    `;

    console.log(`Created "posts" table`);

    // Insert data into the "posts" table
    const insertedPostsPromises = posts.map(async (post) => {
      // Geocode start and end locations for each post
      const startGeoLocation = await geocodeAddress(post.start_location);
      const endGeoLocation = await geocodeAddress(post.end_location);

      if (!startGeoLocation || !endGeoLocation) {
        throw new Error('Geocoding failed for one or more addresses.');
      }

      return client.sql`
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
          point(${startGeoLocation.latitude}, ${startGeoLocation.longitude}), 
          point(${endGeoLocation.latitude}, ${endGeoLocation.longitude}), 
          ${post.ride_time},
          ${post.post_time},
          ${post.ride_service},   
          ${post.description},
          ${post.carpoolers},
          ${post.status})
        ON CONFLICT (id) DO NOTHING;
      `;
    });

    const insertedPosts = await Promise.all(insertedPostsPromises);
    console.log(`Seeded ${insertedPosts.length} posts`);

    return {
      createTable: true,
      posts: insertedPosts,
    };
  } catch (error) {
    console.error('Error seeding posts:', error);
    throw error;
  }
}


async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedPosts(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
