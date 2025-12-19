import React from "react";

export default function RobotsText() {
  const siteUrl = "https://yourmindstylist.com";
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Disallow admin areas
Disallow: /app/Admin*
Disallow: /app/Manager*
Disallow: /app/Studio*

# Crawl-delay
Crawl-delay: 1`;

  return (
    <div className="min-h-screen bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-4xl text-[#1E3A32] mb-8">Robots.txt</h1>
        <div className="bg-white p-6 rounded-lg">
          <pre className="text-sm text-[#2B2725] whitespace-pre-wrap">
            {robotsTxt}
          </pre>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const blob = new Blob([robotsTxt], { type: 'text/plain' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'robots.txt';
              a.click();
            }}
            className="px-6 py-3 bg-[#1E3A32] text-white hover:bg-[#2B2725] transition-colors"
          >
            Download robots.txt
          </button>
        </div>
      </div>
    </div>
  );
}