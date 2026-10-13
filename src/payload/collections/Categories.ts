import type { CollectionConfig } from "payload";
import { slugFromTitle } from "../slug";

/** Catalog sections: each becomes a group in the catalog table, in `order`. */
export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Категория", plural: "Категории" },
  defaultSort: "order",
  admin: { useAsTitle: "title", group: "Каталог", defaultColumns: ["title", "order", "slug"] },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true, label: "Название" },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      label: "Порядок",
      admin: { description: "Меньше число — выше в каталоге" },
    },
    { name: "description", type: "textarea", label: "Описание", admin: { description: "Короткая строка под названием категории в каталоге. Необязательно." } },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      label: "Адрес",
      admin: { position: "sidebar", description: "Якорь в каталоге (/catalog#адрес). Заполняется сам из названия." },
      hooks: { beforeValidate: [slugFromTitle] },
    },
  ],
};
