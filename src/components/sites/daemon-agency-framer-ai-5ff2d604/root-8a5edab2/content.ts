// Весь текст страницы. Места, помеченные «ЗАМЕНИТЬ», — примеры: цены, цифры, отзывы,
// имена и контакты нужно заменить реальными данными. Картинки рендерит <Placeholder>.

export const brand = {
  name: "PcWizard_uz",
  tagline: "Сборка ПК на заказ, комплектующие, ремонт и диагностика по всему Узбекистану.",
};

// Ссылки с "/" работают и с внутренних страниц.
export const nav = [
  { label: "Главная", href: "/" },
  { label: "Игровые ПК", href: "/igrovye-pk" },
  { label: "Сборка ПК", href: "/sborka-kompyutera" },
  { label: "Каталог", href: "/catalog" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "Цены", href: "/#pricing" },
  { label: "Блог", href: "/blog" },
  { label: "Контакты", href: "#contact" },
];

export const hero = {
  // H1 повторяет главный запрос «сборка ПК на заказ».
  h1: "Сборка ПК на заказ",
  h1Lines: ["Сборка ПК", "на заказ"], // строки крупного заголовка (вместе = h1)
  // Самая дешёвая сборка из портфолио — 4 044 000 сум (337 $).
  priceFrom: { label: "Сборки от", value: "4 млн сум" },
  cta: { label: "Подобрать сборку", href: "#contact" }, // открывает попап с заявкой
  telegram: "Написать в Telegram",
  // Главные обещания — пиксельным списком под заголовком.
  trust: ["Гарантия 30 дней", "Тест под нагрузкой при вас", "Работаем по всему Узбекистану"],
};

export const services = {
  tag: "Наши услуги",
  heading: "Всё для вашего компьютера — от подбора деталей до ремонта",
  lead: "Сборка, комплектующие, ремонт и диагностика в одном месте.",
  items: [
    { title: "Сборка ПК на заказ", text: "Подбираем конфигурацию под игры, работу или учёбу и собираем под ключ.", href: "/sborka-kompyutera" },
    { title: "Комплектующие", text: "Видеокарты, процессоры, память, накопители и всё для апгрейда.", href: "/komplektuyushchie" },
    { title: "Ремонт", text: "Чиним компьютеры и ноутбуки: замена деталей, пайка, восстановление." },
    { title: "Диагностика", text: "Находим причину поломки и объясняем, что и зачем менять.", href: "/apgreyd" },
  ],
  cta: {
    text: "Расскажите, для чего нужен компьютер, — подберём конфигурацию под ваши задачи и бюджет.",
    label: "Написать нам",
    href: "#contact",
  },
};

export const capabilities = {
  tag: "Что мы делаем",
  items: [
    "Игровые компьютеры",
    "Рабочие станции",
    "ПК для стриминга",
    "Офисные компьютеры",
    "Апгрейд старого ПК",
    "Чистка и замена термопасты",
    "Установка Windows и драйверов",
    "Подбор и проверка комплектующих",
  ],
};

export const process = {
  marquee: "ОДНИ ИЗ САМЫХ НИЗКИХ ЦЕН НА РЫНКЕ",
  heading: "Как проходит сборка и\u00a0тестирование",
  // sticker — наклейка шага (public/images/stickers/<sticker>.png)
  steps: [
    { title: "Заявка", text: "Вы пишете, для чего нужен компьютер и на какой бюджет рассчитываете.", sticker: "headset" },
    { title: "Подбор", text: "Предлагаем конфигурацию и объясняем, за что вы платите в каждой детали.", sticker: "gamepad" },
    { title: "Сборка и\u00a0тесты", text: "Собираем, аккуратно прокладываем кабели и проверяем систему под нагрузкой.", sticker: "pc" },
    { title: "Выдача", text: "Показываем компьютер в работе и отдаём с гарантией 30 дней.", sticker: "gg" },
  ] as { title: string; text: string; sticker: string }[],
  cta: { text: "Готовы обсудить ваш будущий компьютер?", label: "Оставить заявку", href: "#contact" },
};

// Портфолио: реальные сборки PcWizard_uz (описания из постов в Telegram). Фото лежат в
// public/images/products/<папка>; первое фото в списке — обложка.
const shot = (folder: string, stamp: string, n: number) => `/images/products/${folder}/photo_${n}_${stamp}.jpg`;
const shots = (folder: string, stamp: string, order: number[]) => order.map((n) => shot(folder, stamp, n));

export interface Build {
  slug: string;
  /** Короткое имя сборки для карточек: «процессор + видеокарта». */
  name: string;
  /** H1 и заголовок страницы. */
  title: string;
  status: "sale" | "sold";
  /** Цена: в долларах и сумах; old* — цена до скидки. */
  price: { usd: number; uzs: number; oldUsd?: number; oldUzs?: number };
  /** Короткие пометки для карточки. */
  highlights: string[];
  /** Одна фраза: подзаголовок страницы и description для поиска. */
  summary: string;
  description: string[];
  specs: { part: string; value: string }[];
  /** Монитор, периферия и подарки для комплектов. */
  extras?: { title: string; items: string[] }[];
  /** «Состояние», ПО и т. п. */
  notes: string[];
  photos: string[];
}

const ready = ["Все кабели в комплекте", "Драйверы установлены", "Windows 11 Pro 64-bit", "Counter-Strike 2 установлен", "Всё проверено и готово к работе"];

export const works: { tag: string; heading: string; lead: string; all: { label: string; href: string }; projects: Build[] } = {
  tag: "Портфолио",
  heading: "Наши работы",
  lead: "Компьютеры, которые мы собрали: в продаже и уже проданные. Нажмите на сборку, чтобы посмотреть фото, конфигурацию и цену.",
  all: { label: "Все работы", href: "/portfolio" },
  projects: [
    {
      slug: "i5-12400f-rtx-2070-super",
      name: "i5-12400F + RTX 2070 Super",
      title: "Игровой ПК на i5-12400F и RTX 2070 Super",
      status: "sold",
      price: { usd: 600, uzs: 7_140_000 },
      highlights: ["Core i5-12400F", "RTX 2070 Super 8 ГБ", "16 ГБ DDR4"],
      summary: "Игровой компьютер на Intel Core i5-12400F и Palit RTX 2070 Super 8 ГБ: 16 ГБ памяти, NVMe SSD, Windows 11 и CS2 уже установлены.",
      description: [
        "Игровой компьютер на шестиядерном Intel Core i5-12400F и видеокарте Palit GeForce RTX 2070 Super JetStream 8 ГБ — для современных игр в Full HD на высоких настройках.",
        "Корпус XTECH со стеклом и тремя ARGB-вентиляторами, память T-Force Delta R с подсветкой, блок питания DeepCool на 750 Вт с запасом под апгрейд. Поставили Windows 11 Pro, драйверы и Counter-Strike 2 — можно играть сразу после покупки.",
      ],
      specs: [
        { part: "Процессор", value: "Intel Core i5-12400F" },
        { part: "Видеокарта", value: "Palit GeForce RTX 2070 Super JetStream 8 ГБ" },
        { part: "Материнская плата", value: "MSI H610M-E PRO" },
        { part: "Оперативная память", value: "TeamGroup T-Force Delta R DDR4 16 ГБ (2×8), 3200 МГц" },
        { part: "Накопитель", value: "M.2 NVMe SK Hynix 256 ГБ" },
        { part: "Охлаждение", value: "Tower S40, 120 мм RGB, 4 тепловые трубки" },
        { part: "Блок питания", value: "DeepCool PF750" },
        { part: "Корпус", value: "XTECH, 3×120 мм ARGB" },
      ],
      notes: ["Состояние идеальное", "Гарантия 30 дней", ...ready],
      photos: shots("1", "2026-10-06_03-30-49", [6, 7, 8, 1, 2, 3, 4, 5]),
    },
    {
      slug: "i5-9400f-rx-590",
      name: "i5-9400F + RX 590",
      title: "Игровой ПК на i5-9400F и RX 590",
      status: "sold",
      price: { usd: 347, uzs: 4_130_000 },
      highlights: ["Core i5-9400F", "Sapphire Nitro+ RX 590", "ASUS ROG Strix"],
      summary: "Бюджетный игровой ПК на Intel Core i5-9400F и Sapphire Nitro+ RX 590 8 ГБ с платой ASUS ROG Strix и 16 ГБ памяти.",
      description: [
        "Бюджетный игровой компьютер для киберспорта и популярных игр в Full HD: Intel Core i5-9400F и Sapphire Nitro+ Radeon RX 590 8 ГБ на плате ASUS ROG Strix B360-G Gaming.",
        "Память Patriot Viper Steel 3000 МГц, быстрый NVMe-накопитель Lexar и корпус GAMDIAS с пятью ARGB-вентиляторами. На фото задней стенки видно аккуратную укладку кабелей.",
      ],
      specs: [
        { part: "Процессор", value: "Intel Core i5-9400F" },
        { part: "Видеокарта", value: "Sapphire Nitro+ Radeon RX 590 8 ГБ" },
        { part: "Материнская плата", value: "ASUS ROG Strix B360-G Gaming" },
        { part: "Оперативная память", value: "Patriot Viper Steel DDR4 16 ГБ (2×8), 3000 МГц CL16" },
        { part: "Накопитель", value: "M.2 NVMe Lexar NM620 256 ГБ" },
        { part: "Охлаждение", value: "Tower S50, 120 мм RGB, 4 тепловые трубки" },
        { part: "Блок питания", value: "Ocypus Beta P700, 700 Вт" },
        { part: "Корпус", value: "GAMDIAS, 5×120 мм ARGB" },
      ],
      notes: ["Состояние идеальное", "Гарантия 30 дней"],
      photos: shots("2", "2026-10-06_04-19-37", [6, 7, 3, 4, 5, 2, 1, 8]),
    },
    {
      slug: "komplekt-i5-9400f-rx-580-monitor-144hz",
      name: "Комплект: ПК + монитор 144 Гц",
      title: "Игровой комплект: ПК на i5-9400F и RX 580 + монитор 144 Гц",
      status: "sold",
      price: { usd: 465, uzs: 5_333_500, oldUsd: 485, oldUzs: 5_771_500 },
      highlights: ["i5-9400F + RX 580", "ASUS TUF 27\" 144 Гц", "Redragon + коврик"],
      summary: "Всё для игр в одной покупке: ПК на i5-9400F и Sapphire Nitro+ RX 580, монитор ASUS TUF Gaming 27″ 144 Гц, беспроводной комплект Redragon и коврик в подарок.",
      description: [
        "Топовый бюджетный игровой комплект — всё рабочее место сразу: системный блок, монитор и периферия. Достаточно подключить и играть.",
        "Компьютер на Intel Core i5-9400F и Sapphire Nitro+ Radeon RX 580 8 ГБ, монитор ASUS TUF Gaming 27″ с IPS-матрицей и частотой 144 Гц, беспроводные клавиатура и мышь Redragon с тремя режимами подключения. Большой коврик Redragon Flick 3XL — в подарок.",
      ],
      specs: [
        { part: "Процессор", value: "Intel Core i5-9400F" },
        { part: "Видеокарта", value: "Sapphire Nitro+ Radeon RX 580 8 ГБ" },
        { part: "Материнская плата", value: "MSI B365M PRO" },
        { part: "Оперативная память", value: "Crucial DDR4 16 ГБ (2×8), 2400 МГц" },
        { part: "Накопитель", value: "SSD Apacer Panther 256 ГБ" },
        { part: "Охлаждение", value: "Tower S50, 120 мм RGB, 4 тепловые трубки" },
        { part: "Блок питания", value: "Zalman ZM600-LXII, 600 Вт, 80+" },
        { part: "Корпус", value: "HOFTECH, 4×120 мм ARGB" },
      ],
      extras: [
        { title: "Монитор ASUS TUF Gaming VG1R", items: ['Диагональ 27"', "Full HD 1920×1080", "IPS", "144 Гц", "Отклик 1 мс (MPRT)"] },
        { title: "Redragon Gaming Essentials", items: ["Клавиатура и мышь", "3 режима: провод / 2.4 ГГц / Bluetooth", "Аккумулятор 4000 мАч", "RGB-подсветка"] },
        { title: "Подарок: коврик Redragon Flick 3XL", items: ["1219×610×3 мм"] },
      ],
      notes: ["Гарантия 30 дней"],
      photos: shots("3", "2026-10-06_04-20-08", [1, 3, 4, 5, 2, 9, 10, 8, 6, 7]),
    },
    {
      slug: "i5-9400f-rx-580-rog-strix",
      name: "i5-9400F + RX 580 ROG",
      title: "Игровой ПК на i5-9400F и RX 580 с ASUS ROG Strix",
      status: "sold",
      price: { usd: 337, uzs: 4_044_000 },
      highlights: ["Core i5-9400F", "RX 580 2304SP", "ASUS ROG Strix"],
      summary: "Топовая бюджетная сборка: i5-9400F, Sapphire Nitro+ RX 580 2304SP, плата ASUS ROG Strix и корпус GameDias с пятью ARGB-вентиляторами.",
      description: [
        "Топовая бюджетная игровая сборка на Intel Core i5-9400F и Sapphire Nitro+ Radeon RX 580 8 ГБ в полной версии 2304SP. Карту проверили 30-минутным стресс-тестом FurMark — температура держалась на 75 °C.",
        "Плата ASUS ROG Strix B360-G Gaming, память Patriot Viper Steel 3000 МГц, NVMe-накопитель Lexar. Корпус GameDias с пятью ARGB-вентиляторами — контроллер подсветки в комплекте.",
      ],
      specs: [
        { part: "Процессор", value: "Intel Core i5-9400F" },
        { part: "Видеокарта", value: "Sapphire Nitro+ Radeon RX 580 8 ГБ (2304SP)" },
        { part: "Материнская плата", value: "ASUS ROG Strix B360-G Gaming" },
        { part: "Оперативная память", value: "Patriot Viper Steel DDR4 16 ГБ (2×8), 3000 МГц CL16" },
        { part: "Накопитель", value: "M.2 NVMe Lexar NM620 256 ГБ" },
        { part: "Охлаждение", value: "Tower S50, 120 мм RGB, 4 тепловые трубки" },
        { part: "Блок питания", value: "Ocypus Beta P700, 700 Вт" },
        { part: "Корпус", value: "GameDias, 5×120 мм ARGB, контроллер в комплекте" },
      ],
      notes: ["Состояние отличное", "Гарантия 30 дней", "FurMark 30 мин — 75 °C", ...ready],
      photos: shots("5", "2026-10-06_04-21-06", [6, 5, 7, 8, 2, 3, 4, 1]),
    },
  ],
};

/** "600 $ · 7 140 000 сум" */
export const formatBuildPrice = (p: { usd: number; uzs: number }) => `${p.usd} $ · ${new Intl.NumberFormat("ru-RU").format(p.uzs)} сум`;

export const getBuild = (slug: string) => works.projects.find((b) => b.slug === slug);

export const budgets = {
  tag: "Сколько стоит игровой ПК в 2026",
  heading: "Сборки по бюджету: 7\u00a0/ 10\u00a0/ 15\u00a0/ 25\u00a0млн\u00a0сум",
  lead: "Типовые конфигурации, от которых мы отталкиваемся. Каждую подстраиваем под ваши игры, монитор и цены на день заказа.",
  cta: { label: "Все игровые ПК", href: "/igrovye-pk" },
};

// ЗАМЕНИТЬ: пример кейса — подставьте реальную сборку, цифры и отзыв клиента.
export const caseStudy = {
  intro: "Клиенту нужен был компьютер для игр в 2K и монтажа видео — тихий, с запасом на апгрейд.",
  heading: "Подобрали конфигурацию, собрали и протестировали за несколько дней.",
  stats: [
    { value: 100, label: "Стресс-тест сборки" },
    { value: 85, label: "Запас по питанию" },
    { value: 40, label: "Ниже шум" },
  ],
  client: ["ИГРОВОЙ", "ПК"],
  quote: "Текст отзыва клиента о сборке: что понравилось, как работает компьютер и как прошло общение.",
  author: "— Имя клиента, Ташкент",
  logos: ["Бренд 1", "Бренд 2", "Бренд 3", "Бренд 4", "Бренд 5"],
};

// ЗАМЕНИТЬ: реальные отзывы клиентов.
export const testimonials = [
  {
    title: "Короткий заголовок отзыва клиента",
    text: "Текст отзыва: какой компьютер собрали, как прошёл подбор, сроки и впечатления после нескольких недель работы.",
    name: "Имя Ф.",
    role: "Игровой ПК",
  },
  {
    title: "Короткий заголовок отзыва клиента",
    text: "Текст отзыва: с какой проблемой обратились, что нашли на диагностике и как быстро вернули компьютер.",
    name: "Имя Ф.",
    role: "Ремонт",
  },
  {
    title: "Короткий заголовок отзыва клиента",
    text: "Текст отзыва: какие комплектующие подобрали для апгрейда и насколько вырос результат после замены.",
    name: "Имя Ф.",
    role: "Апгрейд",
  },
];

// ЗАМЕНИТЬ: цены — примеры. Переключатель показывает цену в сумах или долларах.
export const pricing = {
  tag: "Цены",
  heading: "Прозрачные цены на услуги",
  lead: "Стоимость работ без учёта комплектующих.",
  currencyNote: "сум или $",
  plans: [
    {
      name: "Диагностика и ремонт",
      text: "Найдём причину поломки и починим компьютер или ноутбук.",
      price: { uzs: 150000, usd: 12 },
      unit: ["ОТ /", "УСЛУГИ"],
      cta: { label: "Записаться", href: "#contact", variant: "dots" as const },
      features: [
        "Полная диагностика",
        "Чистка от пыли",
        "Замена термопасты",
        "Замена неисправных деталей",
        "Установка Windows и драйверов",
        "Проверка под нагрузкой",
        "Гарантия 30 дней на работы",
      ],
    },
    {
      name: "Сборка на заказ",
      text: "Подберём комплектующие и соберём компьютер под ключ.",
      price: { uzs: 500000, usd: 40 },
      unit: ["ОТ /", "СБОРКИ"],
      cta: { label: "Заказать сборку", href: "#contact", variant: "gradient" as const },
      features: [
        "Подбор под задачи и бюджет",
        "Проверка совместимости",
        "Аккуратный кабель-менеджмент",
        "Настройка BIOS и XMP",
        "Установка системы и драйверов",
        "Стресс-тест сборки",
        "Гарантия 30 дней на сборку",
      ],
    },
  ],
  banner: {
    heading: "Не знаете, что выбрать? Подскажем",
    text: "Опишите задачу и бюджет — предложим пару вариантов конфигурации и объясним разницу между ними.",
    cta: { label: "Консультация", href: "#contact" },
  },
};

export const whyUs = {
  tag: "Почему мы",
  heading: "Собираем так, как собрали бы себе",
  text: "Подбираем детали без переплат, честно объясняем, что стоит менять, а что нет, и проверяем каждую сборку перед выдачей.",
  bigWord: ["ПОЧЕМУ", "МЫ?"],
  meters: [
    { label: "Качество", value: 0.95 },
    { label: "Скорость", value: 0.8 },
    { label: "Гарантия", value: 1 },
    { label: "Цена", value: 0.85 },
  ],
};

// ЗАМЕНИТЬ: имена и должности сотрудников.
export const team = {
  tag: "Команда",
  heading: ["Сборщики, мастера", "и консультанты"],
  members: [
    { name: "Имя Фамилия", role: "Мастер по сборке", quote: "«Хорошая сборка — это когда о компьютере не вспоминаешь».", x: 0.13 },
    { name: "Имя Фамилия", role: "Инженер по ремонту", quote: "«Сначала находим причину, потом меняем детали».", x: 0.38 },
    { name: "Имя Фамилия", role: "Консультант", quote: "«Подбираем то, что нужно вам, а не то, что дороже».", x: 0.62 },
    { name: "Имя Фамилия", role: "Менеджер", quote: "«На связи с момента заявки до выдачи».", x: 0.86 },
  ],
  cta: { label: "Связаться", href: "#contact" },
};

// ЗАМЕНИТЬ: проверьте сроки и условия в ответах.
export const faq = {
  heading: "Частые вопросы",
  text: "Собрали ответы на вопросы, которые нам задают чаще всего. Если не нашли свой — напишите нам.",
  more: "Остались вопросы?",
  cta: { label: "Спросить", href: "#contact" },
  items: [
    { q: "Сколько времени занимает сборка?", a: "Обычно несколько дней с момента, когда все комплектующие на месте. Точный срок назовём при оформлении заказа." },
    { q: "Можно собрать ПК из моих комплектующих?", a: "Да. Проверим совместимость, соберём и протестируем компьютер из ваших деталей." },
    { q: "Даёте ли вы гарантию?", a: "Да, 30 дней на сборку и на выполненные работы." },
    { q: "Сколько стоит диагностика?", a: "Стоимость зависит от устройства и проблемы. Если вы закажете ремонт у нас, условия обсудим заранее." },
    { q: "Ремонтируете ли вы ноутбуки?", a: "Да, проводим диагностику, чистку и ремонт ноутбуков." },
    { q: "Где вы находитесь?", a: "Мы в Ташкенте и работаем по всему Узбекистану. Позвоните или напишите в Telegram или Instagram — ответим и договоримся о деталях." },
  ],
};

// Статьи на главной — slug из blog.ts.
export const articles = {
  marquee: "СТАТЬИ",
  heading: "Статьи о сборке ПК и выборе комплектующих",
  slugs: ["igrovoy-pk-za-10-mln-sum", "gde-kupit-videokartu-v-tashkente", "kak-proverit-bu-videokartu"],
  all: { label: "Все статьи", href: "/blog" },
};

export const contact = {
  tag: "Связаться",
  heading: "Расскажите, какой компьютер вам нужен",
  lead: "Оставьте заявку — перезвоним, уточним детали и предложим варианты.",
  fields: {
    name: { label: "Имя", placeholder: "Ваше имя" },
    phone: { label: "Телефон", placeholder: "+998 __ ___ __ __" },
    service: {
      label: "Услуга",
      placeholder: "Выберите…",
      options: ["Сборка ПК на заказ", "Комплектующие", "Апгрейд", "Ремонт", "Диагностика"],
    },
    budget: { label: "Бюджет", placeholder: "Например, 10 000 000 сум" },
    message: { label: "Что нужно сделать?", placeholder: "Опишите задачу…" },
  },
  submit: "Отправить",
  sent: "Заявка отправлена. Мы свяжемся с вами.",
  achievement: { title: "Достижение получено", text: "Заявка отправлена · +100 XP" },
};

// Контакты с промо-баннера: только телефон, Telegram и Instagram.
export const footer = {
  text: "Сборка ПК на заказ, продажа комплектующих, ремонт и диагностика компьютеров по всему Узбекистану.",
  phone: "+998 90 349 28 84",
  links: [
    { label: "Игровые ПК", href: "/igrovye-pk" },
    { label: "Сборка ПК", href: "/sborka-kompyutera" },
    { label: "Комплектующие", href: "/komplektuyushchie" },
    { label: "Видеокарты", href: "/videokarty" },
    { label: "Апгрейд", href: "/apgreyd" },
    { label: "Цены", href: "/#pricing" },
    { label: "Блог", href: "/blog" },
    { label: "Портфолио", href: "/portfolio" },
  ],
  socials: [
    { label: "Telegram", href: "https://t.me/PcWizard_uz" },
    { label: "Instagram", href: "https://instagram.com/PcWizard_uz" },
  ],
  rights: "PcWizard_uz. Все права защищены.",
  legal: ["Условия", "Политика конфиденциальности"],
};
