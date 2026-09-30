"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import BackHomeLink from "../components/backHomeLink";
import type { BlogPostSummary } from "../../lib/blog";
import styles from "./page.module.css";

export default function NewsBrowser({ posts }: { posts: BlogPostSummary[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All posts");
  const tags = ["All posts", ...new Set(posts.map((post) => post.category))];
  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = activeTag === "All posts" || post.category === activeTag;
      const matchesSearch = !normalized ||
        `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(normalized);
      return matchesTag && matchesSearch;
    });
  }, [activeTag, posts, query]);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <p className={styles.brand}>News<span>.</span></p>
          <p className={styles.sidebarIntro}>Notes on making, learning, and whatever catches my attention.</p>

          <label className={styles.searchBox}>
            <span aria-hidden="true">⌕</span>
            <span className={styles.visuallyHidden}>Search posts</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search posts"
            />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
          </label>

          <div className={styles.tagPanel}>
            <p className={styles.panelLabel}>Explore by topic</p>
            <nav aria-label="Filter posts by topic">
              {tags.map((tag) => {
                const count = tag === "All posts" ? posts.length : posts.filter((post) => post.category === tag).length;
                return (
                  <button
                    key={tag}
                    type="button"
                    className={activeTag === tag ? styles.activeTag : ""}
                    aria-pressed={activeTag === tag}
                    onClick={() => setActiveTag(tag)}
                  >
                    <span>{tag}</span><span>{String(count).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <p className={styles.sidebarFoot}>A personal archive<br />Updated as I go</p>
        </aside>

        <section className={styles.content} aria-labelledby="feed-title">
          <header className={styles.feedHeader}>
            <div>
              <p className={styles.kicker}>The journal / {String(filteredPosts.length).padStart(2, "0")} posts</p>
              <h1 id="feed-title">Ideas worth keeping.</h1>
            </div>
            <BackHomeLink className={styles.headerHome}>
              <span aria-hidden="true">←</span> Home
            </BackHomeLink>
          </header>

          {filteredPosts.length > 0 ? (
            <div className={styles.postGrid}>
              {filteredPosts.map((post, index) => (
                <Link key={post.slug} href={`/News/${post.slug}`} className={styles.postCard}>
                  <div className={styles.thumbnail}>
                    <Image
                      src={post.thumbnail}
                      alt={post.thumbnailAlt}
                      fill
                      sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, (max-width: 1300px) 33vw, 25vw"
                      priority={index < 4}
                    />
                    <span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.readTime}>{post.readTime}</span>
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.category}>{post.category}</span>
                    <time dateTime={post.publishedAt}>{new Date(`${post.publishedAt}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}</time>
                  </div>
                  <h2>{post.title}</h2>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  <span className={styles.cardArrow} aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No posts match that search. Try another phrase or topic.</p>
          )}
        </section>
      </div>
    </main>
  );
}