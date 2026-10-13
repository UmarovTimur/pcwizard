import type { CollectionConfig } from "payload";
import { slugFromTitle } from "../slug";

export const STOCK = [
  { label: "В наличии", value: "in_stock" },
  { label: "Под заказ", value: "on_order" },
  { label: "Нет в наличии", value: "out" },
] as const;

export const CONDITION = [
  { label: "Новое", value: "new" },
  { label: "Б/У", value: "used" },
] as const;

/**
 * Parts in the catalog. Every product is a row in the catalog table; a product with photos,
 * a description or specs also gets its own page (/catalog/<slug>), and its row is marked
 * and clickable.
 */
export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Товар", plural: "Товары" },
  admin: {
    useAsTitle: "title",
    group: "Каталог",
    defaultColumns: ["title", "category", "price", "stock", "published"],
    listSearchableFields: ["title", "brand", "summary"],
  },
  // Visitors see only published products; signed-in admins see everything.
  access: { read: ({ req }) => (req.user ? true : { published: { equals: true } }) },
  fields: [
    { name: "title", type: "text", required: true, label: "Название", admin: { description: "Например «MSI GeForce RTX 4070 Ventus 2X 12 ГБ»" } },
    {
      type: "row",
      fields: [
        { name: "category", type: "relationship", relationTo: "categories", required: true, label: "Категория" },
        { name: "brand", type: "text", label: "Бренд" },
      ],
    },
    {
      name: "summary",
      type: "text",
      label: "Кратко",
      admin: { description: "Главное одной строкой — видно в таблице каталога, например «12 ГБ GDDR6X · 192 бит · 200 Вт»" },
    },
    {
      type: "row",
      fields: [
        { name: "price", type: "number", min: 0, label: "Цена, сум", admin: { description: "Пусто — «цена по запросу»" } },
        { name: "stock", type: "select", required: true, defaultValue: "in_stock", label: "Наличие", options: [...STOCK] },
        { name: "condition", type: "select", required: true, defaultValue: "new", label: "Состояние", options: [...CONDITION] },
      ],
    },
    {
      type: "collapsible",
      label: "Страница товара",
      admin: { description: "Если добавить фото, описание или характеристики, у товара появится своя страница, а строка в каталоге станет кликабельной." },
      fields: [
        { name: "photos", type: "upload", relationTo: "media", hasMany: true, label: "Фото", admin: { description: "Первое фото — обложка" } },
        { name: "description", type: "textarea", label: "Описание", admin: { description: "Пустая строка — новый абзац" } },
        {
          name: "specs",
          type: "array",
          label: "Характеристики",
          labels: { singular: "Строка", plural: "Строки" },
          fields: [
            {
              type: "row",
              fields: [
                { name: "name", type: "text", required: true, label: "Параметр" },
                { name: "value", type: "text", required: true, label: "Значение" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: true,
      label: "Показывать на сайте",
      admin: { position: "sidebar" },
    },
    {
      name: "sort",
      type: "number",
      label: "Порядок",
      admin: { position: "sidebar", description: "Меньше число — выше в своей категории. Пусто — по алфавиту после остальных." },
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      label: "Адрес страницы",
      admin: { position: "sidebar", description: "/catalog/<адрес>. Заполняется сам из названия." },
      hooks: { beforeValidate: [slugFromTitle] },
    },
  ],
};
