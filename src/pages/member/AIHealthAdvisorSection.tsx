import { useState } from 'react';
import { Sparkles, Send, Brain, AlertCircle } from 'lucide-react';

export default function AIHealthAdvisorSection() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<{
    opinion1: string | null;
    opinion2: string | null;
  }>({ opinion1: null, opinion2: null });

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponses({ opinion1: null, opinion2: null });

    setTimeout(() => {
      setResponses({
        opinion1: `AI Opinion #1 (Evidence-Based): Based on current medical research and clinical guidelines regarding "${question}", I would recommend consulting with a healthcare professional for personalized advice. This is a simulated response demonstrating the dual opinion system.`,
        opinion2: `AI Opinion #2 (Contextual): Taking into account your specific health profile and the question "${question}", here's a contextual perspective. This second AI model provides complementary insights. This is a simulated response for demonstration purposes.`
      });
      setLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-orange-500" />
          AI Health Advisor
        </h1>
        <p className="text-gray-400">
          Get dual AI expert opinions on your health questions for comprehensive insights
        </p>
      </div>

      <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-200 font-medium mb-1">Medical Disclaimer</p>
            <p className="text-xs text-yellow-300/80">
              AI responses are for informational purposes only. Always consult qualified healthcare
              professionals for medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ask Your Health Question</h3>
        <div className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={4}
            placeholder="Type your health question here... (e.g., 'What are the benefits of regular exercise for heart health?')"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!question.trim() || loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing with dual AI...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Get Dual AI Opinions
              </>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-orange-600/30 rounded-xl p-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
              <p className="text-white font-semibold">Analyzing your question with dual AI models...</p>
            </div>
            <div className="space-y-2 pl-8">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Model #1: Evidence-based analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>AI Model #2: Contextual analysis</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && responses.opinion1 && responses.opinion2 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="h-6 w-6 text-orange-500" />
            Dual AI Opinions
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-gray-900 border border-blue-600/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-900/30 border border-blue-600/30 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">AI Opinion #1</h4>
                  <p className="text-xs text-blue-400">Evidence-Based Perspective</p>
                </div>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{responses.opinion1}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-600/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Confidence:</span>
                  <span className="text-blue-400 font-semibold">85%</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-gray-500">Sources:</span>
                  <span className="text-blue-400 font-semibold">Medical research</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 via-green-800/10 to-gray-900 border border-green-600/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-900/30 border border-green-600/30 rounded-lg">
                  <Brain className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">AI Opinion #2</h4>
                  <p className="text-xs text-green-400">Contextual Perspective</p>
                </div>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{responses.opinion2}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-green-600/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Confidence:</span>
                  <span className="text-green-400 font-semibold">78%</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-gray-500">Personalization:</span>
                  <span className="text-green-400 font-semibold">High</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-3">Key Insights</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Both AI models agree on the importance of consulting healthcare professionals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Evidence-based opinion focuses on general medical guidelines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Contextual opinion considers your individual health profile</span>
              </li>
            </ul>
            <button
              onClick={() => {
                setQuestion('');
                setResponses({ opinion1: null, opinion2: null });
              }}
              className="mt-4 px-6 py-2 bg-blue-900/30 border border-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-colors"
            >
              Ask Another Question
            </button>
          </div>
        </div>
      )}

      {!loading && !responses.opinion1 && (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No questions asked yet</p>
          <p className="text-sm text-gray-500">Ask a health question to get dual AI expert opinions</p>
        </div>
      )}
    </div>
  );
}
