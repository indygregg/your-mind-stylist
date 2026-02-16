import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function Sitemap() {
  const [xml, setXml] = useState("");

  useEffect(() => {
    const generateSitemap = async () => {
      const siteUrl = "https://yourmindstylist.com";
      
      // Static pages
      const staticPages = [
        { loc: "/", priority: "1.0" },
        { loc: "/about", priority: "0.9" },
        { loc: "/blog", priority: "0.9" },
        { loc: "/programs", priority: "0.9" },
        { loc: "/bookings", priority: "0.8" },
        { loc: "/contact", priority: "0.8" },
        { loc: "/consultations", priority: "0.8" },
        { loc: "/lens", priority: "0.8" },
        { loc: "/cleaning-out-your-closet", priority: "0.8" },
        { loc: "/pocket-mindset", priority: "0.8" },
        { loc: "/learn-hypnosis", priority: "0.8" },
        { loc: "/podcast", priority: "0.7" },
        { loc: "/accessibility", priority: "0.5" },
      ];

      // Fetch published blog posts
      const blogPosts = await base44.entities.BlogPost.filter({ status: "published" });
      const blogUrls = blogPosts.map(post => ({
        loc: `/blog/${post.slug}`,
        lastmod: post.updated_date || post.publish_date,
        priority: "0.7"
      }));

      // Fetch published products
      const products = await base44.entities.Product.filter({ status: "published" });
      const productUrls = products.map(product => ({
        loc: `/product?slug=${product.slug}`,
        lastmod: product.updated_date,
        priority: "0.8"
      }));

      // Generate XML
      const urls = [...staticPages, ...blogUrls, ...productUrls];
      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${siteUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${new Date(url.lastmod).toISOString()}</lastmod>` : ''}
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      setXml(xmlContent);
    };

    generateSitemap();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-4xl text-[#1E3A32] mb-8">Sitemap</h1>
        <div className="bg-white p-6 rounded-lg">
          <pre className="text-xs text-[#2B2725] overflow-x-auto whitespace-pre-wrap">
            {xml || "Generating sitemap..."}
          </pre>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const blob = new Blob([xml], { type: 'application/xml' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'sitemap.xml';
              a.click();
            }}
            className="px-6 py-3 bg-[#1E3A32] text-white hover:bg-[#2B2725] transition-colors"
          >
            Download Sitemap XML
          </button>
        </div>
      </div>
    </div>
  );
}