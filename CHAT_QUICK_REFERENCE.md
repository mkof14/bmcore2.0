# Live Support Chat - Quick Reference

## For Support Staff

### Access Support Chat
1. Admin Panel → Support Chat (second item in sidebar)
2. Select customer from left panel
3. Type response in text box
4. Press Enter to send

### Key Features
- **Real-time messaging**: No refresh needed
- **Typing indicators**: Shows when customer is typing
- **Chat history**: All messages saved automatically
- **Multi-chat**: Handle multiple conversations
- **Auto-updates**: New messages appear instantly

### Response Tips
✅ Reply within 5 minutes
✅ Be professional and friendly
✅ Use Enter to send, Shift+Enter for new line
✅ Verify identity for sensitive requests
✅ Escalate complex issues appropriately

### Common Issues
- **Chat not loading**: Refresh browser
- **Messages not sending**: Check connection
- **Can't see new chats**: Wait 30s for auto-refresh or refresh page

---

## For Customers

### How to Start Chat
1. Visit Contact page
2. Click "Start Chat" button (green)
3. Type your message
4. Press Enter to send

### Chat Features
- Real-time responses from support team
- See when support team is typing
- Full message history saved
- Fast response times (usually < 5 minutes)

### Tips
- Be specific about your issue
- One question at a time
- Wait for support team response
- Confirm issue is resolved before closing

---

## Technical Details

### Database Tables
- `chat_rooms`: Conversation containers (type: 'support')
- `chat_messages`: All messages with timestamps
- `chat_participants`: Links users to rooms
- `chat_typing_indicators`: Real-time typing status
- `profiles`: User info (is_admin determines support access)

### Security
- RLS enabled on all chat tables
- Only participants can read messages
- Admin users can access all support rooms
- Encrypted connections via Supabase

### Performance
- Real-time via Supabase subscriptions
- Auto-cleanup of typing indicators (10s)
- Auto-refresh chat list (30s)
- Optimized message loading (last 100 messages)

---

## Architecture

```
User (Contact Page)
    ↓
LiveSupportChat Component
    ↓
Supabase Real-time
    ↓
Support Staff (Admin Panel)
    ↓
SupportChatPanel Component
```

### Message Flow
1. User types message → chat_typing_indicators table
2. User presses Enter → chat_messages table
3. Real-time subscription → Support sees message instantly
4. Support responds → User sees response instantly
5. Typing indicators auto-cleanup after 10 seconds

### Chat Room Creation
- Auto-created when user opens chat for first time
- One support room per user
- Room persists across sessions
- Type: 'support' distinguishes from other chat types

---

## File Locations

**Frontend Components:**
- `/src/components/LiveSupportChat.tsx` - Customer chat interface
- `/src/pages/admin/SupportChatPanel.tsx` - Support staff interface
- `/src/pages/Contact.tsx` - Contains chat button
- `/src/pages/AdminPanel.tsx` - Admin panel integration

**Database Migrations:**
- `/supabase/migrations/20251023021005_create_realtime_chat_system.sql`

**Documentation:**
- `/SUPPORT_CHAT_GUIDE.md` - Full support staff guide
- `/CHAT_QUICK_REFERENCE.md` - This file

---

## Support Roles

### Customer (Member)
- Start chat from Contact page
- Send messages
- See typing indicators
- View message history

### Support Staff (Admin)
- Access all support chats
- Respond to customers
- See all active conversations
- Manage multiple chats simultaneously
- Messages marked as "🎧 Support Team"

### System Admin (Developer)
- Full database access
- Can troubleshoot issues
- Monitor performance
- Update chat features

---

## Troubleshooting Commands

```bash
# Check active chat rooms
SELECT * FROM chat_rooms WHERE type = 'support' ORDER BY updated_at DESC;

# Check recent messages
SELECT * FROM chat_messages WHERE created_at > NOW() - INTERVAL '1 hour';

# Check typing indicators
SELECT * FROM chat_typing_indicators;

# Check support staff (admins)
SELECT id, email, is_admin FROM profiles WHERE is_admin = true;

# Clean up old typing indicators
DELETE FROM chat_typing_indicators WHERE updated_at < NOW() - INTERVAL '10 seconds';
```

---

## Environment Variables

No additional environment variables needed! Chat uses existing Supabase connection:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Future Enhancements

Planned features:
- [ ] File/image sharing
- [ ] Emoji support
- [ ] Message reactions
- [ ] Read receipts
- [ ] Canned responses/templates
- [ ] Chat transfer between support staff
- [ ] Chat ratings
- [ ] Offline message queue
- [ ] Mobile app support

---

## Contact

**For Support Staff Issues:**
- IT Team: it@biomathcore.com
- Support Manager: support-manager@biomathcore.com

**For Technical/Developer Issues:**
- Engineering Team: engineering@biomathcore.com
- Database: Supabase Console
- Monitoring: Admin Panel → Analytics

---

*Last Updated: November 2025*
