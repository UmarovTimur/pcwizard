// The request from the site form: its shape and the message text built from it.
// Safe for the client: the same text goes to the Telegram bot and into the prefilled chat link.

export interface Lead {
  name: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  /** Page the form was sent from. */
  page: string;
}

const LIMITS: Record<keyof Lead, number> = { name: 80, phone: 40, service: 60, budget: 60, message: 1000, page: 200 };

/** Trims every field and cuts it to a sane length. */
export function cleanLead(lead: Lead): Lead {
  const out = { ...lead };
  for (const key of Object.keys(LIMITS) as (keyof Lead)[]) out[key] = String(lead[key] ?? "").trim().slice(0, LIMITS[key]);
  return out;
}

/** "Заявка с сайта" as plain text, empty fields skipped. */
export function leadText(lead: Lead) {
  const rows: [string, string][] = [
    ["Имя", lead.name],
    ["Телефон", lead.phone],
    ["Услуга", lead.service],
    ["Бюджет", lead.budget],
    ["Задача", lead.message],
    ["Страница", lead.page],
  ];
  return ["Заявка с сайта PcWizard_uz", ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join("\n");
}
