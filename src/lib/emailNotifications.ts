import { supabase } from "./supabase";
import { logAuditEvent } from "./dataGovernance";

const EMAIL_RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 3600000;

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

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function getWelcomeEmail(userName: string): EmailTemplate {
  return {
    subject: "Welcome to BioMath Core",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to BioMath Core!</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for joining BioMath Core. We're excited to help you on your health journey.</p>
        <p>Get started by:</p>
        <ul>
          <li>Connecting your health devices</li>
          <li>Exploring our AI health assistant</li>
          <li>Generating your first health report</li>
        </ul>
        <a href="https://biomathcore.com/member" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Go to Dashboard</a>
        <p style="color: #666; font-size: 14px;">If you have any questions, reply to this email or visit our support center.</p>
      </div>
    `,
    text: `Welcome to BioMath Core!\n\nHi ${userName},\n\nThank you for joining BioMath Core. Get started at https://biomathcore.com/member`,
  };
}

export function getPaymentSucceededEmail(userName: string, amount: number, planName: string): EmailTemplate {
  return {
    subject: "Payment Successful - BioMath Core",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Payment Successful</h1>
        <p>Hi ${userName},</p>
        <p>Your payment of $${(amount / 100).toFixed(2)} for the ${planName} plan has been processed successfully.</p>
        <p>Your subscription is now active and you have full access to all features.</p>
        <a href="https://biomathcore.com/member/billing" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">View Billing Details</a>
        <p style="color: #666; font-size: 14px;">Thank you for being a valued member!</p>
      </div>
    `,
    text: `Payment Successful\n\nHi ${userName},\n\nYour payment of $${(amount / 100).toFixed(2)} for ${planName} has been processed.`,
  };
}

export function getPaymentFailedEmail(userName: string, attemptCount: number): EmailTemplate {
  return {
    subject: "Payment Failed - Action Required",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Payment Failed</h1>
        <p>Hi ${userName},</p>
        <p>We were unable to process your payment (attempt ${attemptCount}).</p>
        <p>To continue your subscription without interruption, please update your payment method:</p>
        <a href="https://biomathcore.com/member/billing" style="display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Update Payment Method</a>
        <p style="color: #666; font-size: 14px;">If you continue to experience issues, please contact our support team.</p>
      </div>
    `,
    text: `Payment Failed\n\nHi ${userName},\n\nPlease update your payment method at https://biomathcore.com/member/billing`,
  };
}

export function getTrialWillEndEmail(userName: string, daysRemaining: number): EmailTemplate {
  return {
    subject: `Your Trial Ends in ${daysRemaining} Days`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Your Trial is Ending Soon</h1>
        <p>Hi ${userName},</p>
        <p>Your BioMath Core trial will end in ${daysRemaining} days.</p>
        <p>Continue enjoying unlimited access by subscribing to one of our plans:</p>
        <ul>
          <li><strong>Core Plan</strong> - Essential health tracking</li>
          <li><strong>Daily Plan</strong> - Daily health insights</li>
          <li><strong>Max Plan</strong> - Complete health optimization</li>
        </ul>
        <a href="https://biomathcore.com/pricing" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Choose Your Plan</a>
      </div>
    `,
    text: `Your trial ends in ${daysRemaining} days.\n\nChoose your plan at https://biomathcore.com/pricing`,
  };
}

export function getSubscriptionCanceledEmail(userName: string, endDate: string): EmailTemplate {
  return {
    subject: "Subscription Canceled - We're Sorry to See You Go",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Subscription Canceled</h1>
        <p>Hi ${userName},</p>
        <p>Your subscription has been canceled and will remain active until ${endDate}.</p>
        <p>You can reactivate your subscription anytime before this date to continue without interruption.</p>
        <a href="https://biomathcore.com/member/billing" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reactivate Subscription</a>
        <p style="color: #666; font-size: 14px;">We'd love to hear your feedback on how we can improve.</p>
      </div>
    `,
    text: `Subscription Canceled\n\nYour subscription remains active until ${endDate}.\n\nReactivate at https://biomathcore.com/member/billing`,
  };
}

export function getMagicLinkEmail(userName: string, magicLink: string): EmailTemplate {
  return {
    subject: "Your Sign-In Link",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Sign In to BioMath Core</h1>
        <p>Hi ${userName},</p>
        <p>Click the button below to sign in to your account:</p>
        <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Sign In</a>
        <p style="color: #666; font-size: 14px;">This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Sign in to BioMath Core:\n\n${magicLink}\n\nThis link expires in 15 minutes.`,
  };
}

export async function sendEmail(
  userId: string,
  to: string,
  template: EmailTemplate,
  context?: string
): Promise<boolean> {
  if (!checkEmailRateLimit(userId)) {
    console.warn(`Email rate limit exceeded for user ${userId}`);
    return false;
  }

  try {
    const { error } = await supabase.from("email_logs").insert({
      user_id: userId,
      recipient: to,
      subject: template.subject,
      status: "pending",
      context: context || "notification",
    });

    if (error) {
      console.error("Failed to log email:", error);
    }

    await logAuditEvent({
      action: "email_sent",
      entity: "email",
      entityId: userId,
      metadata: { subject: template.subject, context },
    });

    return true;
  } catch (error) {
    console.error("Send email error:", error);
    return false;
  }
}

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
