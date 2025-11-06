import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Volume2, RefreshCw, User, Stethoscope, Heart, Users, Sparkles, Copy, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AssistantPersona, ChatMessage, ChatSession } from '../types/database';

interface AIHealthAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIHealthAssistant({ isOpen, onClose }: AIHealthAssistantProps) {
  const [personas, setPersonas] = useState<AssistantPersona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<AssistantPersona | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSecondOpinion, setShowSecondOpinion] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadPersonas();
      loadOrCreateSession();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadPersonas = async () => {
    const { data } = await supabase
      .from('assistant_personas')
      .select('*')
      .eq('active', true)
      .order('sort_order');

    if (data) {
      setPersonas(data);
      if (!selectedPersona && data.length > 0) {
        setSelectedPersona(data[0]);
      }
    }
  };

  const loadOrCreateSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: sessions } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })
      .limit(1);

    if (sessions && sessions.length > 0) {
      setCurrentSession(sessions[0]);
      loadMessages(sessions[0].id);
    } else {
      const { data: newSession } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'Health Consultation',
          status: 'active'
        })
        .select()
        .single();

      if (newSession) {
        setCurrentSession(newSession);
        addWelcomeMessage(newSession.id, user.id);
      }
    }
  };

  const loadMessages = async (sessionId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const addWelcomeMessage = async (sessionId: string, userId: string) => {
    const welcomeMessage: Partial<ChatMessage> = {
      session_id: sessionId,
      user_id: userId,
      role: 'assistant',
      content: 'Hello! I\'m your AI Health Advisor. I can help you understand your health data, answer wellness questions, and provide evidence-based guidance. How can I assist you today?',
      persona_id: selectedPersona?.id,
      created_at: new Date().toISOString()
    };

    const { data } = await supabase
      .from('chat_messages')
      .insert(welcomeMessage)
      .select()
      .single();

    if (data) {
      setMessages([data]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentSession || !selectedPersona) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const userMessage: Partial<ChatMessage> = {
      session_id: currentSession.id,
      user_id: user.id,
      role: 'user',
      content: inputMessage.trim(),
      created_at: new Date().toISOString()
    };

    const { data: savedUserMessage } = await supabase
      .from('chat_messages')
      .insert(userMessage)
      .select()
      .single();

    if (savedUserMessage) {
      setMessages(prev => [...prev, savedUserMessage]);
      setInputMessage('');
      setIsLoading(true);

      setTimeout(async () => {
        const assistantResponse = generateMockResponse(inputMessage, selectedPersona);

        const assistantMessage: Partial<ChatMessage> = {
          session_id: currentSession.id,
          user_id: user.id,
          role: 'assistant',
          content: assistantResponse,
          persona_id: selectedPersona.id,
          created_at: new Date().toISOString()
        };

        const { data: savedAssistantMessage } = await supabase
          .from('chat_messages')
          .insert(assistantMessage)
          .select()
          .single();

        if (savedAssistantMessage) {
          setMessages(prev => [...prev, savedAssistantMessage]);
        }

        setIsLoading(false);
      }, 1500);
    }
  };

  const handleRequestSecondOpinion = async (messageId: string) => {
    if (!currentSession || !selectedPersona) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const originalMessage = messages.find(m => m.id === messageId);
    if (!originalMessage) return;

    setIsLoading(true);

    const alternativePersona = personas.find(p => p.id !== selectedPersona.id);
    if (!alternativePersona) return;

    setTimeout(async () => {
      const secondOpinionResponse = generateMockResponse(
        originalMessage.content,
        alternativePersona,
        true
      );

      const secondOpinionMessage: Partial<ChatMessage> = {
        session_id: currentSession.id,
        user_id: user.id,
        role: 'assistant',
        content: secondOpinionResponse,
        persona_id: alternativePersona.id,
        is_second_opinion: true,
        parent_message_id: messageId,
        created_at: new Date().toISOString()
      };

      const { data: savedMessage } = await supabase
        .from('chat_messages')
        .insert(secondOpinionMessage)
        .select()
        .single();

      if (savedMessage) {
        setMessages(prev => [...prev, savedMessage]);
      }

      setIsLoading(false);
    }, 2000);
  };

  const generateMockResponse = (
    userInput: string,
    persona: AssistantPersona,
    isSecondOpinion: boolean = false
  ): string => {
    const input = userInput.toLowerCase();

    if (isSecondOpinion) {
      if (input.includes('energy') || input.includes('tired')) {
        return `[${persona.name_en} - Second Opinion]\n\nI'd like to offer a different perspective. While the previous advice is valid, let me add a more holistic view:\n\nYour afternoon energy dip could be related to your meal composition and stress levels. Consider not just what you eat, but when and how you eat. Eating while stressed or rushing can affect digestion and energy.\n\nI'd suggest:\n1. Take a 5-minute break before lunch to de-stress\n2. Eat mindfully without screens\n3. Include some movement after eating (even a short walk)\n4. Check your hydration - often overlooked!\n\nThis approach addresses both physiological and behavioral factors.`;
      }
    }

    if (input.includes('sleep') || input.includes('tired')) {
      if (persona.role_type === 'doctor') {
        return 'Based on your query about fatigue, let me provide an evidence-based perspective. Sleep quality is influenced by multiple factors: sleep duration (7-9 hours recommended), sleep consistency, circadian rhythm alignment, and sleep environment. Research shows that irregular sleep schedules can reduce sleep quality by up to 30%. I\'d recommend tracking your sleep patterns for a week and looking for correlations with energy levels. Would you like me to generate a detailed sleep analysis report?';
      } else if (persona.role_type === 'nurse') {
        return 'I hear you\'re feeling tired! Let\'s explore this together. When do you usually feel most fatigued - is it throughout the day or at specific times? Have you noticed any changes in your routine recently? Sometimes simple adjustments like consistent wake times, limiting screen time before bed, or a relaxing evening routine can make a big difference. Tell me more about your typical day, and we can identify some practical steps you can take right away.';
      }
    }

    if (input.includes('energy') || input.includes('afternoon')) {
      if (persona.role_type === 'doctor') {
        return 'Afternoon energy dips, often called the "post-lunch dip," are well-documented in chronobiology research. They\'re linked to your circadian rhythm and postprandial (after-eating) glucose responses. Key evidence-based strategies: 1) Balanced meals with protein and fiber to stabilize blood sugar, 2) Strategic light exposure (natural light helps), 3) Brief movement breaks (studies show 5-minute walks improve alertness by 20%). Avoid high-glycemic carbs at lunch. Would you like a personalized nutrition analysis?';
      } else if (persona.role_type === 'coach') {
        return 'Great question about afternoon energy! Here\'s my coaching approach: Let\'s build a sustainable "energy protocol." Start small: 1) This week, try a 10-minute walk after lunch - track your afternoon energy on a 1-10 scale. 2) Swap one refined carb for a protein + veggie combo at lunch. 3) Set a 3pm "power posture" reminder - stand, stretch, breathe. We\'ll review what worked best for YOU and build from there. Small wins lead to big changes!';
      }
    }

    return `Thank you for your question. As your ${persona.role_type}, I'm here to provide ${persona.role_type === 'doctor' ? 'evidence-based guidance' : persona.role_type === 'nurse' ? 'practical support' : 'motivational coaching'}. Could you provide more details about your situation so I can give you more personalized advice?`;
  };

  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const getPersonaIcon = (roleType: string) => {
    switch (roleType) {
      case 'doctor':
        return <Stethoscope className="h-5 w-5" />;
      case 'nurse':
        return <Heart className="h-5 w-5" />;
      case 'coach':
        return <Users className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
      <div className="w-full max-w-2xl h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Health Advisor</h3>
              <p className="text-white/80 text-xs">
                {selectedPersona ? selectedPersona.name_en : 'Choose a persona'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {personas.map(persona => (
            <button
              key={persona.id}
              onClick={() => setSelectedPersona(persona)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedPersona?.id === persona.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {getPersonaIcon(persona.role_type)}
              <span className="text-sm font-medium">{persona.name_en}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => {
            const persona = personas.find(p => p.id === message.persona_id);
            const isUser = message.role === 'user';

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {!isUser && (
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.is_second_opinion
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}>
                      {persona && getPersonaIcon(persona.role_type)}
                    </div>
                  )}

                  <div className={`group relative ${isUser ? 'bg-blue-600 text-white' : message.is_second_opinion ? 'bg-purple-50 dark:bg-purple-900/20 text-gray-900 dark:text-white border border-purple-200 dark:border-purple-800' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'} rounded-2xl px-4 py-3`}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                    {!isUser && !message.is_second_opinion && (
                      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => handleRequestSecondOpinion(message.id)}
                          className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Second Opinion</span>
                        </button>
                        <button
                          onClick={() => handleCopyMessage(message.id, message.content)}
                          className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                          {copiedMessageId === message.id ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Voice input (coming soon)"
            >
              <Mic className="h-5 w-5" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your health..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={isLoading}
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            AI wellness guidance • Not medical diagnosis • Consult healthcare professionals
          </p>
        </div>
      </div>
    </div>
  );
}
