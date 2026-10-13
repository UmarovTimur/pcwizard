import path from "path";
import type { CollectionConfig } from "payload";

/**
 * Uploaded photos. Files are stored on the server in ./media next to where the app runs, or in
 * MEDIA_DIR (keep that folder on a persistent volume); Payload serves them at
 * /api/media/file/<name> and makes smaller copies.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Фото", plural: "Фото" },
  admin: { group: "Каталог" },
  access: { read: () => true },
  upload: {
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), "media"),
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumb", width: 160, height: 160, position: "centre" },
      { name: "large", width: 1600, withoutEnlargement: true },
    ],
    adminThumbnail: "thumb",
  },
  fields: [{ name: "alt", type: "text", label: "Подпись", admin: { description: "Что на фото, для поисковиков. Можно не заполнять." } }],
};
