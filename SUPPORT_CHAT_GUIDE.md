# Live Support Chat - Support Staff Guide

## Overview

BioMath Core Live Support Chat is a real-time customer support system that connects users directly with your support team. This guide explains how to use the support chat interface to respond to customer inquiries effectively.

---

## Accessing the Support Chat Panel

### Prerequisites
- You must have **Admin** or **Support** role access
- Your account must have `is_admin = true` in the `profiles` table

### Steps to Access
1. Log in to your BioMath Core admin account
2. Navigate to **Admin Panel** from the main menu
3. Click on **"Support Chat"** in the left sidebar (second item from top)
4. You will see the Support Chat Panel interface

---

## Understanding the Interface

### Left Panel: Chat Room List
- **Active Conversations**: Shows all users with open support chat rooms
- **User Information**: Displays customer name or email
- **Last Message**: Preview of the most recent message
- **Timestamp**: Shows how long ago the conversation was updated
- **Unread Badge**: Blue badge showing number of new messages from customer
- **Auto-refresh**: Updates every 30 seconds automatically

### Right Panel: Chat Conversation
- **Customer Messages**: White/gray bubbles on the left
- **Your Messages**: Blue bubbles on the right (marked as "Support Team")
- **Typing Indicators**: Shows when customer is typing
- **Real-time Updates**: New messages appear instantly
- **Message Timestamps**: All messages show time sent

---

## How to Respond to Customers

### Selecting a Chat
1. Click on any user name in the left panel
2. The full conversation will load in the right panel
3. You can see the entire chat history

### Sending Messages
1. Type your response in the text box at the bottom
2. **Press Enter** to send (or click the Send button)
3. **Shift+Enter** for a new line without sending
4. Your message will appear in blue and marked as "Support Team"

### Best Practices
- **Respond promptly**: Customers expect quick replies in live chat
- **Be professional and friendly**: Use clear, helpful language
- **Provide actionable guidance**: Give specific steps when possible
- **Use complete sentences**: Avoid shorthand or abbreviations
- **Show empathy**: Acknowledge customer concerns
- **Ask clarifying questions**: Make sure you understand the issue

---

## Chat Features

### Real-time Typing Indicators
- You'll see "Customer is typing..." when they're composing a message
- Customers will see "Support Team is typing..." when you're typing
- Typing indicator disappears 3 seconds after you stop typing

### Message History
- All conversations are saved in the database
- You can view full conversation history when you select a chat
- Previous conversations persist even after you navigate away

### Auto-scroll
- Chat window automatically scrolls to newest message
- Makes it easy to follow active conversations

### Multi-chat Management
- You can switch between different customer chats
- Each chat maintains its own context
- No limit on number of active chats

---

## Common Support Scenarios

### New User Inquiry
1. Greet the user professionally
2. Ask how you can help
3. Provide clear guidance or direct them to resources
4. Confirm they understand your response

Example:
```
Hi! Thanks for reaching out to BioMath Core Support. I'm here to help. What can I assist you with today?
```

### Technical Issue
1. Acknowledge the problem
2. Ask for specific details if needed
3. Provide troubleshooting steps
4. Follow up to ensure resolution

Example:
```
I understand you're experiencing an issue with [feature]. Let me help you resolve this. Could you tell me what happens when you try to [action]?
```

### Account Question
1. Verify user identity if needed for security
2. Look up account information if necessary
3. Provide accurate information
4. Offer additional assistance

Example:
```
I can help you with your account question. Let me check that information for you. One moment please.
```

### Billing/Subscription
1. Be cautious with sensitive information
2. Use Admin Panel to verify subscription status if needed
3. Provide clear pricing and billing information
4. Escalate to billing team if necessary

Example:
```
I can help with your subscription question. For security, I'll need to look this up in our system. Your current plan is [details].
```

---

## Support Hours & Response Times

### Expected Response Times
- **Immediate**: Respond to active chats as soon as possible
- **Within 5 minutes**: Ideal response time during business hours
- **Within 1 hour**: Maximum response time during business hours
- **Next business day**: For chats received outside business hours

### Managing Multiple Chats
1. Prioritize by urgency and wait time
2. Acknowledge new messages even if you can't solve immediately
3. Set expectations if you need to research an answer
4. Don't leave customers waiting without acknowledgment

---

## Security & Privacy Guidelines

### DO NOT Share:
- Other users' personal information
- Internal system details or passwords
- Database access or admin credentials
- Pricing information not publicly available
- Unreleased features or roadmap details

### Always Verify Identity For:
- Account changes or updates
- Billing information requests
- Sensitive health data access
- Password resets or security questions

### HIPAA Compliance
- Do not request or store Protected Health Information (PHI) in chat
- Direct medical questions to healthcare providers
- BioMath Core provides wellness insights, not medical advice
- Keep all conversations professional and compliant

---

## Escalation Procedures

### When to Escalate
- Complex technical issues requiring engineering
- Billing disputes or refund requests
- Legal or compliance questions
- Feature requests or product feedback
- Abusive or inappropriate behavior

### How to Escalate
1. Thank the customer for their patience
2. Explain that you need to involve a specialist
3. Collect all relevant details in the chat
4. Create a support ticket (if ticket system exists)
5. Follow up with customer on timeline

Example:
```
Thank you for providing those details. This requires our engineering team's attention. I'm creating a ticket for you now (Ticket #12345). Our team will follow up within 24 hours via email.
```

---

## Troubleshooting Support Chat Issues

### Chat Not Loading
1. Refresh your browser
2. Check your internet connection
3. Try logging out and back in
4. Clear browser cache if needed

### Messages Not Sending
1. Check that you have network connection
2. Verify you're still logged in
3. Try refreshing the page
4. Contact IT if problem persists

### Can't See New Messages
1. Check if auto-refresh is working (should update every 30 seconds)
2. Try clicking on another chat room and back
3. Refresh the browser page
4. Verify database connection is active

---

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift+Enter**: New line in message
- **Click room name**: Switch to that conversation
- **Tab**: Navigate between interface elements

---

## Reporting & Analytics

### What Gets Tracked
- Number of conversations
- Response times
- Message volume
- Active chat rooms
- Support team activity

### Using Data
- Monitor your response time
- Track volume of support requests
- Identify common issues
- Improve support processes

---

## Best Support Responses Examples

### Greeting
```
Hi [Name]! Welcome to BioMath Core Support. I'm [Your Name] and I'm here to help. What brings you in today?
```

### Understanding Issue
```
Thank you for explaining that. Just to make sure I understand correctly: you're trying to [action] but [issue] is happening. Is that right?
```

### Providing Solution
```
Great question! Here's how to [solve issue]:
1. [Step one]
2. [Step two]
3. [Step three]

Try that and let me know if it works for you!
```

### Following Up
```
Did that solution work for you? I want to make sure everything is working properly before we close this chat.
```

### Closing
```
I'm glad I could help! Is there anything else I can assist you with today? Feel free to reach out anytime you need support. Have a great day!
```

---

## Tips for Efficient Support

1. **Use templates**: Create saved responses for common questions
2. **Be concise**: Keep messages focused and clear
3. **Use formatting**: Break complex answers into numbered steps
4. **Link to resources**: Direct users to relevant documentation
5. **Confirm understanding**: Ask customers to confirm they understand
6. **Take notes**: Document important details from conversations
7. **Stay organized**: Handle one issue at a time
8. **Be patient**: Some customers need extra time and explanation
9. **End positively**: Always close on a helpful, friendly note
10. **Continuous improvement**: Learn from each interaction

---

## Technical Notes for IT/Developers

### Database Tables Used
- `chat_rooms`: Stores conversation rooms
- `chat_messages`: All messages (text only currently)
- `chat_participants`: Links users to rooms
- `chat_typing_indicators`: Real-time typing status
- `profiles`: User information and admin status

### Real-time Technology
- Supabase Realtime subscriptions
- Postgres LISTEN/NOTIFY
- WebSocket connections
- Auto-cleanup of stale typing indicators (10 seconds)

### Security
- Row Level Security (RLS) enabled on all tables
- Only room participants can read messages
- Admin users can access all support rooms
- Typing indicators auto-expire

### Message Types
- Currently: Text only
- Future support: Images, files, system messages

---

## Getting Help

### Support Staff Resources
- **Technical Issues**: Contact IT Team at it@biomathcore.com
- **Process Questions**: Contact Support Manager
- **System Access**: Contact Admin Team
- **Training**: Request additional support training

### Emergency Contacts
- **System Down**: Escalate to IT immediately
- **Security Incident**: Contact Security Team
- **Data Breach**: Follow incident response protocol
- **Legal Issue**: Contact Legal Department

---

## Version History

- **v1.0** (November 2025): Initial release
  - Real-time chat functionality
  - Admin panel integration
  - Typing indicators
  - Message history
  - Multi-chat support

---

## Quick Reference Card

**Access**: Admin Panel → Support Chat

**Send Message**: Type + Enter

**Switch Chat**: Click user name in left panel

**New Line**: Shift + Enter

**Typing Shows**: Automatically to customer

**Messages**: Real-time, no refresh needed

**Response Goal**: Within 5 minutes

**Remember**: Be professional, helpful, and friendly!

---

*For questions about this guide or the support chat system, please contact the Support Team Lead or IT Department.*
