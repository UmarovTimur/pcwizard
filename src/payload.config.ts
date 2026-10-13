import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { ru } from "@payloadcms/translations/languages/ru";
import { buildConfig } from "payload";
import sharp from "sharp";
import { migrations } from "./migrations";
import { Categories } from "./payload/collections/Categories";
import { Media } from "./payload/collections/Media";
import { Products } from "./payload/collections/Products";
import { Users } from "./payload/collections/Users";
import { seedCategories } from "./payload/seed";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Admin panel at /admin (Payload CMS) for the parts catalog. Data lives in Postgres
// (DATABASE_URL); uploaded photos in <project>/media. In development the schema syncs itself;
// in production pending migrations from src/migrations run on start.
export default buildConfig({
  admin: {
    user: Users.slug,
    theme: "dark",
    meta: { titleSuffix: " — PcWizard_uz", icons: [{ url: "/favicon.ico" }] },
    components: {
      graphics: {
        Logo: "/payload/admin/Logo#Logo",
        Icon: "/payload/admin/Icon#Icon",
      },
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { ru, en }, fallbackLanguage: "ru" },
  collections: [Products, Categories, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
    // On the server (NODE_ENV=production) pending migrations run when the app starts
    prodMigrations: migrations,
  }),
  sharp,
  onInit: seedCategories,
});
