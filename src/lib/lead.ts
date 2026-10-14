"use server";

import { cleanLead, leadText, type Lead } from "./lead-text";

/**
 * Sends a request from the site form to the shop's Telegram chat through a bot
 * (TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env). Returns false when the bot is not set up
 * or Telegram does not accept the message, so the form can offer the visitor another way.
 */
export async function sendLead(input: Lead): Promise<boolean> {
  const lead = cleanLead(input);
  if (!lead.name || !lead.phone) return false;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: leadText(lead), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
