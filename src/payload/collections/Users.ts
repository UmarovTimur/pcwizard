import type { CollectionConfig } from "payload";

/** Admin accounts: everyone here can sign in to /admin and edit the catalog. They sign in with a login, no email needed. */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Пользователь", plural: "Пользователи" },
  admin: { useAsTitle: "username", group: "Настройки" },
  auth: { loginWithUsername: { allowEmailLogin: false, requireEmail: false } },
  fields: [{ name: "name", type: "text", label: "Имя" }],
};
