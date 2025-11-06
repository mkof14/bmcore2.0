import { supabase } from './supabase';

export interface UserDataExport {
  profile: any;
  healthData: any[];
  questionnaires: any[];
  reports: any[];
  goals: any[];
  habits: any[];
  deviceReadings: any[];
  subscriptions: any[];
  secondOpinions: any[];
  medicalFiles: any[];
  aiConversations: any[];
  exportedAt: string;
}

export async function exportUserData(userId: string): Promise<UserDataExport> {
  try {
    const [
      profileData,
      healthData,
      questionnaires,
      reports,
      goals,
      habits,
      deviceReadings,
      subscriptions,
      secondOpinions,
      medicalFiles,
      aiConversations
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('health_data').select('*').eq('user_id', userId),
      supabase.from('questionnaire_responses').select('*').eq('user_id', userId),
      supabase.from('health_reports').select('*').eq('user_id', userId),
      supabase.from('health_goals').select('*').eq('user_id', userId),
      supabase.from('habit_tracking').select('*').eq('user_id', userId),
      supabase.from('device_readings').select('*').eq('user_id', userId),
      supabase.from('user_subscriptions').select('*').eq('user_id', userId),
      supabase.from('second_opinion_requests').select('*').eq('user_id', userId),
      supabase.from('medical_files').select('*').eq('user_id', userId),
      supabase.from('ai_conversations').select('*').eq('user_id', userId)
    ]);

    return {
      profile: profileData.data,
      healthData: healthData.data || [],
      questionnaires: questionnaires.data || [],
      reports: reports.data || [],
      goals: goals.data || [],
      habits: habits.data || [],
      deviceReadings: deviceReadings.data || [],
      subscriptions: subscriptions.data || [],
      secondOpinions: secondOpinions.data || [],
      medicalFiles: medicalFiles.data || [],
      aiConversations: aiConversations.data || [],
      exportedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw new Error('Failed to export user data');
  }
}

export function downloadDataAsJSON(data: UserDataExport, filename?: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `biomath-data-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadDataAsCSV(data: UserDataExport, filename?: string) {
  const flattenedData = flattenObject(data);
  const csv = objectToCSV(flattenedData);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `biomath-data-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      flattened[newKey] = JSON.stringify(value);
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
}

function objectToCSV(data: Record<string, any>): string {
  const headers = Object.keys(data);
  const values = Object.values(data).map(v =>
    typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
  );

  return [headers.join(','), values.join(',')].join('\n');
}

export async function exportAndDownloadUserData(userId: string, format: 'json' | 'csv' = 'json') {
  const data = await exportUserData(userId);

  if (format === 'json') {
    downloadDataAsJSON(data);
  } else {
    downloadDataAsCSV(data);
  }
}

export async function deleteUserData(userId: string): Promise<void> {
  try {
    const tables = [
      'ai_conversations',
      'device_readings',
      'habit_tracking',
      'health_goals',
      'health_reports',
      'questionnaire_responses',
      'health_data',
      'second_opinion_requests',
      'medical_files',
      'user_subscriptions',
      'user_services',
      'profiles'
    ];

    for (const table of tables) {
      await supabase.from(table).delete().eq('user_id', userId);
    }

    await supabase.auth.admin.deleteUser(userId);
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw new Error('Failed to delete user data');
  }
}

export async function anonymizeUserData(userId: string): Promise<void> {
  try {
    await supabase.from('profiles').update({
      full_name: 'Anonymous User',
      email: `anonymous_${userId}@deleted.local`,
      phone: null,
      date_of_birth: null,
      address: null,
      emergency_contact: null,
      avatar_url: null,
      updated_at: new Date().toISOString()
    }).eq('id', userId);

    const sensitiveFields = [
      'name',
      'email',
      'phone',
      'address',
      'notes',
      'description'
    ];

    for (const field of sensitiveFields) {
      await supabase.from('health_data').update({
        [field]: null
      }).eq('user_id', userId);
    }
  } catch (error) {
    console.error('Error anonymizing user data:', error);
    throw new Error('Failed to anonymize user data');
  }
}
