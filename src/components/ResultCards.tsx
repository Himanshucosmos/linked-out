"use client";

import React, { useState } from "react";
import { Copy, Check, ShieldAlert } from "lucide-react";
import styles from "../app/page.module.css";

type ResultCardsProps = {
  post: string | null;
};

export default function ResultCards({ post }: ResultCardsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!post) return;
    navigator.clipboard.writeText(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!post) {
    return (
      <div className={styles.emptyState}>
        <ShieldAlert size={44} className={styles.emptyIcon} />
        <h3 className={styles.emptyText}>Waiting for a Target</h3>
        <p className={styles.emptySubtext}>
          Fill in the details and hit Roast & Expose to generate your post.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Your Post 🔥📢</h2>
          <button
            className={styles.copyBtn}
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
          </button>
        </div>
        <div className={styles.cardContent}>
          {post.split('\n\n').map((para, i) => (
            <p key={i} style={{ marginBottom: '0.9rem', lineHeight: '1.75' }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      <button className={styles.combinedCopyBtn} onClick={handleCopy}>
        {copied ? (
          <>
            <Check size={18} />
            Copied — Go Post It!
          </>
        ) : (
          <>
            <Copy size={18} />
            Copy & Post on LinkedIn
          </>
        )}
      </button>
    </div>
  );
}
