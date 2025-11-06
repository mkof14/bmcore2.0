/*
  # Payment Email Templates V2

  1. New Email Templates
    - Subscription welcome email
    - Payment success confirmation
    - Payment failed notification
    - Subscription canceled (end of period)
    - Subscription canceled (immediate)
    - Trial ending reminder
    - Invoice generated notification

  2. Template Variables
    - User name personalization
    - Amount and payment details
    - Date formatting
    - Plan information
*/

-- Insert payment-related email templates
INSERT INTO email_templates (slug, name, category, subject_en, body_en, variables, status)
VALUES
  (
    'subscription_welcome',
    'Subscription Welcome',
    'subscription_update',
    'Welcome to {{plan_name}} - Your Trial Starts Now!',
    '<h1>Welcome to BioMath Core {{plan_name}}!</h1>
<p>Hi {{first_name}},</p>
<p>Thank you for starting your {{plan_name}} subscription! Your <strong>5-day free trial</strong> begins today.</p>
<h2>What happens next?</h2>
<ul>
  <li>Explore all features of the {{plan_name}} plan</li>
  <li>Your trial ends on <strong>{{trial_end_date}}</strong></li>
  <li>After the trial, you will be charged <strong>{{billing_amount}}</strong> {{billing_period}}</li>
  <li>Cancel anytime during the trial without being charged</li>
</ul>
<p><a href="https://biomathcore.com/member-zone" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;margin:20px 0;">Go to Member Zone</a></p>
<p>Questions? Reply to this email or visit our support center.</p>',
    '["first_name", "plan_name", "trial_end_date", "billing_amount", "billing_period"]'::jsonb,
    'active'
  ),
  (
    'payment_success_confirmation',
    'Payment Success',
    'payment_success',
    'Payment Received - Thank You!',
    '<h1>Payment Confirmed</h1>
<p>Hi {{first_name}},</p>
<p>We have successfully processed your payment. Thank you for your continued subscription!</p>
<h2>Payment Details</h2>
<table style="width:100%;max-width:400px;">
  <tr><td>Amount:</td><td><strong>{{amount}}</strong></td></tr>
  <tr><td>Date:</td><td>{{payment_date}}</td></tr>
  <tr><td>Transaction ID:</td><td>{{transaction_id}}</td></tr>
</table>
<p>You can view your invoice and payment history in your billing section.</p>',
    '["first_name", "amount", "payment_date", "transaction_id"]'::jsonb,
    'active'
  ),
  (
    'payment_failed_notification',
    'Payment Failed',
    'payment_failed',
    'Payment Failed - Action Required',
    '<h1>Payment Failed</h1>
<p>Hi {{first_name}},</p>
<p>We were unable to process your recent payment. Your subscription may be interrupted if we cannot collect payment.</p>
<h2>What to do next:</h2>
<ol>
  <li>Check that your payment method is valid and has sufficient funds</li>
  <li>Update your payment method in your billing settings</li>
  <li>We will automatically retry the payment in 3 days</li>
</ol>
<p><strong>Reason:</strong> {{failure_reason}}</p>
<p><a href="https://biomathcore.com/member-zone/billing" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;margin:20px 0;">Update Payment Method</a></p>',
    '["first_name", "failure_reason"]'::jsonb,
    'active'
  ),
  (
    'subscription_canceled_end',
    'Subscription Canceled (End of Period)',
    'subscription_update',
    'Subscription Cancellation Confirmed',
    '<h1>Subscription Canceled</h1>
<p>Hi {{first_name}},</p>
<p>We have received your cancellation request. Your subscription will remain active until the end of your current billing period.</p>
<h2>Important Information:</h2>
<ul>
  <li>Your subscription ends on <strong>{{end_date}}</strong></li>
  <li>You will continue to have full access until then</li>
  <li>No further charges will be made</li>
  <li>You can reactivate anytime before {{end_date}}</li>
</ul>
<p>We are sorry to see you go! If you have feedback about your experience, we would love to hear it.</p>',
    '["first_name", "end_date"]'::jsonb,
    'active'
  ),
  (
    'subscription_canceled_now',
    'Subscription Canceled (Immediate)',
    'subscription_update',
    'Subscription Canceled',
    '<h1>Subscription Canceled</h1>
<p>Hi {{first_name}},</p>
<p>Your subscription has been canceled immediately as requested.</p>
<p>Thank you for using BioMath Core. We hope to see you again in the future!</p>
<p>If this was a mistake, you can resubscribe at any time.</p>',
    '["first_name"]'::jsonb,
    'active'
  ),
  (
    'trial_ending_soon',
    'Trial Ending Reminder',
    'subscription_update',
    'Your Trial Ends in {{days_left}} Days',
    '<h1>Your Trial is Ending Soon</h1>
<p>Hi {{first_name}},</p>
<p>This is a friendly reminder that your <strong>{{days_left}}-day trial</strong> of the {{plan_name}} plan ends on <strong>{{trial_end_date}}</strong>.</p>
<h2>What happens next?</h2>
<p>After your trial ends, you will be charged <strong>{{billing_amount}}</strong> {{billing_period}}.</p>
<p>If you wish to cancel, you can do so anytime before {{trial_end_date}} without being charged.</p>
<p><a href="https://biomathcore.com/member-zone/billing" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;margin:20px 0;">Manage Subscription</a></p>',
    '["first_name", "days_left", "plan_name", "trial_end_date", "billing_amount", "billing_period"]'::jsonb,
    'active'
  ),
  (
    'invoice_ready',
    'Invoice Generated',
    'billing_invoice',
    'Your Invoice is Ready - {{invoice_number}}',
    '<h1>New Invoice Available</h1>
<p>Hi {{first_name}},</p>
<p>Your invoice for {{billing_period}} has been generated.</p>
<h2>Invoice Details</h2>
<table style="width:100%;max-width:400px;">
  <tr><td>Invoice Number:</td><td><strong>{{invoice_number}}</strong></td></tr>
  <tr><td>Amount:</td><td><strong>{{amount}}</strong></td></tr>
  <tr><td>Due Date:</td><td>{{due_date}}</td></tr>
  <tr><td>Plan:</td><td>{{plan_name}}</td></tr>
</table>
<p>Payment will be automatically processed on the due date using your saved payment method.</p>
<p><a href="https://biomathcore.com/member-zone/billing" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;margin:20px 0;">View Invoice</a></p>',
    '["first_name", "invoice_number", "amount", "due_date", "plan_name", "billing_period"]'::jsonb,
    'active'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subject_en = EXCLUDED.subject_en,
  body_en = EXCLUDED.body_en,
  variables = EXCLUDED.variables,
  status = EXCLUDED.status,
  updated_at = now();
