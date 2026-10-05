import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { posts } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/blog";
import { landings } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/landings";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = posts.reduce((max, p) => (p.updated > max ? p.updated : max), "");
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...landings.map((l) => ({ url: absoluteUrl(`/${l.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: absoluteUrl("/blog"), lastModified: latest, changeFrequency: "weekly", priority: 0.6 },
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updated, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
