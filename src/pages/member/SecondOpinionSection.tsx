import { useState } from 'react';
import { Scale, Send, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function SecondOpinionSection() {
  const [request, setRequest] = useState({ question: '', context: '' });
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle');

  const handleSubmit = () => {
    setStatus('processing');
    setTimeout(() => setStatus('ready'), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Scale className="h-8 w-8 text-orange-500" />
          AI Health Second Opinion
        </h1>
        <p className="text-gray-400">Get dual AI expert opinions on your health questions</p>
      </div>

      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-900 border border-blue-600/30 rounded-xl p-4">
          <FileText className="h-6 w-6 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">2</p>
          <p className="text-xs text-gray-400">AI Models</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/30 via-green-800/20 to-gray-900 border border-green-600/30 rounded-xl p-4">
          <CheckCircle className="h-6 w-6 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-white">Evidence-Based</p>
          <p className="text-xs text-gray-400">Research Backed</p>
        </div>
        <div className="bg-gradient-to-br from-orange-900/30 via-orange-800/20 to-gray-900 border border-orange-600/30 rounded-xl p-4">
          <Clock className="h-6 w-6 text-orange-400 mb-2" />
          <p className="text-2xl font-bold text-white">~2 min</p>
          <p className="text-xs text-gray-400">Analysis Time</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Submit Your Question</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Health Question</label>
            <textarea
              value={request.question}
              onChange={(e) => setRequest({ ...request, question: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="What health question do you need a second opinion on?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Medical Context (Optional)</label>
            <textarea
              value={request.context}
              onChange={(e) => setRequest({ ...request, context: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Provide any relevant medical history, test results, or current medications..."
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!request.question || status === 'processing'}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
            {status === 'processing' ? 'Analyzing...' : 'Get Second Opinion'}
          </button>
        </div>
      </div>

      {status === 'processing' && (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-orange-600/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <p className="text-white font-semibold">Analyzing with dual AI models...</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Model 1: Evidence-based analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="h-4 w-4 text-orange-500 animate-pulse" />
              <span>Model 2: Contextual analysis</span>
            </div>
          </div>
        </div>
      )}

      {status === 'ready' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-gray-900 border border-blue-600/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Opinion #1: Evidence-Based
            </h4>
            <p className="text-sm text-gray-300 mb-4">
              Based on current medical research and clinical guidelines, this is a simulated response. In production, this would connect to an actual AI model to provide evidence-based health guidance.
            </p>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">Confidence: 85%</div>
              <div className="text-xs text-gray-500">Sources: 12 medical papers</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 via-green-800/10 to-gray-900 border border-green-600/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-400" />
              Opinion #2: Contextual
            </h4>
            <p className="text-sm text-gray-300 mb-4">
              Considering your specific context and medical history, this is a simulated contextual response. Production version would analyze your complete health profile for personalized guidance.
            </p>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">Confidence: 78%</div>
              <div className="text-xs text-gray-500">Personalization: High</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-200 font-medium mb-1">Medical Disclaimer</p>
            <p className="text-xs text-yellow-300/80">
              AI opinions are for informational purposes only. Always consult with qualified healthcare professionals
              for medical advice, diagnosis, or treatment. Do not use AI opinions as a substitute for professional medical care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
