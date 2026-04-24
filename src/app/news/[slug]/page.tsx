import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, isNotNull } from "drizzle-orm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { db } from "@/lib/db/client";
import { news } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

async function loadPost(slug: string) {
  const [row] = await db
    .select()
    .from(news)
    .where(and(eq(news.slug, slug), isNotNull(news.publishedAt)))
    .limit(1);
  return row;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return { title: "News non trovata" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      type: "article",
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  return (
    <article className="relative pt-32 pb-24 md:pt-48 md:pb-32">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <Link
          href="/news"
          className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint hover:text-yellow transition-colors mb-10"
        >
          ← Tutte le news
        </Link>

        <time className="block font-mono text-xs uppercase tracking-widest text-yellow mb-4">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : ""}
        </time>

        <h1 className="text-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] mb-8">
          {post.title}
        </h1>

        <p className="text-lg md:text-xl text-ink-dim leading-relaxed mb-12 max-w-2xl">
          {post.excerpt}
        </p>

        {post.coverImage && (
          <div className="relative w-full aspect-[16/9] mb-12 border border-white/10 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="prose-news">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {post.body}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
