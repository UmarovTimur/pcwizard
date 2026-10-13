@AGENTS.md

# PcWizard_uz — сайт

Сайт PcWizard_uz: сборка ПК на заказ, продажа комплектующих, апгрейд, ремонт и диагностика. Работаем по всему Узбекистану, офис в Ташкенте.

Проект вырос из шаблона website-cloner, поэтому часть `AGENTS.md` устарела. Действует только блок про Next.js. Остальное не применяется:
- не «клонирование 1:1»: дизайн свой;
- не Vercel: деплой на VPS через Docker.

## Правила
- **Коммит или push — только по просьбе пользователя.** Ветка `feat/pcwizard-site`.
- **«Инициализируй»** означает каркас, библиотеки и конфиги, без страниц, дизайна и анимаций.
- **Весь текст сайта на русском.** Пиши «по всему Узбекистану».
- **Гарантия — 30 дней.**
- **Контакты только телефон, Telegram и Instagram.** Email нигде на сайте нет и не добавлять. Данные лежат в `src/lib/site.ts` и `content.ts`.
- **Отмена.** Если пользователь отвергает визуальную идею («не очень, убери»), удаляй её полностью, включая файлы компонента. Не оставляй мёртвый код.
- **Уточняй, к чему относится правка.** Пример: «градиент в блоке» — это фон блока, а не текст заголовка.

## Стек
- Next.js 16.3 (App Router, React 19, Turbopack), TypeScript strict, Tailwind v4, Node ≥ 24.
- `package.json` содержит `"type": "module"`: без него не работает Payload CLI. Не убирать.
- Payload CMS 3.90 с Postgres: админка каталога на `/admin`. Пакет `graphql` держать на `^16`: с 17 npm уходит в бесконечный ERESOLVE.

## Команды
- `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`; `npm run check` запускает все три проверки.
- **Перезапуск dev-сервера**, когда Turbopack залип или отдаёт старый CSS:
  `fuser -k 3000/tcp; rm -rf .next; (setsid npm run dev > <scratchpad>/dev.log 2>&1 &)`
  Не использовать `pkill -f "next dev"`.
- **Payload:**
  - `npx payload generate:types` обновляет `src/payload-types.ts`;
  - `npx payload generate:importmap`;
  - `npx payload migrate:create <name>` после изменения коллекций;
  - `npx payload run <file>` запускает скрипт с доступом к базе.

## Структура
- **`src/app/(site)/`** — сайт, со своим корневым layout и `globals.css`:
  - главная, `[slug]` (посадочные из `landings.ts`), `blog`, `portfolio`;
  - `catalog` и `catalog/[slug]`.
- **`src/app/(payload)/`** — админка и API Payload, скопированы из шаблона Payload. Файлы не трогать, кроме `custom.css`.
- **В корне `src/app/`** остались только `favicon.ico`, `robots.ts`, `sitemap.ts`. Sitemap динамический и включает товары каталога.
- **`src/components/sites/daemon-agency-framer-ai-5ff2d604/`** — все компоненты сайта. Странное имя папки осталось от шаблона.
  - **`root-8a5edab2/`** — секции и данные.
    - `content.ts`: весь текст главной. Места с пометкой «ЗАМЕНИТЬ» — примеры.
    - Остальные данные:
      - `builds.ts` — сборки по бюджету;
      - `blog.ts` — статьи;
      - `landings.ts` — посадочные страницы;
      - `blocks.ts` — типы текстовых блоков.
    - Внутренние страницы собираются из `InnerPage.tsx` (`InnerShell`, `Column`) и `PageHero.tsx`. Prop `art` у `PageHero` — декорация за контентом.
  - **`shared/`** — примитивы и анимации:
    - `primitives.tsx`: `Cross`, `Noise`, `Tag`, `KeyButton`, `Placeholder`;
    - `motion.tsx`: `Reveal`;
    - Pixel*-компоненты (см. ниже).
- **`src/payload/`** — коллекции Products, Categories, Media, Users, а также:
  - `slug.ts`: транслитерация;
  - `seed.ts`: при первом запуске создаёт 10 категорий;
  - `admin/`: логотип для админки.
- **`src/payload.config.ts`, `src/migrations/`** — конфиг и миграции. В production миграции применяются сами (`prodMigrations`).
- **Данные каталога:**
  - `src/lib/catalog.ts` — только сервер;
  - `src/lib/catalog-shared.ts` — типы и форматтеры, безопасные для клиента.
  - Клиентские компоненты импортируют только `catalog-shared`.

## Каталог и админка
- Каталог — это запчасти. Сборки из портфолио туда не переносить.
- **У товара есть своя страница и он кликабелен в таблице,** если у него есть фото, описание или характеристики. Такие строки отмечены фиолетовой полосой и плашкой «Фото →».
- **Цена** хранится в сумах. Пустая цена показывается как «Цена по запросу».
- **Наличие:** in_stock / on_order / out. **Состояние:** new / used.
- **Вход в админку** по username, без email. Почтового адаптера нет, поэтому восстановления пароля по почте нет.
- **Страницы каталога** используют `await connection()`, чтобы рендериться на каждый запрос.

## Окружение
- **`.env`** в git не попадает:
  - `DATABASE_URL`: локально `postgresql://tim@/pcwizard?host=/var/run/postgresql`;
  - `PAYLOAD_SECRET`.
- **Шаблон** переменных лежит в `.env.example`. Там же:
  - `MEDIA_DIR` — по умолчанию `./media`;
  - `NEXT_PUBLIC_SITE_URL`.
- **VPS:** `output: "standalone"` и `docker-compose.yml`. Папка `./media` подключена как volume: в ней фото товаров. Postgres уже есть на VPS.

## Дизайн
- **Тема:** тёмная фиолетовая неоновая.
- **Токены** заданы в `src/app/(site)/globals.css`:
  - цвета: `ink` #0b0614, `violet` #a855f7, `fuchsia`, `lavender`, `line`, `muted`;
  - сетка: рамки 1100 и 730 px с вертикальными линиями и крестиками `Cross` на пересечениях.
- **Шрифты:**
  - `font-display` — Science Gothic, заголовки. У заголовков только text-shadow-свечение, **без градиентов**: их пользователь просил убрать;
  - `font-pixel` — Press Start 2P, плашки и кнопки;
  - `font-mono` — IBM Plex Mono;
  - основной текст — тоже Science Gothic (`wdth` 80 задан на `html`).
- **Секции главной** начинаются с отступа `pt-[200px]`. Декоративные полосы ставятся в этот отступ.
- **Пиксельные анимации** — canvas-компоненты в `shared/`:
  - `PixelField`: кристаллы внизу hero и футера. Пропсы `back` (тёмный задний ряд) и `glow`;
  - `PixelStreaks`: горизонтальные светящиеся штрихи вверху hero;
  - `PixelStars`;
  - `StickerSwarm`: стикеры под курсором в FAQ;
  - `CircuitTraces`: дорожки платы с импульсами над «Сборками»;
  - `PixelCity`: дрейфующий пиксельный город над «Командой» и «Контактами»;
  - `MainboardArt`: плата в шапке каталога.
- **Правила для анимаций:**
  - уважать `prefers-reduced-motion`;
  - эффекты под курсором включать только при `(hover: hover) and (pointer: fine)`;
  - останавливать цикл, когда секция не видна;
  - не использовать CSS `filter: drop-shadow` на анимированном canvas: fps падает до ~9. Свечение рисовать внутри canvas, на маленьком offscreen-канвасе с увеличением.
  - **Пиксельная графика** выводится с `image-rendering: pixelated` и целым масштабом.
  - **Сдвиг пиксельных слоёв:** `steps()` по одному арт-пикселю.
- **Картинки:**
  - стикеры: `public/images/stickers/*.png` (370×370);
  - фото hero: `public/images/sdl-sanjaya-…jpg`;
  - фон «Почему мы»: `whyus-pixel-sky.png`.
  - **`public/images/decor/`** — CC0-ассеты с OpenGameArt (ansimuz, knekko, ArtBIT), перекрашенные в фиолетовый. Авторы указаны в комментариях компонентов.
  - **Новые сторонние ассеты** — только CC0 или с явной лицензией на коммерческое использование.

## Проверка изменений
- **После правок:** `npx tsc --noEmit` и `npx eslint src`. Перед сдачей крупной задачи — `npm run build`.
- **Визуальная проверка** — скриншоты через playwright-core:
  - Chromium: `~/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`;
  - модуль: `/home/tim/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs`.
  - Скрипты и скриншоты держать в scratchpad и запускать из его папки. Иначе файлы окажутся в корне проекта.
  - Проверять десктоп (1440) и телефон (390).
