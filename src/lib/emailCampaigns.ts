import { supabase } from './supabase';

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduled_for?: string;
  sent_count?: number;
  open_rate?: number;
  click_rate?: number;
}

export async function createCampaign(campaign: Partial<Campaign>) {
  const { data, error } = await supabase
    .from('email_campaigns')
    .insert(campaign)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCampaigns() {
  const { data, error } = await supabase
    .from('email_campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function sendCampaign(campaignId: string, recipients: string[]) {
  const { data: campaign } = await supabase
    .from('email_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (!campaign) throw new Error('Campaign not found');

  for (const email of recipients) {
    await supabase.from('email_logs').insert({
      campaign_id: campaignId,
      recipient: email,
      status: 'sent',
      sent_at: new Date().toISOString(),
    });
  }

  await supabase
    .from('email_campaigns')
    .update({ status: 'sent', sent_count: recipients.length })
    .eq('id', campaignId);

  return true;
}
