import React from 'react';
import { CurrentPost, PostForm } from '@/app/lib/definitions';
import { fetchCurrentPost } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { reverseGeocode, formatTimeForDisplay } from '@/app/lib/utils';

export default async function Page({ params }: { params: { id: string } }) {

    const id = params.id;
    const [post] : [CurrentPost | undefined ] = await Promise.all([
        fetchCurrentPost(id),
      ]);

    if (!post) {
        notFound();
    }

    return (
        <main>
        <div className="container mx-auto my-8 p-4">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">{reverseGeocode(post.start_latitude, post.start_longitude)} to {reverseGeocode(post.end_latitude, post.end_longitude)}</h1>
                <p className="text-gray-600 mb-2">Posted: {post.name} ({post.email}) at {formatTimeForDisplay(post.post_time.toString())}</p>
                <p className="text-gray-600 mb-2">Ride Time: {formatTimeForDisplay(post.ride_time.toString())}</p>
                <p className="text-gray-600 mb-2">Service: {post.ride_service}</p>
                <p className="text-gray-600 mb-2">Carpoolers: {post.carpoolers}</p>
                <p className="text-gray-600 mb-2">Status: {post.status}</p>
                <p className="text-gray-700 mt-4">{post.description}</p>
            </div>
        </div>
        </main>
    );
}
