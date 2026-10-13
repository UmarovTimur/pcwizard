import config from "@payload-config";
import { getPayload } from "payload";
import type { Category, Media, Product } from "@/payload-types";
import type { CatalogGroup } from "./catalog-shared";

// Parts catalog, read from the admin panel (Payload CMS, Postgres) on each request.

const media = (m: number | Media | null | undefined) => (m && typeof m === "object" ? m : null);
export const photosOf = (p: Product) => (p.photos ?? []).map(media).filter((m): m is Media => !!m?.url);

/** A product gets its own page (and a clickable row) once it has photos, a description or specs. */
export const hasPage = (p: Product) => photosOf(p).length > 0 || !!p.description?.trim() || (p.specs?.length ?? 0) > 0;

const getClient = () => getPayload({ config });

/** Published products grouped by category, in category order; empty categories are left out. */
export async function getCatalog(): Promise<CatalogGroup[]> {
  const payload = await getClient();
  const [categories, products] = await Promise.all([
    payload.find({ collection: "categories", sort: "order", limit: 500, depth: 0 }),
    payload.find({ collection: "products", where: { published: { equals: true } }, limit: 5000, depth: 1 }),
  ]);

  const byCategory = new Map<number, Product[]>();
  for (const p of products.docs) {
    const id = typeof p.category === "object" ? p.category.id : p.category;
    byCategory.set(id, [...(byCategory.get(id) ?? []), p]);
  }

  return categories.docs.flatMap((c: Category) => {
    const items = (byCategory.get(c.id) ?? []).sort(
      (a, b) => (a.sort ?? Infinity) - (b.sort ?? Infinity) || a.title.localeCompare(b.title, "ru"),
    );
    if (!items.length) return [];
    return [
      {
        id: c.id,
        title: c.title,
        slug: c.slug ?? String(c.id),
        description: c.description ?? null,
        rows: items.map((p) => {
          const cover = photosOf(p)[0];
          return {
            id: p.id,
            title: p.title,
            brand: p.brand ?? null,
            summary: p.summary ?? null,
            price: p.price ?? null,
            stock: p.stock,
            condition: p.condition,
            href: hasPage(p) && p.slug ? `/catalog/${p.slug}` : null,
            thumb: cover ? (cover.sizes?.thumb?.url ?? cover.url ?? null) : null,
          };
        }),
      },
    ];
  });
}

/** A published product that has its own page, with its category and photos. */
export async function getProduct(slug: string) {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "products",
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 1,
  });
  const product = docs[0];
  return product && hasPage(product) ? product : null;
}
