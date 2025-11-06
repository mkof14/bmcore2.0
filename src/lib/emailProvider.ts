// Email Provider Adapter Pattern
// Supports Resend, SendGrid, and Amazon SES

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  template?: string;
  variables?: Record<string, any>;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailProvider {
  send(payload: EmailPayload): Promise<EmailResponse>;
  name: string;
}

// Resend Provider
class ResendProvider implements EmailProvider {
  name = 'resend';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(payload: EmailPayload): Promise<EmailResponse> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: payload.from || 'BioMath Core <no-reply@biomathcore.com>',
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
          reply_to: payload.replyTo || 'support@biomathcore.com',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to send email',
        };
      }

      return {
        success: true,
        messageId: data.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// SendGrid Provider
class SendGridProvider implements EmailProvider {
  name = 'sendgrid';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(payload: EmailPayload): Promise<EmailResponse> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: payload.to }],
            },
          ],
          from: {
            email: 'no-reply@biomathcore.com',
            name: 'BioMath Core',
          },
          reply_to: {
            email: payload.replyTo || 'support@biomathcore.com',
          },
          subject: payload.subject,
          content: [
            {
              type: 'text/html',
              value: payload.html,
            },
            ...(payload.text
              ? [
                  {
                    type: 'text/plain',
                    value: payload.text,
                  },
                ]
              : []),
          ],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          error: data.errors?.[0]?.message || 'Failed to send email',
        };
      }

      return {
        success: true,
        messageId: response.headers.get('x-message-id') || undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Amazon SES Provider
class SESProvider implements EmailProvider {
  name = 'ses';
  private region: string;
  private accessKeyId: string;
  private secretAccessKey: string;

  constructor(config: { region: string; accessKeyId: string; secretAccessKey: string }) {
    this.region = config.region;
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;
  }

  async send(payload: EmailPayload): Promise<EmailResponse> {
    // Note: Full AWS SES implementation would require AWS SDK or signing
    // This is a placeholder showing the structure
    return {
      success: false,
      error: 'SES provider requires AWS SDK configuration',
    };
  }
}

// Mock Provider for Development/Testing
class MockProvider implements EmailProvider {
  name = 'mock';

  async send(payload: EmailPayload): Promise<EmailResponse> {
    console.log('[MockEmailProvider] Would send email:', {
      to: payload.to,
      subject: payload.subject,
      htmlLength: payload.html.length,
    });

    // Simulate successful send
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    };
  }
}

// Email Service Factory
export function createEmailProvider(): EmailProvider {
  const provider = import.meta.env.VITE_EMAIL_PROVIDER || 'mock';

  switch (provider.toLowerCase()) {
    case 'resend':
      const resendKey = import.meta.env.VITE_RESEND_API_KEY;
      if (!resendKey) {
        console.warn('Resend API key not configured, using mock provider');
        return new MockProvider();
      }
      return new ResendProvider(resendKey);

    case 'sendgrid':
      const sendgridKey = import.meta.env.VITE_SENDGRID_API_KEY;
      if (!sendgridKey) {
        console.warn('SendGrid API key not configured, using mock provider');
        return new MockProvider();
      }
      return new SendGridProvider(sendgridKey);

    case 'ses':
      const sesRegion = import.meta.env.VITE_SES_REGION;
      const sesAccessKey = import.meta.env.VITE_SES_ACCESS_KEY_ID;
      const sesSecretKey = import.meta.env.VITE_SES_SECRET_ACCESS_KEY;

      if (!sesRegion || !sesAccessKey || !sesSecretKey) {
        console.warn('SES credentials not configured, using mock provider');
        return new MockProvider();
      }

      return new SESProvider({
        region: sesRegion,
        accessKeyId: sesAccessKey,
        secretAccessKey: sesSecretKey,
      });

    case 'mock':
    default:
      return new MockProvider();
  }
}

// Email rendering utility
export function renderTemplate(html: string, variables: Record<string, any>): string {
  let rendered = html;

  // Simple variable replacement: {{variableName}}
  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(regex, String(value));
  });

  return rendered;
}

// Convert HTML to plain text (basic implementation)
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

// Send email using template
export async function sendEmail(params: {
  to: string;
  templateId: string;
  variables: Record<string, any>;
}): Promise<EmailResponse> {
  const provider = createEmailProvider();

  try {
    const { supabase } = await import('./supabase');

    const { data: template, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('slug', params.templateId)
      .eq('status', 'active')
      .single();

    if (error || !template) {
      console.error('Template not found:', params.templateId);
      return {
        success: false,
        error: 'Email template not found'
      };
    }

    const subject = renderTemplate(template.subject_en, params.variables);
    const html = renderTemplate(template.body_en, params.variables);

    const result = await provider.send({
      to: params.to,
      subject,
      html,
      text: htmlToPlainText(html)
    });

    await supabase.from('email_logs').insert({
      template_id: template.id,
      recipient_email: params.to,
      subject,
      body: html,
      status: result.success ? 'sent' : 'failed',
      sent_at: result.success ? new Date().toISOString() : null,
      error_message: result.error
    });

    return result;
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
