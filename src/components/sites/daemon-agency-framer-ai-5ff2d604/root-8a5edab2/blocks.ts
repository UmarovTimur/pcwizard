/**
 * Текстовые блоки для посадочных страниц и статей. В тексте можно ставить
 * внутренние ссылки в виде [текст](/адрес).
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "note"; text: string }
  /** Место для карточек сборок по бюджету (рендерит страница, не Prose). */
  | { type: "builds" };

export interface FaqItem {
  q: string;
  a: string;
}

export interface LinkItem {
  label: string;
  href: string;
}
