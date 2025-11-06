import { useState } from 'react';
import { CheckCircle2, AlertTriangle, Merge, FileText, Target, ChevronDown, ChevronUp, BookOpen, Heart } from 'lucide-react';
import type { Opinion, OpinionDiff, MergedOpinion } from '../lib/dualOpinionEngine';

interface DualOpinionViewProps {
  opinionA: Opinion;
  opinionB: Opinion;
  diff: OpinionDiff;
  onMerge: (preference: 'A' | 'B' | 'merge') => void;
  onCreateReport: () => void;
  onAddGoals: (recommendations: any[]) => void;
}

export default function DualOpinionView({
  opinionA,
  opinionB,
  diff,
  onMerge,
  onCreateReport,
  onAddGoals
}: DualOpinionViewProps) {
  const [showDiff, setShowDiff] = useState(true);
  const [mergedView, setMergedView] = useState<MergedOpinion | null>(null);

  const handleMerge = (preference: 'A' | 'B' | 'merge') => {
    onMerge(preference);
    setMergedView(null);
  };

  if (mergedView) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3 mb-4">
            <Merge className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Merged Opinion</h3>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">{mergedView.summary}</p>

          <div className="space-y-3">
            {mergedView.combinedRecommendations.map((rec, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    rec.source === 'both'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : rec.source === 'A'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>
                    {rec.source === 'both' ? 'Both' : `Opinion ${rec.source}`}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{rec.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={onCreateReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Create Report</span>
            </button>
            <button
              onClick={() => onAddGoals(mergedView.combinedRecommendations)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Target className="h-4 w-4" />
              <span>Add as Goals</span>
            </button>
            <button
              onClick={() => setMergedView(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              Back to Comparison
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Opinion A</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{opinionA.persona.name_en}</p>
            </div>
            <div className="ml-auto">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">
                {opinionA.confidence}% confident
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-medium">{opinionA.summary}</p>

          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Reasoning</h4>
            {opinionA.reasoning.map((reason, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">{reason}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Recommendations</h4>
            {opinionA.recommendations.map((rec, index) => (
              <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="flex items-start justify-between mb-1">
                  <h5 className="font-semibold text-sm text-gray-900 dark:text-white">{rec.title}</h5>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Opinion B</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{opinionB.persona.name_en}</p>
            </div>
            <div className="ml-auto">
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold">
                {opinionB.confidence}% confident
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-medium">{opinionB.summary}</p>

          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Reasoning</h4>
            {opinionB.reasoning.map((reason, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">{reason}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Recommendations</h4>
            {opinionB.recommendations.map((rec, index) => (
              <div key={index} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <div className="flex items-start justify-between mb-1">
                  <h5 className="font-semibold text-sm text-gray-900 dark:text-white">{rec.title}</h5>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowDiff(!showDiff)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Opinion Comparison ({diff.overallAlignment}% alignment)
            </span>
          </div>
          {showDiff ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {showDiff && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {diff.agreements.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Agreements ({diff.agreements.length})</h4>
                </div>
                <div className="space-y-2">
                  {diff.agreements.map((agreement, index) => (
                    <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border-l-4 border-green-500">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{agreement.topic}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{agreement.consensus}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diff.disagreements.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Disagreements ({diff.disagreements.length})</h4>
                </div>
                <div className="space-y-2">
                  {diff.disagreements.map((disagreement, index) => (
                    <div key={index} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border-l-4 border-orange-500">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{disagreement.topic}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Opinion A</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{disagreement.opinionA}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Opinion B</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{disagreement.opinionB}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{disagreement.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(diff.uniqueToA.length > 0 || diff.uniqueToB.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diff.uniqueToA.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Unique to Opinion A</h4>
                    <ul className="space-y-1">
                      {diff.uniqueToA.map((item, index) => (
                        <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {diff.uniqueToB.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">Unique to Opinion B</h4>
                    <ul className="space-y-1">
                      {diff.uniqueToB.map((item, index) => (
                        <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleMerge('A')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <span>Adopt Opinion A</span>
        </button>
        <button
          onClick={() => handleMerge('B')}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <span>Adopt Opinion B</span>
        </button>
        <button
          onClick={() => {
            const { mergeOpinions } = require('../lib/dualOpinionEngine');
            const merged = mergeOpinions(opinionA, opinionB, 'merge');
            setMergedView(merged);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Merge className="h-4 w-4" />
          <span>Merge Both</span>
        </button>
        <button
          onClick={onCreateReport}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span>Create Report</span>
        </button>
      </div>
    </div>
  );
}
