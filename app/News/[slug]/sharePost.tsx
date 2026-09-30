"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function SharePost({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState("");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setShareError("");
    } catch {
      setShareError("Copy is unavailable in this browser.");
    }
  };

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setShareError("Sharing is unavailable right now.");
        }
      }
      return;
    }
    await copyLink();
  };

  return (
    <div className={styles.share}>
      <span className={styles.shareLabel}>Pass it along</span>
      <div className={styles.shareActions}>
        <button type="button" onClick={sharePost}>
          <span aria-hidden="true">↗</span> Share post
        </button>
        <button type="button" onClick={copyLink}>
          <span aria-hidden="true">⧉</span> {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
      {shareError && <span className={styles.shareError} role="status">{shareError}</span>}
    </div>
  );
}