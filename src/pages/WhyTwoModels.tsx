import { Brain, Microscope, Shield, Zap } from 'lucide-react';

export default function WhyTwoModels() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Why Two AI Models?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our revolutionary dual-engine approach combines mathematical precision with clinical expertise to provide you with the most comprehensive health analysis available.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
              <Microscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Mathematical Model
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Pure data-driven analysis using advanced mathematical algorithms and statistical methods.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span className="text-gray-700 dark:text-gray-300">Unbiased pattern recognition</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span className="text-gray-700 dark:text-gray-300">Complex correlation analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span className="text-gray-700 dark:text-gray-300">Predictive modeling</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span className="text-gray-700 dark:text-gray-300">Anomaly detection</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Clinical Model
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Evidence-based analysis using medical knowledge and clinical guidelines.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-orange-600 dark:text-orange-400">•</span>
                <span className="text-gray-700 dark:text-gray-300">Medical context interpretation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 dark:text-orange-400">•</span>
                <span className="text-gray-700 dark:text-gray-300">Evidence-based recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 dark:text-orange-400">•</span>
                <span className="text-gray-700 dark:text-gray-300">Clinical guideline adherence</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 dark:text-orange-400">•</span>
                <span className="text-gray-700 dark:text-gray-300">Risk factor assessment</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            The Power of Dual Analysis
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Higher Accuracy
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cross-validation between models reduces false positives and ensures reliable insights
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Comprehensive View
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See both data-driven patterns and clinical interpretations side by side
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Better Decisions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Make informed choices with insights backed by both mathematics and medicine
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">The Second Opinion Advantage</h2>
          <p className="text-lg opacity-90 mb-8 max-w-3xl">
            Just like seeking a second medical opinion, our dual AI approach provides you with two independent analyses of your health data. When both models agree, you can have high confidence. When they differ, it highlights areas that may need additional attention or professional consultation.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-sm opacity-80">
            <div>
              <h4 className="font-semibold mb-2 text-base opacity-100">Mathematical Model Strengths:</h4>
              <ul className="space-y-1">
                <li>• Discovers hidden patterns</li>
                <li>• Processes vast amounts of data</li>
                <li>• Identifies subtle correlations</li>
                <li>• Predicts future trends</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-base opacity-100">Clinical Model Strengths:</h4>
              <ul className="space-y-1">
                <li>• Applies medical expertise</li>
                <li>• Considers clinical context</li>
                <li>• Follows evidence-based guidelines</li>
                <li>• Prioritizes safety and efficacy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
