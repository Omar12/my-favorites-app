import "server-only";
import { SITE_NAME } from "@/lib/site";

// Resend's shared test sender. It only delivers to the Resend account owner's
// own address; set EMAIL_FROM to an address on a verified domain to lift that.
const DEFAULT_FROM = `${SITE_NAME} <onboarding@resend.dev>`;

export async function sendSignInEmail(to: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const isProduction = process.env.NODE_ENV === "production";

  // In development the link is also printed, so sign-in works offline.
  if (!isProduction) console.log(`\nSign-in link for ${to}:\n${url}\n`);
  if (!apiKey) {
    if (isProduction) throw new Error("RESEND_API_KEY is not set; cannot send sign-in email.");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? DEFAULT_FROM,
        to,
        subject: `Sign in to ${SITE_NAME}`,
        text: `Open this link to sign in to ${SITE_NAME}:\n\n${url}\n\nIt works once and expires in 10 minutes. If you didn't ask for it, ignore this email.`,
        html: `<p>Open this link to sign in to ${SITE_NAME}:</p><p><a href="${url}">Sign in</a></p><p>It works once and expires in 10 minutes. If you didn't ask for it, ignore this email.</p>`,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  } catch (err) {
    if (isProduction) throw err;
    console.warn("Could not send sign-in email (use the link printed above):", err);
  }
}
