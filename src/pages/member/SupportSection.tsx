import { useState, useEffect } from 'react';
import { HeadphonesIcon, Send, Mail, MessageCircle, Plus, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
}

export default function SupportSection() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    category: 'technical',
    priority: 'normal',
    message: '',
  });

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (currentTicket) {
      loadMessages(currentTicket.id);
    }
  }, [currentTicket]);

  const loadTickets = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const loadMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createTicket = async () => {
    if (!newTicketForm.subject || !newTicketForm.message) {
      alert('Subject and message are required');
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.user.id,
          subject: newTicketForm.subject,
          category: newTicketForm.category,
          priority: newTicketForm.priority,
          status: 'open',
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      if (ticket) {
        const { error: msgError } = await supabase
          .from('support_messages')
          .insert({
            ticket_id: ticket.id,
            sender_type: 'user',
            message: newTicketForm.message,
          });

        if (msgError) throw msgError;
      }

      setShowNewTicket(false);
      setNewTicketForm({ subject: '', category: 'technical', priority: 'normal', message: '' });
      loadTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentTicket) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: currentTicket.id,
          sender_type: 'user',
          message: newMessage,
        });

      if (error) throw error;

      await supabase
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentTicket.id);

      setNewMessage('');
      loadMessages(currentTicket.id);
      loadTickets();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-900/30 border-green-600/30 text-green-400';
      case 'in_progress': return 'bg-blue-900/30 border-blue-600/30 text-blue-400';
      case 'resolved': return 'bg-gray-700/30 border-gray-600/30 text-gray-400';
      default: return 'bg-gray-700/30 border-gray-600/30 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-900/30 border-red-600/30 text-red-400';
      case 'high': return 'bg-orange-900/30 border-orange-600/30 text-orange-400';
      case 'normal': return 'bg-blue-900/30 border-blue-600/30 text-blue-400';
      case 'low': return 'bg-gray-700/30 border-gray-600/30 text-gray-400';
      default: return 'bg-gray-700/30 border-gray-600/30 text-gray-400';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <HeadphonesIcon className="h-8 w-8 text-orange-500" />
          Support
        </h1>
        <p className="text-gray-400">Get help from our support team via chat or email</p>
      </div>

      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-4">
          <MessageCircle className="h-6 w-6 text-blue-400 mb-2" />
          <h3 className="font-semibold text-white mb-1">Live Chat</h3>
          <p className="text-xs text-gray-400 mb-3">Chat with support agent in real-time</p>
          <button className="text-xs text-blue-400 hover:text-blue-300">Start Chat →</button>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-4">
          <Mail className="h-6 w-6 text-green-400 mb-2" />
          <h3 className="font-semibold text-white mb-1">Email Support</h3>
          <p className="text-xs text-gray-400 mb-3">support@biomathcore.com</p>
          <p className="text-xs text-gray-500">Response within 24 hours</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-4">
          <Clock className="h-6 w-6 text-orange-400 mb-2" />
          <h3 className="font-semibold text-white mb-1">Support Hours</h3>
          <p className="text-xs text-gray-400 mb-1">24/7 for Pro users</p>
          <p className="text-xs text-gray-400">9AM-6PM EST for Basic</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Support Tickets</h3>
        <button
          onClick={() => setShowNewTicket(true)}
          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setCurrentTicket(ticket)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                currentTicket?.id === ticket.id
                  ? 'bg-orange-900/30 border border-orange-600/30'
                  : 'bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-white line-clamp-2">{ticket.subject}</h4>
              </div>
              <div className="flex gap-2 mb-2">
                <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              <p className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl flex flex-col h-[600px]">
          {currentTicket ? (
            <>
              <div className="p-4 border-b border-gray-700/50">
                <h3 className="font-semibold text-white mb-2">{currentTicket.subject}</h3>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(currentTicket.status)}`}>
                    {currentTicket.status}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(currentTicket.priority)}`}>
                    {currentTicket.priority}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full border bg-gray-700/30 border-gray-600/30 text-gray-400">
                    {currentTicket.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-xl ${
                        msg.sender_type === 'user'
                          ? 'bg-orange-900/30 border border-orange-600/30'
                          : 'bg-gray-800/50 border border-gray-700/30'
                      }`}
                    >
                      <p className="text-sm text-white whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-700/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a ticket to view conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Create Support Ticket</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <select
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="account">Account</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Describe your issue in detail..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={createTicket}
                className="flex-1 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all"
              >
                Create Ticket
              </button>
              <button
                onClick={() => setShowNewTicket(false)}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
