"use client";

import { useState } from "react";
import RoastForm from "@/components/RoastForm";
import ResultCards from "@/components/ResultCards";
import styles from "./page.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ post: string | null }>({
    post: null,
  });

  const handleSubmit = async (data: {
    linkedinUrl: string;
    profileDetails: string;
    dmText: string;
    context: string;
    imageBase64: string | null;
  }) => {
    setIsLoading(true);
    setResults({ post: null });

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "Failed to generate. Please wait a moment and try again.");
      }

      setResults({ post: json.post });
    } catch (error: any) {
      console.error("Error generating roast:", error);
      setResults({
        post: `⚠️ ${error?.message ?? "Something went wrong. Please wait a few seconds and try again."}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.badge}>⚡ AI-Powered Harassment Exposer</div>
        <h1 className={styles.title}>LinkedOut</h1>
        <p className={styles.tagline}>
          They thought LinkedIn was Tinder. Let&apos;s fix that.
        </p>
        <hr className={styles.divider} />
      </header>

      <main className={styles.mainContent}>
        <RoastForm onSubmit={handleSubmit} isLoading={isLoading} />
        <ResultCards post={results.post} />
      </main>
    </div>
  );
}
