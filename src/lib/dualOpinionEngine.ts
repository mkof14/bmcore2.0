import type { AssistantPersona } from '../types/database';

export interface Opinion {
  model: string;
  persona: AssistantPersona;
  summary: string;
  reasoning: string[];
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    actionable: boolean;
  }>;
  confidence: number;
  citations?: string[];
  warnings?: string[];
}

export interface OpinionDiff {
  agreements: Array<{
    topic: string;
    consensus: string;
    confidence: number;
  }>;
  disagreements: Array<{
    topic: string;
    opinionA: string;
    opinionB: string;
    severity: 'high' | 'medium' | 'low';
    explanation: string;
  }>;
  uniqueToA: string[];
  uniqueToB: string[];
  overallAlignment: number;
}

export interface MergedOpinion {
  summary: string;
  combinedRecommendations: Array<{
    title: string;
    description: string;
    source: 'A' | 'B' | 'both';
    priority: 'high' | 'medium' | 'low';
  }>;
  notes: string;
}

export function generateDualOpinion(
  userMessage: string,
  personaA: AssistantPersona,
  personaB: AssistantPersona
): { opinionA: Opinion; opinionB: Opinion; diff: OpinionDiff } {
  const opinionA = generateOpinion(userMessage, personaA, 'A');
  const opinionB = generateOpinion(userMessage, personaB, 'B');
  const diff = calculateDiff(opinionA, opinionB);

  return { opinionA, opinionB, diff };
}

function generateOpinion(
  userMessage: string,
  persona: AssistantPersona,
  model: 'A' | 'B'
): Opinion {
  const input = userMessage.toLowerCase();
  const isEvidenceBased = persona.reasoning_style === 'evidence_based';
  const isDoctor = persona.role_type === 'doctor';

  if (input.includes('energy') || input.includes('tired') || input.includes('fatigue')) {
    if (isEvidenceBased || isDoctor) {
      return {
        model,
        persona,
        summary: 'Afternoon energy decline is linked to circadian rhythm and postprandial glucose response',
        reasoning: [
          'Circadian rhythm naturally dips between 1-3 PM (adenosine accumulation)',
          'Postprandial glucose fluctuations affect alertness (insulin response)',
          'Sleep debt compounds midday fatigue (cumulative effect)',
          'Meal composition directly impacts blood sugar stability'
        ],
        recommendations: [
          {
            title: 'Optimize meal macronutrient balance',
            description: 'Lunch should contain 30-40g protein, complex carbs, and healthy fats to stabilize blood glucose for 4-5 hours',
            priority: 'high',
            actionable: true
          },
          {
            title: 'Strategic light exposure',
            description: 'Get 10-15 minutes of bright natural light after lunch to suppress melatonin and boost alertness',
            priority: 'high',
            actionable: true
          },
          {
            title: 'Brief movement protocol',
            description: 'Studies show 5-minute walks post-meal improve glucose metabolism and increase alertness by 20%',
            priority: 'medium',
            actionable: true
          },
          {
            title: 'Sleep consistency tracking',
            description: 'Monitor sleep schedule variance - even 30-minute shifts reduce daytime energy',
            priority: 'medium',
            actionable: true
          }
        ],
        confidence: 85,
        citations: [
          'Monk et al. (1997) - Circadian rhythms in human performance',
          'Jenkins et al. (2002) - Glycemic index and cognitive function'
        ]
      };
    } else {
      return {
        model,
        persona,
        summary: 'Your afternoon energy dip is likely a combination of lifestyle factors we can address practically',
        reasoning: [
          'Lunch timing and composition affect how you feel afterward',
          'Your work environment and stress levels play a role',
          'Small behavior changes can create significant improvement',
          'Individual response varies - we need to find what works for YOU'
        ],
        recommendations: [
          {
            title: 'Mindful eating practice',
            description: 'Take 5 minutes before lunch to de-stress. Eat without screens, chew slowly. This improves digestion and reduces afternoon crash',
            priority: 'high',
            actionable: true
          },
          {
            title: 'Power posture break',
            description: 'Set 2:30 PM reminder: stand up, stretch arms overhead, take 5 deep breaths. Simple but effective energy reset',
            priority: 'high',
            actionable: true
          },
          {
            title: 'Hydration check',
            description: 'Often overlooked! Drink 16oz water with lunch and another 16oz at 2 PM. Dehydration mimics fatigue',
            priority: 'medium',
            actionable: true
          },
          {
            title: 'Social lunch walk',
            description: 'If possible, take lunch outside or walk with colleagues. Social + movement + daylight = triple boost',
            priority: 'low',
            actionable: true
          }
        ],
        confidence: 78,
        warnings: [
          'If fatigue persists despite lifestyle changes, consider consulting healthcare provider to rule out underlying conditions'
        ]
      };
    }
  }

  if (input.includes('sleep')) {
    if (isEvidenceBased || isDoctor) {
      return {
        model,
        persona,
        summary: 'Sleep quality is multifactorial, involving circadian alignment, sleep architecture, and environmental factors',
        reasoning: [
          'Circadian misalignment reduces sleep efficiency',
          'Core body temperature affects sleep onset',
          'Light exposure timing regulates melatonin production',
          'Sleep debt accumulates and compounds'
        ],
        recommendations: [
          {
            title: 'Fixed wake time protocol',
            description: 'Wake at same time daily (±15 min) including weekends. This anchors circadian rhythm within 10-14 days',
            priority: 'high',
            actionable: true
          },
          {
            title: 'Temperature optimization',
            description: 'Bedroom 65-68°F (18-20°C). Take warm shower 60-90 min before bed to trigger cooling response',
            priority: 'high',
            actionable: true
          },
          {
            title: 'Light hygiene protocol',
            description: 'Blue light reduction 2h before bed. Morning bright light within 30 min of waking (10,000 lux or sunlight)',
            priority: 'medium',
            actionable: true
          }
        ],
        confidence: 88,
        citations: [
          'Walker, M. (2017) - Why We Sleep',
          'Czeisler et al. (1999) - Stability, precision, and near-24-hour period of the human circadian pacemaker'
        ]
      };
    } else {
      return {
        model,
        persona,
        summary: 'Let\'s build a realistic evening routine that fits your life and improves sleep quality',
        reasoning: [
          'Sleep is affected by your entire day, not just bedtime',
          'Small consistent changes beat perfect but unsustainable plans',
          'Your unique constraints matter - work schedule, family, habits',
          'Progress tracking helps identify what actually works for you'
        ],
        recommendations: [
          {
            title: 'Wind-down ritual (start small)',
            description: 'Choose ONE relaxing activity at same time each night. Reading, stretching, or journaling for just 10 minutes',
            priority: 'high',
            actionable: true
          },
          {
            title: 'Screen sunset rule',
            description: 'Pick a realistic time (e.g., 10 PM) - no phones after that. Use phone\'s bedtime mode to help enforce',
            priority: 'high',
            actionable: true
          },
          {
            title: 'Bedroom = sleep only',
            description: 'Remove work, TV, clutter. Train your brain: bed = sleep. This association builds over 2-3 weeks',
            priority: 'medium',
            actionable: true
          }
        ],
        confidence: 82
      };
    }
  }

  return {
    model,
    persona,
    summary: `As your ${persona.role_type}, I need more context to provide personalized guidance`,
    reasoning: [
      'Each person\'s health situation is unique',
      'Context helps me give relevant, actionable advice',
      'Understanding your goals and constraints is essential'
    ],
    recommendations: [
      {
        title: 'Provide more details',
        description: 'Tell me more about your specific situation, symptoms, timeline, or what you\'ve already tried',
        priority: 'high',
        actionable: true
      }
    ],
    confidence: 60
  };
}

function calculateDiff(opinionA: Opinion, opinionB: Opinion): OpinionDiff {
  const agreements: OpinionDiff['agreements'] = [];
  const disagreements: OpinionDiff['disagreements'] = [];
  const uniqueToA: string[] = [];
  const uniqueToB: string[] = [];

  const recsA = opinionA.recommendations.map(r => r.title.toLowerCase());
  const recsB = opinionB.recommendations.map(r => r.title.toLowerCase());

  const commonTopics = opinionA.recommendations.filter(recA =>
    recsB.some(recB => similarity(recA.title.toLowerCase(), recB) > 0.6)
  );

  commonTopics.forEach(rec => {
    agreements.push({
      topic: rec.title,
      consensus: 'Both models recommend this approach',
      confidence: Math.round((opinionA.confidence + opinionB.confidence) / 2)
    });
  });

  opinionA.recommendations.forEach(recA => {
    const hasMatch = recsB.some(recB =>
      similarity(recA.title.toLowerCase(), recB) > 0.6
    );
    if (!hasMatch) {
      uniqueToA.push(recA.title);
    }
  });

  opinionB.recommendations.forEach(recB => {
    const hasMatch = recsA.some(recA =>
      similarity(recB.title.toLowerCase(), recA) > 0.6
    );
    if (!hasMatch) {
      uniqueToB.push(recB.title);
    }
  });

  if (opinionA.recommendations.length > 0 && opinionB.recommendations.length > 0) {
    const firstRecA = opinionA.recommendations[0];
    const firstRecB = opinionB.recommendations[0];

    if (similarity(firstRecA.title.toLowerCase(), firstRecB.title.toLowerCase()) < 0.5) {
      disagreements.push({
        topic: 'Primary focus',
        opinionA: firstRecA.title,
        opinionB: firstRecB.title,
        severity: 'medium',
        explanation: `Opinion A prioritizes ${firstRecA.title.toLowerCase()} while Opinion B emphasizes ${firstRecB.title.toLowerCase()}`
      });
    }
  }

  const alignmentScore = agreements.length > 0
    ? (agreements.length / Math.max(opinionA.recommendations.length, opinionB.recommendations.length)) * 100
    : 50;

  return {
    agreements,
    disagreements,
    uniqueToA,
    uniqueToB,
    overallAlignment: Math.round(alignmentScore)
  };
}

function similarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  const commonWords = words1.filter(w => words2.includes(w));
  return commonWords.length / Math.max(words1.length, words2.length);
}

export function mergeOpinions(
  opinionA: Opinion,
  opinionB: Opinion,
  preference: 'A' | 'B' | 'merge'
): MergedOpinion {
  if (preference === 'A') {
    return {
      summary: opinionA.summary,
      combinedRecommendations: opinionA.recommendations.map(r => ({
        ...r,
        source: 'A' as const
      })),
      notes: 'Adopted Opinion A (Evidence-Based approach)'
    };
  }

  if (preference === 'B') {
    return {
      summary: opinionB.summary,
      combinedRecommendations: opinionB.recommendations.map(r => ({
        ...r,
        source: 'B' as const
      })),
      notes: 'Adopted Opinion B (Contextual approach)'
    };
  }

  const merged: MergedOpinion['combinedRecommendations'] = [];
  const seenTitles = new Set<string>();

  opinionA.recommendations.forEach(recA => {
    const matchingB = opinionB.recommendations.find(recB =>
      similarity(recA.title.toLowerCase(), recB.title.toLowerCase()) > 0.6
    );

    if (matchingB) {
      merged.push({
        title: recA.title,
        description: `${recA.description}\n\nComplementary approach: ${matchingB.description}`,
        source: 'both',
        priority: recA.priority === 'high' || matchingB.priority === 'high' ? 'high' : 'medium'
      });
      seenTitles.add(recA.title.toLowerCase());
      seenTitles.add(matchingB.title.toLowerCase());
    } else {
      merged.push({ ...recA, source: 'A' });
      seenTitles.add(recA.title.toLowerCase());
    }
  });

  opinionB.recommendations.forEach(recB => {
    if (!seenTitles.has(recB.title.toLowerCase())) {
      merged.push({ ...recB, source: 'B' });
    }
  });

  return {
    summary: `Combined insights: ${opinionA.summary.split('.')[0]}. ${opinionB.summary.split('.')[0]}.`,
    combinedRecommendations: merged.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    notes: 'Merged both perspectives for comprehensive approach'
  };
}
