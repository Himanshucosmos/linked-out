"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Flame, Loader2 } from "lucide-react";
import styles from "../app/page.module.css";

type RoastFormProps = {
  onSubmit: (data: {
    linkedinUrl: string;
    profileDetails: string;
    dmText: string;
    context: string;
    imageBase64: string | null;
  }) => Promise<void>;
  isLoading: boolean;
};

export default function RoastForm({ onSubmit, isLoading }: RoastFormProps) {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [profileDetails, setProfileDetails] = useState("");
  const [dmText, setDmText] = useState("");
  const [context, setContext] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageBase64 = null;
    
    if (file) {
      try {
        imageBase64 = await convertToBase64(file);
      } catch (err) {
        console.error("Failed to convert image", err);
      }
    }
    
    await onSubmit({ linkedinUrl, profileDetails, dmText, context, imageBase64 });
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <p className={styles.formSectionTitle}>Submit the Evidence</p>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Harasser's LinkedIn URL</label>
        <input
          type="url"
          required
          className={styles.input}
          placeholder="https://linkedin.com/in/the-audacity..."
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Profile Details <span style={{color:'#b82c3c'}}>★</span></label>
        <textarea
          className={styles.textarea}
          style={{ minHeight: '80px' }}
          placeholder="Paste their headline, job title & bio from their profile — this makes the roast 10× more personal"
          value={profileDetails}
          onChange={(e) => setProfileDetails(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>The Creepy DM</label>
        <textarea 
          className={styles.textarea} 
          placeholder="Paste the message here so we can analyze the lack of self-awareness..."
          value={dmText}
          onChange={(e) => setDmText(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Screenshot of the Crime</label>
        <div 
          className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            accept="image/*" 
            className={styles.fileInput} 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <UploadCloud size={32} color={isDragging ? "#dc143c" : "#666"} />
          <div className={styles.dropzoneText}>
            {file ? (
              <span style={{ color: "#fff", fontWeight: 500 }}>{file.name}</span>
            ) : (
              <span>Drag & drop a screenshot here, or click to upload</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Inside Jokes / Extra Context</label>
        <textarea 
          className={styles.textarea} 
          style={{ minHeight: "80px" }}
          placeholder="(Optional) Make the roast funnier - tell us what else makes this guy insufferable..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </div>

      <button 
        type="submit" 
        className={styles.submitBtn} 
        disabled={isLoading || (!linkedinUrl && !dmText && !file)}
      >
        {isLoading ? (
          <>
            <Loader2 className={styles.loadingSpinner} size={24} />
            Cooking up the roast...
          </>
        ) : (
          <>
            <Flame size={24} />
            Roast & Expose
          </>
        )}
      </button>
    </form>
  );
}
