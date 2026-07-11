/**
 * robots.txt — sallii sivuston indeksoinnin, estää /api/, viittaa sitemap.xml:ään.
 */
export default function robotsTxt(req: Request): Response {
  const origin = new URL(req.url).origin;
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
