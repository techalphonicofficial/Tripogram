export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const robotsContent = `
User-agent: *
Allow: /


# Disallow sensitive/system paths
Disallow: /admin/
Disallow: /api/
Disallow: /login/
Disallow: /dashboard/
Disallow: /checkout/
Disallow: /cart/
Disallow: /api/
Disallow: /storage/
Disallow: /vendor/
Disallow: /private/
Disallow: /shopdetail/
Disallow: /blog?page=7
Disallow: /blog?page=8
Disallow: /blog?page=8
Disallow: /terms-and-conditions
Disallow: /feedback.php
Disallow: /11q1

# Allow AI crawlers
User-agent: GPTBot
Allow: /
 
User-agent: ChatGPT-User
Allow: /
 
User-agent: OAI-SearchBot
Allow: /
 
User-agent: Google-Extended
Allow: /
 
User-agent: PerplexityBot
Allow: /
 
User-agent: Googlebot
Allow: /
 
User-agent: ClaudeBot
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tripogramclub.com'}/sitemap.xml
`.trim();

  return new Response(robotsContent, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store",
    },
  });
}
