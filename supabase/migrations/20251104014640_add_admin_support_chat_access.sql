/*
  # Add Admin Access to Support Chats
  
  Allow admins to access all support chat rooms and messages
*/

-- Admin can read all support chat rooms
CREATE POLICY "Admins can read all support rooms"
  ON chat_rooms
  FOR SELECT
  TO authenticated
  USING (
    type = 'support'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admin can read all participants in support rooms
CREATE POLICY "Admins can read all support participants"
  ON chat_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_participants.room_id
      AND chat_rooms.type = 'support'
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    )
  );

-- Admin can read all messages in support rooms
CREATE POLICY "Admins can read all support messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND chat_rooms.type = 'support'
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    )
  );

-- Admin can send messages in support rooms
CREATE POLICY "Admins can send support messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND chat_rooms.type = 'support'
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    )
  );

-- Admin can read typing indicators in support rooms
CREATE POLICY "Admins can read support typing indicators"
  ON chat_typing_indicators
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_typing_indicators.room_id
      AND chat_rooms.type = 'support'
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    )
  );