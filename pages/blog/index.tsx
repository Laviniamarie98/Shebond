import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FaHeart, FaCalendarAlt, FaUser } from 'react-icons/fa';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Blog - SheBond</title>
      </Head>

      <div className="min-h-screen bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-8">
              <div className="flex items-center text-4xl font-bold text-amber-900 font-lovelace">
                <FaHeart className="text-amber-600 mr-2 w-10 h-10" />
                SheBond
              </div>
            </Link>
            <h1 className="text-4xl font-bold text-amber-900 font-lovelace mb-4">Pregnancy Blog</h1>
            <p className="text-lg text-amber-800 max-w-3xl mx-auto">
              Expert advice, tips, and stories to support you through your pregnancy journey
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {post.image_url && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="object-cover w-full h-48"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-amber-600 mb-2">
                      <FaCalendarAlt className="mr-2" />
                      {new Date(post.created_at).toLocaleDateString()}
                      <FaUser className="ml-4 mr-2" />
                      {post.author}
                    </div>
                    <h2 className="text-xl font-bold text-amber-900 font-lovelace mb-2">
                      {post.title}
                    </h2>
                    <p className="text-amber-800 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium"
                    >
                      Read More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 