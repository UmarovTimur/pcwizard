import type { FieldHook } from "payload";

// Cyrillic → Latin for page addresses: "Видеокарта RTX 4070" → "videokarta-rtx-4070"
const MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "",
  ы: "y", ь: "", э: "e", ю: "yu", я: "ya", ў: "o", қ: "q", ғ: "g", ҳ: "h",
};

export const slugify = (text: string) =>
  [...text.toLowerCase()]
    .map((c) => MAP[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Fills an empty slug from the document's title, and normalises one typed by hand. */
export const slugFromTitle: FieldHook = ({ value, data }) => {
  const source = typeof value === "string" && value.trim() ? value : typeof data?.title === "string" ? data.title : "";
  return source ? slugify(source) : value;
};
