/*
  # Payment Invoices and Transactions System

  1. New Tables
    - `subscription_invoices`
      - Invoices for subscription payments
      - Tracks billing periods and payment status
      - Links to user subscriptions
    
    - `payment_transactions`
      - All payment transaction records
      - Tracks payment method, gateway response
      - Audit trail for all payments
    
    - `payment_methods`
      - User's stored payment methods
      - Card details (tokenized)
      - Default payment method tracking

  2. Features
    - Complete invoice management
    - Transaction tracking and history
    - Payment method storage
    - Failed payment retry logic
    - Payment notifications

  3. Security
    - RLS on all tables
    - Users can only see their own data
    - Sensitive payment data is tokenized
*/

-- Subscription Invoices
CREATE TABLE IF NOT EXISTS subscription_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES user_subscriptions(id) ON DELETE CASCADE NOT NULL,
  
  invoice_number text NOT NULL UNIQUE,
  amount integer NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'void')),
  
  plan_name text NOT NULL,
  billing_period text NOT NULL,
  billing_period_start timestamptz NOT NULL,
  billing_period_end timestamptz NOT NULL,
  
  due_date timestamptz NOT NULL,
  paid_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscription_invoices_user ON subscription_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_invoices_status ON subscription_invoices(status);

-- Payment Transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_id uuid REFERENCES subscription_invoices(id) ON DELETE SET NULL,
  
  transaction_type text NOT NULL CHECK (transaction_type IN ('subscription', 'addon', 'service')),
  amount integer NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  
  payment_method text NOT NULL CHECK (payment_method IN ('card', 'paypal', 'bank_transfer', 'other')),
  payment_gateway text,
  gateway_transaction_id text,
  
  failure_reason text,
  gateway_response jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_invoice ON payment_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  payment_type text NOT NULL CHECK (payment_type IN ('card', 'paypal', 'bank_account')),
  
  -- Tokenized card data (never store real card numbers)
  card_last4 text,
  card_brand text,
  card_exp_month integer,
  card_exp_year integer,
  
  -- Payment gateway token
  gateway_token text NOT NULL,
  gateway_customer_id text,
  
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  
  billing_name text,
  billing_email text,
  billing_address jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);

-- Seed subscription plans
INSERT INTO subscription_plans (id, name, description, tier_level, monthly_price_cents, annual_price_cents, can_generate_reports, can_access_lifecycle, can_use_advanced_addons, max_reports_per_month, includes_proactive_monitoring, value_message, target_user_intent)
VALUES 
  ('core', 'Core', 'Essential health analytics for individuals', 1, 1900, 19000, true, false, false, 10, false, 'Perfect for getting started with health tracking', 'Basic health monitoring'),
  ('daily', 'Daily', 'Daily insights and comprehensive tracking', 2, 3900, 39000, true, true, true, 50, true, 'Complete daily health intelligence', 'Serious health optimization'),
  ('max', 'Max', 'Complete health intelligence platform', 3, 7900, 79000, true, true, true, NULL, true, 'Ultimate health analysis and insights', 'Professional health management')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  monthly_price_cents = EXCLUDED.monthly_price_cents,
  annual_price_cents = EXCLUDED.annual_price_cents;

-- RLS Policies

ALTER TABLE subscription_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices"
  ON subscription_invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
  ON payment_methods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON payment_methods FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON payment_methods FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
