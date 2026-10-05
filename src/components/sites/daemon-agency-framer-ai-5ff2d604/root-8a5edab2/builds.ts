// Типовые игровые сборки по бюджету. Используются на главной, на странице «Игровые ПК»
// и в статьях блога. ЗАМЕНИТЬ: сверяйте конфигурации с актуальными ценами раз в квартал.

export interface BudgetBuild {
  /** Бюджет в миллионах сум. */
  budget: number;
  slug: string;
  target: string;
  games: string;
  parts: { part: string; pick: string }[];
}

export const builds: BudgetBuild[] = [
  {
    budget: 7,
    slug: "igrovoy-pk-za-7-mln-sum",
    target: "Full HD, киберспорт",
    games: "CS2, Valorant, Dota 2, Fortnite — высокий FPS; новые AAA — на средних",
    parts: [
      { part: "Процессор", pick: "Ryzen 5 5600 / Core i3-12100F" },
      { part: "Видеокарта", pick: "RTX 5050 / RX 7600 / Arc B570" },
      { part: "Память", pick: "16 ГБ DDR4-3200 (2×8)" },
      { part: "Накопитель", pick: "SSD NVMe 512 ГБ – 1 ТБ" },
      { part: "Блок питания", pick: "550 Вт, 80+ Bronze" },
    ],
  },
  {
    budget: 10,
    slug: "igrovoy-pk-za-10-mln-sum",
    target: "Full HD, высокие настройки",
    games: "Киберспорт под 240 Гц, большинство AAA на высоких в 1080p",
    parts: [
      { part: "Процессор", pick: "Ryzen 5 5700X / Core i5-12400F" },
      { part: "Видеокарта", pick: "RTX 5060 / RX 9060 XT 8 ГБ" },
      { part: "Память", pick: "16–32 ГБ DDR4-3600" },
      { part: "Накопитель", pick: "SSD NVMe 1 ТБ" },
      { part: "Блок питания", pick: "650 Вт, 80+ Bronze" },
    ],
  },
  {
    budget: 15,
    slug: "igrovoy-pk-za-15-mln-sum",
    target: "2K (1440p), запас на годы",
    games: "AAA на высоких в 1440p, стриминг, монтаж",
    parts: [
      { part: "Процессор", pick: "Ryzen 5 7500F / 7600 (AM5)" },
      { part: "Видеокарта", pick: "RTX 5060 Ti 16 ГБ / RX 9060 XT 16 ГБ" },
      { part: "Память", pick: "32 ГБ DDR5-6000" },
      { part: "Накопитель", pick: "SSD NVMe 1 ТБ (PCIe 4.0)" },
      { part: "Блок питания", pick: "650 Вт, 80+ Gold" },
    ],
  },
  {
    budget: 25,
    slug: "igrovoy-pk-za-25-mln-sum",
    target: "2K на ультра, 4K",
    games: "AAA на ультра в 1440p, 4K с DLSS/FSR, 240+ FPS в шутерах",
    parts: [
      { part: "Процессор", pick: "Ryzen 7 7800X3D / 9800X3D" },
      { part: "Видеокарта", pick: "RTX 5070 Ti / RX 9070 XT" },
      { part: "Память", pick: "32 ГБ DDR5-6000 CL30" },
      { part: "Накопитель", pick: "SSD NVMe 2 ТБ (PCIe 4.0)" },
      { part: "Блок питания", pick: "850 Вт, 80+ Gold" },
    ],
  },
];

export const formatMln = (mln: number) => `${mln} млн сум`;
