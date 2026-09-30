"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BackHomeLink from "../components/backHomeLink";
import type { GalleryItem } from "./galleryItems";
import styles from "./page.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GalleryBrowser({ items }: { items: GalleryItem[] }) {
  const pageRef = useRef<HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("All years");
  const years = ["All years", ...new Set(items.map((item) => item.createdAt.slice(0, 4)))];
  const archiveItems = useMemo(() => items
    .filter((item) => year === "All years" || item.createdAt.startsWith(year))
    .filter((item) => `${item.name} ${item.description} ${item.medium}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [items, query, year]);

  useGSAP(() => {
    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const artworks = gsap.utils.toArray<HTMLElement>(`.${styles.artwork}`);
      const captions = gsap.utils.toArray<HTMLElement>(`.${styles.slideCaption}`);

      gsap.set(artworks.slice(1), { autoAlpha: 0, scale: 1.08 });
      gsap.set(captions.slice(1), { autoAlpha: 0, y: 20 });

      const sequence = gsap.timeline({
        scrollTrigger: {
          trigger: `.${styles.scrollGallery}`,
          start: "top top",
          end: () => `+=${Math.max(1, artworks.length - 1) * window.innerHeight}`,
          scrub: 1,
        },
      });

      artworks.slice(1).forEach((artwork, index) => {
        const position = index + 0.45;
        sequence
          .to(artworks[index], { autoAlpha: 0, scale: 0.94, ease: "none", duration: 0.55 }, position)
          .to(artwork, { autoAlpha: 1, scale: 1, ease: "none", duration: 0.55 }, position)
          .to(captions[index], { autoAlpha: 0, y: -18, ease: "none", duration: 0.55 }, position)
          .to(captions[index + 1], { autoAlpha: 1, y: 0, ease: "none", duration: 0.55 }, position);
      });

    });

    return () => motion.revert();
  }, { scope: pageRef });

  return (
    <main ref={pageRef} className={styles.page}>
      <div className={styles.topbar}>
        <p className={styles.wordmark}>Gallery<span>.</span></p>
        <BackHomeLink className={styles.homeLink}>
          <span aria-hidden="true">↖</span> Home
        </BackHomeLink>
      </div>

      <section className={styles.scrollGallery} aria-label="Scrollable gallery collection">
        <div className={styles.stage}>
          <div className={styles.stageCount}>01 / {String(items.length).padStart(2, "0")}</div>
          <div className={styles.artworkStack}>
            {items.map((item, index) => (
              <button
                key={item.src}
                type="button"
                className={`${styles.artwork} ${index === 0 ? styles.artworkActive : ""}`}
                onClick={() => setSelectedItem(item)}
                aria-label={`Open ${item.name}`}
              >
                <Image src={item.src} alt={item.name} fill priority={index === 0} sizes="(max-width: 700px) 84vw, 68vw" />
              </button>
            ))}
          </div>
          <div className={styles.stageCaptionStack}>
            {items.map((item, index) => (
              <div key={item.src} className={`${styles.slideCaption} ${index === 0 ? styles.captionActive : ""}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
                <small>{item.medium}</small>
                <time dateTime={item.createdAt}>{item.createdAt}</time>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.slideTrack}>
          {items.map((item) => (
            <article key={item.src} className={styles.slide} aria-label={item.name}>
              <span className={styles.slideMarker}>{item.name}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.archive} aria-labelledby="archive-title">
        <div className={styles.archiveHeader}>
          <div>
            <p className={styles.kicker}>The archive / {String(archiveItems.length).padStart(2, "0")} pieces</p>
            <h2 id="archive-title">Browse the gallery.</h2>
          </div>
          <div className={styles.archiveControls}>
            <label className={styles.searchBox}>
              <span aria-hidden="true">⌕</span>
              <span className={styles.visuallyHidden}>Search gallery</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
            </label>
            <label className={styles.yearFilter}>
              <span className={styles.visuallyHidden}>Filter by year</span>
              <select value={year} onChange={(event) => setYear(event.target.value)}>
                {years.map((entry) => <option key={entry}>{entry}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div className={styles.archiveGrid}>
          {archiveItems.map((item) => (
            <button key={item.src} type="button" className={styles.archiveCard} onClick={() => setSelectedItem(item)}>
              <span className={styles.archiveImage}><Image src={item.src} alt={item.name} fill sizes="(max-width: 700px) 100vw, 25vw" /></span>
              <span className={styles.archiveCardInfo}><strong>{item.name}</strong><small>{item.createdAt} · {item.medium}</small></span>
            </button>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>More images as they take shape.</span>
        <BackHomeLink className={styles.footerLink}>Back home ↑</BackHomeLink>
      </footer>

      {selectedItem && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={selectedItem.name}>
          <button type="button" className={styles.closeButton} onClick={() => setSelectedItem(null)} aria-label="Close image">×</button>
          <div className={styles.lightboxImage}>
            <Image src={selectedItem.src} alt={selectedItem.name} width={1400} height={1000} sizes="90vw" />
          </div>
          <div className={styles.lightboxInfo}>
            <p className={styles.kicker}>{selectedItem.medium}</p>
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.description}</p>
          </div>
        </div>
      )}
    </main>
  );
}
