import { toJsonLd } from "@/lib/site";

/** schema.org structured data as a JSON-LD script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(data) }} />;
}
