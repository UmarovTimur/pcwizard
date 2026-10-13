import type { Product } from "@/payload-types";

// Catalog types, labels and formatting shared by the server pages and the client table
// (no server imports here, so the table can use it in the browser).

export type Stock = Product["stock"];
export type Condition = Product["condition"];

/** One row of the catalog table. `href` is set only for products that have their own page. */
export interface CatalogRow {
  id: number;
  title: string;
  brand: string | null;
  summary: string | null;
  price: number | null;
  stock: Stock;
  condition: Condition;
  href: string | null;
  thumb: string | null;
}

export interface CatalogGroup {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  rows: CatalogRow[];
}

export const STOCK_LABEL: Record<Stock, string> = { in_stock: "В наличии", on_order: "Под заказ", out: "Нет в наличии" };
export const CONDITION_LABEL: Record<Condition, string> = { new: "Новое", used: "Б/У" };

export const formatPrice = (price: number | null | undefined) =>
  price == null ? "Цена по запросу" : `${new Intl.NumberFormat("ru-RU").format(price)} сум`;
