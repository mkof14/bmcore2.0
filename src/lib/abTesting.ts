import { supabase } from './supabase';
import { trackEvent } from './analytics';

export interface ABTest {
  id: string;
  name: string;
  variants: ABVariant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: string;
  endDate?: string;
}

export interface ABVariant {
  id: string;
  name: string;
  weight: number;
  config: Record<string, any>;
}

export interface ABAssignment {
  testId: string;
  variantId: string;
  userId?: string;
  sessionId: string;
  assignedAt: string;
}

class ABTestingFramework {
  private assignments: Map<string, string> = new Map();
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.loadAssignments();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('ab_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ab_session_id', sessionId);
    }
    return sessionId;
  }

  private loadAssignments(): void {
    try {
      const stored = localStorage.getItem('ab_assignments');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.assignments = new Map(Object.entries(parsed));
      }
    } catch (e) {
      console.error('Failed to load AB test assignments:', e);
    }
  }

  private saveAssignments(): void {
    try {
      const obj = Object.fromEntries(this.assignments);
      localStorage.setItem('ab_assignments', JSON.stringify(obj));
    } catch (e) {
      console.error('Failed to save AB test assignments:', e);
    }
  }

  async getVariant(testName: string): Promise<ABVariant | null> {
    const existingVariantId = this.assignments.get(testName);
    if (existingVariantId) {
      const variant = await this.getVariantById(testName, existingVariantId);
      if (variant) return variant;
    }

    const test = await this.getActiveTest(testName);
    if (!test || test.status !== 'running') {
      return null;
    }

    const variant = this.selectVariant(test.variants);
    if (!variant) return null;

    this.assignments.set(testName, variant.id);
    this.saveAssignments();

    await this.recordAssignment(test.id, variant.id);

    trackEvent('ab_test_assignment', {
      testName,
      variantId: variant.id,
      variantName: variant.name
    });

    return variant;
  }

  private selectVariant(variants: ABVariant[]): ABVariant | null {
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    let random = Math.random() * totalWeight;

    for (const variant of variants) {
      random -= variant.weight;
      if (random <= 0) {
        return variant;
      }
    }

    return variants[0] || null;
  }

  private async getActiveTest(testName: string): Promise<ABTest | null> {
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select('*')
        .eq('name', testName)
        .eq('status', 'running')
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Failed to get active test:', e);
      return null;
    }
  }

  private async getVariantById(testName: string, variantId: string): Promise<ABVariant | null> {
    try {
      const { data, error } = await supabase
        .from('ab_test_variants')
        .select('*')
        .eq('id', variantId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Failed to get variant:', e);
      return null;
    }
  }

  private async recordAssignment(testId: string, variantId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ab_test_assignments')
        .insert({
          test_id: testId,
          variant_id: variantId,
          session_id: this.sessionId,
          assigned_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (e) {
      console.error('Failed to record assignment:', e);
    }
  }

  async trackConversion(testName: string, conversionType: string, value?: number): Promise<void> {
    const variantId = this.assignments.get(testName);
    if (!variantId) return;

    try {
      const { error } = await supabase
        .from('ab_test_conversions')
        .insert({
          test_name: testName,
          variant_id: variantId,
          session_id: this.sessionId,
          conversion_type: conversionType,
          value: value || 0,
          converted_at: new Date().toISOString()
        });

      if (error) throw error;

      trackEvent('ab_test_conversion', {
        testName,
        variantId,
        conversionType,
        value
      });
    } catch (e) {
      console.error('Failed to track conversion:', e);
    }
  }

  getAssignedVariant(testName: string): string | undefined {
    return this.assignments.get(testName);
  }

  async getTestResults(testName: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .rpc('get_ab_test_results', { test_name: testName });

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Failed to get test results:', e);
      return null;
    }
  }
}

export const abTesting = new ABTestingFramework();

export async function useABTest(testName: string): Promise<ABVariant | null> {
  return abTesting.getVariant(testName);
}

export async function trackABConversion(testName: string, conversionType: string, value?: number): Promise<void> {
  return abTesting.trackConversion(testName, conversionType, value);
}

export function getAssignedVariant(testName: string): string | undefined {
  return abTesting.getAssignedVariant(testName);
}
