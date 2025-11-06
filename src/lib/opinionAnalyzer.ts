interface Insight {
  topic: string;
  content: string;
  confidence?: number;
  category?: string;
}

interface AnalysisResult {
  agreements: Array<{
    topic: string;
    consensus: string;
    confidence: number;
  }>;
  disagreements: Array<{
    topic: string;
    opinion_a: string;
    opinion_b: string;
    explanation: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  keyDifferences: Array<{
    aspect: string;
    description: string;
    impact: string;
  }>;
  confidenceOriginal: number;
  confidenceSecond: number;
}

export function analyzeOpinions(
  originalOutput: Record<string, any>,
  secondOutput: Record<string, any>
): AnalysisResult {
  const originalInsights: Insight[] = extractInsights(originalOutput);
  const secondInsights: Insight[] = extractInsights(secondOutput);

  const agreements: AnalysisResult['agreements'] = [];
  const disagreements: AnalysisResult['disagreements'] = [];
  const keyDifferences: AnalysisResult['keyDifferences'] = [];

  const topicMap = new Map<string, { original?: Insight; second?: Insight }>();

  originalInsights.forEach(insight => {
    const topic = normalizeTopicName(insight.topic);
    if (!topicMap.has(topic)) {
      topicMap.set(topic, {});
    }
    topicMap.get(topic)!.original = insight;
  });

  secondInsights.forEach(insight => {
    const topic = normalizeTopicName(insight.topic);
    if (!topicMap.has(topic)) {
      topicMap.set(topic, {});
    }
    topicMap.get(topic)!.second = insight;
  });

  topicMap.forEach((insights, topic) => {
    if (insights.original && insights.second) {
      const similarity = calculateSimilarity(
        insights.original.content,
        insights.second.content
      );

      if (similarity > 0.7) {
        agreements.push({
          topic: insights.original.topic,
          consensus: insights.original.content,
          confidence: Math.round(
            ((insights.original.confidence || 80) + (insights.second.confidence || 80)) / 2
          )
        });
      } else if (similarity < 0.4) {
        disagreements.push({
          topic: insights.original.topic,
          opinion_a: insights.original.content,
          opinion_b: insights.second.content,
          explanation: `The two models have different perspectives on ${topic}. Opinion A focuses on ${getKeywords(insights.original.content)[0] || 'data'}, while Opinion B emphasizes ${getKeywords(insights.second.content)[0] || 'context'}.`,
          severity: similarity < 0.2 ? 'high' : 'medium'
        });
      }
    }
  });

  const originalApproach = detectApproach(originalOutput);
  const secondApproach = detectApproach(secondOutput);

  if (originalApproach !== secondApproach) {
    keyDifferences.push({
      aspect: 'Reasoning Approach',
      description: `Opinion A uses a ${originalApproach} approach, while Opinion B uses a ${secondApproach} approach`,
      impact: 'This affects how each model prioritizes and interprets your health data'
    });
  }

  const originalFocus = detectFocus(originalInsights);
  const secondFocus = detectFocus(secondInsights);

  if (originalFocus !== secondFocus) {
    keyDifferences.push({
      aspect: 'Primary Focus',
      description: `Opinion A focuses on ${originalFocus}, while Opinion B focuses on ${secondFocus}`,
      impact: 'Different focuses lead to different types of recommendations'
    });
  }

  return {
    agreements,
    disagreements,
    keyDifferences,
    confidenceOriginal: calculateOverallConfidence(originalInsights),
    confidenceSecond: calculateOverallConfidence(secondInsights)
  };
}

function extractInsights(output: Record<string, any>): Insight[] {
  const insights: Insight[] = [];

  if (output.insights && Array.isArray(output.insights)) {
    return output.insights.map((insight: any) => ({
      topic: insight.topic || insight.title || 'General',
      content: insight.content || insight.description || insight.text || '',
      confidence: insight.confidence || 80,
      category: insight.category || 'general'
    }));
  }

  if (output.summary) {
    insights.push({
      topic: 'Summary',
      content: output.summary,
      confidence: 85
    });
  }

  if (output.recommendations && Array.isArray(output.recommendations)) {
    output.recommendations.forEach((rec: any, index: number) => {
      insights.push({
        topic: `Recommendation ${index + 1}`,
        content: typeof rec === 'string' ? rec : rec.text || rec.content || '',
        confidence: rec.confidence || 75
      });
    });
  }

  if (output.keyFindings && Array.isArray(output.keyFindings)) {
    output.keyFindings.forEach((finding: any, index: number) => {
      insights.push({
        topic: `Finding ${index + 1}`,
        content: typeof finding === 'string' ? finding : finding.text || finding.content || '',
        confidence: finding.confidence || 80
      });
    });
  }

  return insights;
}

function normalizeTopicName(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .trim();
}

function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(
    text1
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3)
  );
  const words2 = new Set(
    text2
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3)
  );

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return union.size > 0 ? intersection.size / union.size : 0;
}

function getKeywords(text: string, limit: number = 3): string[] {
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4 && !commonWords.has(w));

  const frequency = new Map<string, number>();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function detectApproach(output: Record<string, any>): string {
  const text = JSON.stringify(output).toLowerCase();

  const evidenceKeywords = ['study', 'research', 'clinical', 'evidence', 'data', 'statistic', 'proven'];
  const contextualKeywords = ['lifestyle', 'stress', 'behavior', 'habit', 'routine', 'personal', 'individual'];

  const evidenceScore = evidenceKeywords.reduce(
    (score, keyword) => score + (text.match(new RegExp(keyword, 'g')) || []).length,
    0
  );

  const contextualScore = contextualKeywords.reduce(
    (score, keyword) => score + (text.match(new RegExp(keyword, 'g')) || []).length,
    0
  );

  return evidenceScore > contextualScore ? 'evidence-based' : 'contextual';
}

function detectFocus(insights: Insight[]): string {
  const categories = insights.map(i => i.category || 'general');
  const categoryCount = new Map<string, number>();

  categories.forEach(cat => {
    categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
  });

  const topCategory = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])[0];

  return topCategory ? topCategory[0] : 'general wellness';
}

function calculateOverallConfidence(insights: Insight[]): number {
  if (insights.length === 0) return 75;

  const total = insights.reduce((sum, insight) => sum + (insight.confidence || 80), 0);
  return Math.round(total / insights.length);
}

export function generateComparisonSummary(analysis: AnalysisResult): string {
  const { agreements, disagreements, keyDifferences } = analysis;

  let summary = '';

  if (agreements.length > 0) {
    summary += `Both opinions agree on ${agreements.length} key point${agreements.length > 1 ? 's' : ''}. `;
  }

  if (disagreements.length > 0) {
    const highSeverity = disagreements.filter(d => d.severity === 'high').length;
    summary += `There ${disagreements.length === 1 ? 'is' : 'are'} ${disagreements.length} area${disagreements.length > 1 ? 's' : ''} of disagreement`;
    if (highSeverity > 0) {
      summary += ` (${highSeverity} significant)`;
    }
    summary += '. ';
  }

  if (keyDifferences.length > 0) {
    summary += `The models differ in their ${keyDifferences.map(d => d.aspect.toLowerCase()).join(' and ')}.`;
  }

  return summary || 'Both opinions provide consistent insights.';
}
