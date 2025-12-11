import React from "react";
import { Helmet } from "react-helmet";

export default function SEO({ 
  title, 
  description, 
  ogImage = "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=1200&h=630&fit=crop",
  canonical,
  article = false,
  author = "Roberta Fernandez",
  publishedTime,
}) {
  const fullTitle = title.includes("The Mind Stylist") 
    ? title 
    : `${title} | The Mind Stylist`;
  
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="The Mind Stylist" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Article specific */}
      {article && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
        </>
      )}
    </Helmet>
  );
}