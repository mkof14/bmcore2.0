import { supabase } from "./supabase";
import { logAuditEvent } from "./dataGovernance";

// Re-usable interface for email templates
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// --- Rate Limiting (unchanged) ---
const EMAIL_RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const emailRateLimits = new Map<string, number[]>();

export function checkEmailRateLimit(userId: string): boolean {
  const now = Date.now();
  const userEmails = emailRateLimits.get(userId) || [];
  const recentEmails = userEmails.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentEmails.length >= EMAIL_RATE_LIMIT) {
    return false;
  }

  recentEmails.push(now);
  emailRateLimits.set(userId, recentEmails);
  return true;
}

// --- CORE EMAIL LOGIC ---

/**
 * NEW: Fetches and renders an email template from the database.
 *
 * @param slug - The slug of the email template (e.g., "welcome").
 * @param languageCode - The desired language code (e.g., "ru"). Falls back to "en".
 * @param variables - A key-value object for replacing placeholders in the template.
 * @returns A rendered EmailTemplate object or null if not found.
 */
export async function getEmailTemplateFromDB(
  slug: string,
  languageCode: string,
  variables: Record<string, any>
): Promise<EmailTemplate | null> {
  const { data: template, error: templateError } = await supabase
    .from("email_templates")
    .select("id")
    .eq("slug", slug)
    .single();

  if (templateError || !template) {
    console.error(`[Email] Template with slug '${slug}' not found.`, templateError);
    // As a critical fallback, we could have hardcoded basic templates here, but for now, we'll fail.
    return null;
  }

  // Attempt to get the specified language translation
  let { data: translation } = await supabase
    .from("email_template_translations")
    .select("subject, body")
    .eq("template_id", template.id)
    .eq("language_code", languageCode)
    .single();

  // If translation is not found, fall back to English
  if (!translation) {
    console.warn(`[Email] Translation '${languageCode}' not found for '${slug}'. Falling back to 'en'.`);
    const { data: fallbackTranslation } = await supabase
      .from("email_template_translations")
      .select("subject, body")
      .eq("template_id", template.id)
      .eq("language_code", "en")
      .single();
    
    if (!fallbackTranslation) {
      console.error(`[Email] CRITICAL: Fallback 'en' translation not found for '${slug}'.`);
      return null;
    }
    translation = fallbackTranslation;
  }

  let { subject, body: html } = translation;

  // Replace all variables like {{variableName}}
  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g");
    subject = subject.replace(regex, String(variables[key]));
    html = html.replace(regex, String(variables[key]));
  }
  
  // Basic conversion from HTML to text for the text part of the email
  const text = html.replace(/<[^>]*>?/gm, " ");

  return { subject, html, text };
}


/**
 * The generic email sending function. It handles rate limiting and logging.
 * It does NOT contain provider-specific logic.
 * (This function is mostly unchanged but now accepts the template as a parameter).
 */
export async function sendEmail(
  userId: string,
  to: string,
  template: EmailTemplate,
  context?: string
): Promise<boolean> {
  if (!checkEmailRateLimit(userId)) {
    console.warn(`[Email] Rate limit exceeded for user ${userId}`);
    return false;
  }

  try {
    // Here you would integrate with your actual email provider (e.g., Resend, Postmark)
    // For now, we are just logging it to the database.
    console.log(`[Email] Simulating sending email to ${to} with subject: ${template.subject}`);

    const { error } = await supabase.from("email_logs").insert({
      user_id: userId,
      recipient: to,
      subject: template.subject,
      status: "sent", // Assuming success for now
      context: context || "notification",
    });

    if (error) {
      console.error("[Email] Failed to log email:", error);
    }

    await logAuditEvent({
      action: "email_sent",
      entity: "email",
      entityId: to,
      metadata: { subject: template.subject, context },
    });

    return true;
  } catch (error) {
    console.error("[Email] Generic sendEmail error:", error);
    return false;
  }
}

// --- REFACTORED NOTIFICATION FUNCTIONS ---

// Each function now follows a pattern:
// 1. Get the template from the DB.
// 2. If the template is valid, call sendEmail.

export async function sendWelcomeEmail(userId: string, to: string, lang: string, data: { userName: string; }) {
  const template = await getEmailTemplateFromDB("welcome", lang, data);
  if (template) {
    return sendEmail(userId, to, template, "welcome");
  }
  return false;
}

export async function sendPaymentSucceededEmail(userId: string, to: string, lang: string, data: { userName: string; amount: number; planName: string; }) {
    const formattedData = {
      ...data,
      amount: (data.amount / 100).toFixed(2), // Format amount
    };
    const template = await getEmailTemplateFromDB("payment-succeeded", lang, formattedData);
    if (template) {
        return sendEmail(userId, to, template, "payment-succeeded");
    }
    return false;
}

export async function sendPaymentFailedEmail(userId: string, to: string, lang: string, data: { userName: string; attemptCount: number; }) {
  const template = await getEmailTemplateFromDB("payment-failed", lang, data);
  if (template) {
    return sendEmail(userId, to, template, "payment-failed");
  }
  return false;
}

export async function sendTrialWillEndEmail(userId: string, to: string, lang: string, data: { userName: string; daysRemaining: number; }) {
  const template = await getEmailTemplateFromDB("trial-will-end", lang, data);
  if (template) {
    return sendEmail(userId, to, template, "trial-will-end");
  }
  return false;
}

export async function sendSubscriptionCanceledEmail(userId: string, to: string, lang: string, data: { userName: string; endDate: string; }) {
  const template = await getEmailTemplateFromDB("subscription-canceled", lang, data);
  if (template) {
    return sendEmail(userId, to, template, "subscription-canceled");
  }
  return false;
}

export async function sendMagicLinkEmail(userId: string, to: string, lang: string, data: { userName: string; magicLink: string; }) {
  const template = await getEmailTemplateFromDB("magic-link", lang, data);
  if (template) {
    return sendEmail(userId, to, template, "magic-link");
  }
  return false;
}


// --- System Alerts (unchanged) ---
export async function sendSystemAlert(
  message: string,
  severity: "info" | "warning" | "error"
): Promise<void> {
  console[severity](`[ALERT] ${message}`);

  await logAuditEvent({
    action: "system_alert",
    entity: "system",
    metadata: { message, severity },
  });
}