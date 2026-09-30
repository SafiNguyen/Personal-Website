import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import BackHomeLink from "../../components/backHomeLink";
import { getBlogPost, getBlogPosts } from "../../../lib/blog";
import SharePost from "./sharePost";
import styles from "./page.module.css";

export async function generateStaticParams() {
  return getBlogPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/News/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: `${post.title} | News`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: PageProps<"/News/[slug]">) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.topline}>
            <Link href="/News" className={styles.backLink}><span aria-hidden="true">←</span> All posts</Link>
            <BackHomeLink className={styles.homeLink}>Home</BackHomeLink>
          </div>
          <div className={styles.meta}>
            <span>{post.category}</span>
            <time dateTime={post.publishedAt}>{new Date(`${post.publishedAt}T12:00:00`).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</time>
            <span>{post.readTime} read</span>
          </div>
          <h1>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <div className={styles.cover}>
            <Image src={post.thumbnail} alt={post.thumbnailAlt} fill priority sizes="(max-width: 760px) 100vw, 980px" />
          </div>
        </header>

        <div className={styles.body}>
          <ReactMarkdown
            components={{
              a: ({ href, children, ...props }) => (
                <a href={href} {...props} target="_blank" rel="noreferrer">{children}</a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className={styles.postFooter}>
          <p className={styles.endMark}>End of note <span aria-hidden="true">✳</span></p>
          <SharePost title={post.title} />
          <Link href="/News" className={styles.moreLink}>← More notes</Link>
        </footer>
      </article>
    </main>
  );
}