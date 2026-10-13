import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";
import { posts } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/blog";
import { works } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/content";
import { landings } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/landings";

// Catalog products that have their own page; the sitemap still renders if the database is down.
async function productUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const groups = await getCatalog();
    return groups.flatMap((g) => g.rows.flatMap((r) => (r.href ? [{ url: absoluteUrl(r.href), changeFrequency: "weekly" as const, priority: 0.6 }] : [])));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Built per request, so new products show up without a rebuild
  await connection();
  const latest = posts.reduce((max, p) => (p.updated > max ? p.updated : max), "");
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...landings.map((l) => ({ url: absoluteUrl(`/${l.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: absoluteUrl("/catalog"), changeFrequency: "daily", priority: 0.8 },
    ...(await productUrls()),
    { url: absoluteUrl("/portfolio"), changeFrequency: "monthly", priority: 0.7 },
    ...works.projects.map((b) => ({ url: absoluteUrl(`/portfolio/${b.slug}`), changeFrequency: "yearly" as const, priority: 0.6 })),
    { url: absoluteUrl("/blog"), lastModified: latest, changeFrequency: "weekly", priority: 0.6 },
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updated, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
