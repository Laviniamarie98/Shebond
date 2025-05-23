import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { FaHeart, FaCalendarAlt, FaUser, FaArrowLeft } from 'react-icons/fa';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
}

export default function BlogPost() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-900 mb-4">Post not found</h1>
          <Link href="/blog" className="text-amber-700 hover:text-amber-800">
            Return to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} - SheBond Blog</title>
      </Head>

      <div className="min-h-screen bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-8">
            <FaArrowLeft className="mr-2" />
            Back to Blog
          </Link>

          <article className="bg-white rounded-xl shadow-md overflow-hidden">
            {post.image_url && (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="object-cover w-full h-96"
                />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center text-sm text-amber-600 mb-4">
                <FaCalendarAlt className="mr-2" />
                {new Date(post.created_at).toLocaleDateString()}
                <FaUser className="ml-4 mr-2" />
                {post.author}
              </div>
              <h1 className="text-3xl font-bold text-amber-900 font-lovelace mb-6">
                {post.title}
              </h1>
              <div className="prose prose-amber max-w-none">
                {post.content}
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
} 