import type { Payload } from "payload";

// Starting sections of the parts catalog. Created once, when there are no categories yet;
// after that they are edited in the admin.
const DEFAULT_CATEGORIES = [
  "Видеокарты",
  "Процессоры",
  "Материнские платы",
  "Оперативная память",
  "Накопители SSD и HDD",
  "Блоки питания",
  "Корпуса",
  "Охлаждение",
  "Мониторы",
  "Периферия",
];

export async function seedCategories(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: "categories" });
  if (totalDocs) return;
  for (const [i, title] of DEFAULT_CATEGORIES.entries()) {
    await payload.create({ collection: "categories", data: { title, order: (i + 1) * 10 } });
  }
  payload.logger.info(`Created ${DEFAULT_CATEGORIES.length} default catalog categories`);
}
