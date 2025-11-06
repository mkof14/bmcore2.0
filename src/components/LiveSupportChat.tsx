import { useState, useEffect, useRef } from 'react';
import { Send, X, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  sender_name?: string;
  is_support?: boolean;
}

interface LiveSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveSupportChat({ isOpen, onClose }: LiveSupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const user = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && user) {
      initializeChat();
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: existingRooms } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('type', 'support')
        .eq('created_by', user.id)
        .maybeSingle();

      let currentRoomId: string;

      if (existingRooms) {
        currentRoomId = existingRooms.id;
      } else {
        const { data: newRoom, error: roomError } = await supabase
          .from('chat_rooms')
          .insert({
            name: 'Support Chat',
            type: 'support',
            created_by: user.id,
          })
          .select()
          .single();

        if (roomError) throw roomError;
        currentRoomId = newRoom.id;

        await supabase.from('chat_participants').insert({
          room_id: currentRoomId,
          user_id: user.id,
          role: 'member',
        });
      }

      setRoomId(currentRoomId);
      await loadMessages(currentRoomId);
      setupRealtimeSubscriptions(currentRoomId);
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        id,
        content,
        user_id,
        created_at,
        profiles:user_id (
          first_name,
          last_name,
          is_admin
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (!error && data) {
      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        user_id: msg.user_id,
        created_at: msg.created_at,
        sender_name: msg.profiles
          ? `${msg.profiles.first_name || ''} ${msg.profiles.last_name || ''}`.trim() || 'User'
          : 'User',
        is_support: msg.profiles?.is_admin || false,
      }));
      setMessages(formattedMessages);
    }
  };

  const setupRealtimeSubscriptions = (roomId: string) => {
    const messageChannel = supabase
      .channel(`room:${roomId}:messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, is_admin')
            .eq('id', payload.new.user_id)
            .maybeSingle();

          const newMsg: Message = {
            id: payload.new.id,
            content: payload.new.content,
            user_id: payload.new.user_id,
            created_at: payload.new.created_at,
            sender_name: profile
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User'
              : 'User',
            is_support: profile?.is_admin || false,
          };

          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    const typingChannel = supabase
      .channel(`room:${roomId}:typing`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_typing_indicators',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            if (payload.new.user_id !== user?.id) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', payload.new.user_id)
                .maybeSingle();

              const name = profile
                ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Someone'
                : 'Someone';

              setTypingUsers((prev) => {
                if (!prev.includes(name)) {
                  return [...prev, name];
                }
                return prev;
              });

              setTimeout(() => {
                setTypingUsers((prev) => prev.filter((n) => n !== name));
              }, 5000);
            }
          } else if (payload.eventType === 'DELETE') {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', payload.old.user_id)
              .maybeSingle();

            const name = profile
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Someone'
              : 'Someone';

            setTypingUsers((prev) => prev.filter((n) => n !== name));
          }
        }
      )
      .subscribe();

    return () => {
      messageChannel.unsubscribe();
      typingChannel.unsubscribe();
    };
  };

  const handleTyping = async () => {
    if (!roomId || !user) return;

    if (!isTyping) {
      setIsTyping(true);
      await supabase.from('chat_typing_indicators').upsert({
        room_id: roomId,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      setIsTyping(false);
      await supabase
        .from('chat_typing_indicators')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', user.id);
    }, 3000);
  };

  const sendMessage = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!newMessage.trim() || !roomId || !user) return;

    const messageText = newMessage;
    setNewMessage('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    await supabase
      .from('chat_typing_indicators')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', user.id);

    const { error } = await supabase.from('chat_messages').insert({
      room_id: roomId,
      user_id: user.id,
      content: messageText,
      type: 'text',
    });

    if (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-20 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-40">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-xl">
        <div>
          <h3 className="font-semibold text-lg">Live Support Chat</h3>
          <p className="text-xs text-green-100">We typically respond within minutes</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Welcome to Support Chat!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Send a message and our team will respond shortly.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user_id === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.user_id === user?.id
                      ? 'bg-green-600 text-white'
                      : message.is_support
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-gray-900 dark:text-white border border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {message.user_id !== user?.id && (
                    <p
                      className={`text-xs font-semibold mb-1 ${
                        message.is_support
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {message.is_support ? '🎧 Support Team' : message.sender_name}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.user_id === user?.id
                        ? 'text-green-100'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}
                  >
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2">
                  <TypingIndicator />
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {typingUsers[0]} is typing...
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form
        onSubmit={sendMessage}
        className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl"
      >
        <div className="flex items-end space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Type your message..."
            rows={2}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
