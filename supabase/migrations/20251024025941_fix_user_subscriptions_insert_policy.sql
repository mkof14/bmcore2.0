/*
  # Fix User Subscriptions INSERT Policy

  1. Changes
    - Add INSERT policy for user_subscriptions table
    - Allow authenticated users to create their own subscription
    - Ensure user can only create subscription for themselves

  2. Security
    - Users can only insert subscriptions for their own user_id
    - Validates auth.uid() matches user_id in INSERT
*/

-- Add INSERT policy for user subscriptions
CREATE POLICY "Users can insert own subscription"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
