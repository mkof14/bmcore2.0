import { Brain, Activity, Dna, LineChart, FlaskConical, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';

export default function Science() {
  return (
    <>
      <SEO
        title="Science & Research - Biomathematical Health Modeling"
        description="Discover the scientific foundation of BioMath Core: biomathematical modeling, multi-signal integration, genomic analysis, and predictive analytics for personalized health intelligence."
        keywords={['biomathematics', 'health modeling', 'systems biology', 'predictive analytics', 'genomic analysis', 'physiological dynamics', 'computational biology']}
        url="/science"
      />
      <ScienceContent />
    </>
  );
}

function ScienceContent() {
  const pillars = [
    {
      icon: Brain,
      title: 'Biomathematical Modeling',
      description: 'We use differential equations and systems biology to model physiological dynamics, not just pattern recognition.'
    },
    {
      icon: Activity,
      title: 'Multi-Signal Integration',
      description: 'Combining heart rate variability, activity patterns, sleep architecture, and metabolic markers into unified models.'
    },
    {
      icon: Dna,
      title: 'Genomic Analysis',
      description: 'Incorporating genetic predispositions for inflammation, stress response, and metabolic efficiency.'
    },
    {
      icon: LineChart,
      title: 'Predictive Analytics',
      description: 'Forecasting health trajectories based on current patterns and historical data.'
    },
    {
      icon: FlaskConical,
      title: 'Lab Integration',
      description: 'Incorporating biomarkers like cortisol, glucose, inflammation markers, and hormone levels.'
    },
    {
      icon: BookOpen,
      title: 'Evidence-Based',
      description: 'Every model is grounded in peer-reviewed research and validated against clinical outcomes.'
    }
  ];

  const models = [
    {
      name: 'Stress-Recovery Dynamics',
      description: 'Models the relationship between sympathetic activation, HRV patterns, and recovery capacity.',
      equations: 'dS/dt = α·I - β·R',
      interpretation: 'Stress accumulates based on inputs (I) and dissipates based on recovery (R).'
    },
    {
      name: 'Metabolic State Estimation',
      description: 'Estimates insulin sensitivity, glucose regulation, and metabolic flexibility from activity and nutrition data.',
      equations: 'M(t) = f(G, A, N, H)',
      interpretation: 'Metabolic state is a function of glucose (G), activity (A), nutrition (N), and hormones (H).'
    },
    {
      name: 'Inflammatory Load',
      description: 'Quantifies systemic inflammation based on sleep quality, stress, diet, and genetic markers.',
      equations: 'I = Σ(wi · fi) + ge',
      interpretation: 'Inflammation is weighted sum of lifestyle factors (f) plus genetic contribution (g).'
    },
    {
      name: 'Energy Availability',
      description: 'Models available energy for physical and cognitive performance based on sleep, nutrition, and recovery.',
      equations: 'E = E₀ + ΔS + ΔN - ΔW',
      interpretation: 'Energy changes based on sleep (S), nutrition (N), and work output (W).'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">The Science Behind BioMath Core</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform is built on decades of research in systems biology, biomathematics, and physiological modeling.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Core Scientific Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all">
                <pillar.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{pillar.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Mathematical Models
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Unlike black-box AI, our models are interpretable and explainable. Every prediction can be traced back to its underlying drivers.
            </p>
          </div>

          <div className="space-y-8">
            {models.map((model, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
                  <div className="flex-1 mb-6 lg:mb-0">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{model.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{model.description}</p>
                    <div className="inline-block bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Simplified Form:</p>
                      <code className="text-blue-700 dark:text-blue-300 font-mono font-semibold">{model.equations}</code>
                    </div>
                  </div>
                  <div className="lg:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Interpretation:</p>
                    <p className="text-gray-600 dark:text-gray-400">{model.interpretation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            From Data to Insight
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data Collection</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Continuous streams from wearables, periodic surveys, lab results, and genetic reports are normalized and time-aligned.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Model Processing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Biomathematical models process the data to estimate physiological states, predict trajectories, and identify patterns.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Actionable Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Results are translated into clear recommendations: what's happening, why it's happening, and what to do about it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">Why Biomathematics?</h2>
              <div className="space-y-4 text-lg text-blue-100">
                <p>
                  <strong className="text-white">Explainability:</strong> Unlike neural networks, mathematical models can be interrogated and understood.
                </p>
                <p>
                  <strong className="text-white">Stability:</strong> Models don't drift or require constant retraining with new data.
                </p>
                <p>
                  <strong className="text-white">Efficiency:</strong> Smaller data requirements compared to deep learning approaches.
                </p>
                <p>
                  <strong className="text-white">Biological Grounding:</strong> Models reflect actual physiological mechanisms, not just correlations.
                </p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">Published Research</h3>
              <p className="text-blue-100 mb-6">
                Our scientific team has published extensively in peer-reviewed journals on topics including:
              </p>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Systems biology of stress and recovery</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Mathematical modeling of metabolic dynamics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Heart rate variability and autonomic function</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Predictive modeling in precision medicine</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Experience Science-Backed Wellness
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands who trust BioMath Core for evidence-based health insights.
          </p>
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
            Explore the Platform
          </button>
        </div>
      </section>
    </div>
  );
}
