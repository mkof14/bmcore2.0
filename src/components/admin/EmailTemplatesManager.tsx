import { useState, useEffect } from 'react';
import { Mail, Plus, Edit2, Trash2, Send, Eye, Search, Filter, Download, Upload, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { EMAIL_TEMPLATES, seedEmailTemplates } from '../../lib/emailTemplates';
import { createEmailProvider, renderTemplate, htmlToPlainText } from '../../lib/emailProvider';

interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  subject_en: string;
  subject_ru: string | null;
  body_en: string;
  body_ru: string | null;
  variable_schema: Array<{ key: string; type: string; required: boolean }>;
  status: 'draft' | 'active' | 'archived';
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface EmailLog {
  id: string;
  template_id: string | null;
  recipient_email: string;
  subject: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: 'welcome', label: 'Welcome' },
  { value: 'payment_success', label: 'Payment Success' },
  { value: 'payment_failed', label: 'Payment Failed' },
  { value: 'password_reset', label: 'Password Reset' },
  { value: 'billing_invoice', label: 'Billing Invoice' },
  { value: 'subscription_update', label: 'Subscription Update' },
  { value: 'general', label: 'General' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'notification', label: 'Notification' },
];

export default function EmailTemplatesManager() {
  const [activeTab, setActiveTab] = useState<'templates' | 'logs'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'general',
    subject_en: '',
    body_en: '',
    variables: '',
    status: 'draft',
    description: '',
  });
  const [sendFormData, setSendFormData] = useState({
    recipientEmail: '',
    customSubject: '',
    customBody: '',
  });

  useEffect(() => {
    loadTemplates();
    loadLogs();
  }, []);

  const handleSeedTemplates = async () => {
    if (!confirm('This will add/update all 38 default email templates. Continue?')) return;

    try {
      setLoading(true);
      const results = await seedEmailTemplates(supabase);
      const successCount = results.filter(r => r.success).length;
      alert(`Successfully seeded ${successCount}/${results.length} templates!`);
      loadTemplates();
    } catch (error) {
      console.error('Error seeding templates:', error);
      alert('Failed to seed templates');
    } finally {
      setLoading(false);
    }
  };

  const handleExportTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*');

      if (error) throw error;

      const exportData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        templates: data,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-templates-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting templates:', error);
      alert('Failed to export templates');
    }
  };

  const handleImportTemplates = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.templates || !Array.isArray(importData.templates)) {
        throw new Error('Invalid template file format');
      }

      const { error } = await supabase
        .from('email_templates')
        .upsert(importData.templates, { onConflict: 'slug' });

      if (error) throw error;

      alert(`Successfully imported ${importData.templates.length} templates!`);
      loadTemplates();
    } catch (error) {
      console.error('Error importing templates:', error);
      alert('Failed to import templates');
    }

    // Reset file input
    event.target.value = '';
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('email_sends')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const openCreateModal = () => {
    setSelectedTemplate(null);
    setFormData({
      name: '',
      slug: '',
      category: 'general',
      subject_en: '',
      body_en: '',
      variables: '',
      status: 'draft',
      description: '',
    });
    setShowTemplateModal(true);
  };

  const openEditModal = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    const variableKeys = template.variable_schema?.map(v => v.key).join(', ') || '';
    setFormData({
      name: template.name,
      slug: template.slug,
      category: template.category,
      subject_en: template.subject_en,
      body_en: template.body_en,
      variables: variableKeys,
      status: template.status,
      description: template.description || '',
    });
    setShowTemplateModal(true);
  };

  const openSendModal = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setSendFormData({
      recipientEmail: '',
      customSubject: template.subject_en,
      customBody: template.body_en,
    });
    setShowSendModal(true);
  };

  const handleSaveTemplate = async () => {
    try {
      const variablesArray = formData.variables
        .split(',')
        .map(v => v.trim())
        .filter(v => v);

      const variableSchema = variablesArray.map(key => ({
        key,
        type: 'string',
        required: true
      }));

      const templateData = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        subject_en: formData.subject_en,
        subject_ru: null,
        body_en: formData.body_en,
        body_ru: null,
        variable_schema: variableSchema,
        status: formData.status,
        description: formData.description || null,
      };

      if (selectedTemplate) {
        const { error } = await supabase
          .from('email_templates')
          .update(templateData)
          .eq('id', selectedTemplate.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('email_templates')
          .insert(templateData);

        if (error) throw error;
      }

      setShowTemplateModal(false);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate || !sendFormData.recipientEmail) {
      alert('Please provide recipient email');
      return;
    }

    try {
      const emailProvider = createEmailProvider();

      // Send the email using the configured provider
      const result = await emailProvider.send({
        to: sendFormData.recipientEmail,
        subject: sendFormData.customSubject,
        html: sendFormData.customBody,
        text: htmlToPlainText(sendFormData.customBody),
      });

      // Log the send attempt
      const { error: logError } = await supabase
        .from('email_sends')
        .insert({
          template_id: selectedTemplate.id,
          recipient_email: sendFormData.recipientEmail,
          subject: sendFormData.customSubject,
          body_html: sendFormData.customBody,
          body_text: htmlToPlainText(sendFormData.customBody),
          variables_used: {},
          send_type: 'test',
          status: result.success ? 'sent' : 'failed',
          provider: emailProvider.name,
          provider_message_id: result.messageId,
          sent_at: result.success ? new Date().toISOString() : null,
          error_message: result.error || null,
        });

      if (logError) console.error('Error logging email:', logError);

      if (result.success) {
        alert(`Email sent successfully via ${emailProvider.name}!`);
        setShowSendModal(false);
        loadLogs();
      } else {
        alert(`Failed to send email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Mail className="h-8 w-8 text-orange-500" />
          Email Templates
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleSeedTemplates}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-300 flex items-center gap-2"
            title="Seed 38 default templates"
          >
            <RefreshCw className="h-5 w-5" />
            Seed Templates
          </button>
          <button
            onClick={handleExportTemplates}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Export
          </button>
          <label className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 cursor-pointer">
            <Upload className="h-5 w-5" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportTemplates}
              className="hidden"
            />
          </label>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Template
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-4 border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'logs'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Email Logs
        </button>
      </div>

      {activeTab === 'templates' && (
        <div>
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-12">Loading templates...</div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No templates found</div>
          ) : (
            <div className="grid gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          template.status === 'active'
                            ? 'bg-green-900/30 border border-green-600/30 text-green-400'
                            : template.status === 'draft'
                            ? 'bg-yellow-900/30 border border-yellow-600/30 text-yellow-400'
                            : 'bg-gray-800/50 border border-gray-700/30 text-gray-400'
                        }`}>
                          {template.status}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-900/30 border border-orange-600/30 text-orange-400">
                          {CATEGORIES.find(c => c.value === template.category)?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{template.slug}</p>
                      {template.description && (
                        <p className="text-sm text-gray-500">{template.description}</p>
                      )}
                      <div className="mt-3">
                        <p className="text-sm text-gray-400">
                          <span className="font-medium">Subject:</span> {template.subject_en}
                        </p>
                        {template.variable_schema && template.variable_schema.length > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Variables:</span> {template.variable_schema.map(v => v.key).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openSendModal(template)}
                        className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(template)}
                        className="p-2 text-orange-400 hover:bg-orange-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      No email logs found
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 text-sm text-white">{log.recipient_email}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{log.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          log.status === 'sent'
                            ? 'bg-green-900/30 border border-green-600/30 text-green-400'
                            : log.status === 'failed'
                            ? 'bg-red-900/30 border border-red-600/30 text-red-400'
                            : 'bg-yellow-900/30 border border-yellow-600/30 text-yellow-400'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {log.sent_at ? new Date(log.sent_at).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {selectedTemplate ? 'Edit Template' : 'Create Template'}
              </h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Template Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject_en}
                    onChange={(e) => setFormData({ ...formData, subject_en: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Body (HTML)</label>
                  <textarea
                    value={formData.body_en}
                    onChange={(e) => setFormData({ ...formData, body_en: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="<!DOCTYPE html><html><body>...</body></html>"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Variables (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.variables}
                    onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                    placeholder="user_name, user_email, amount"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveTemplate}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all"
                >
                  Save Template
                </button>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSendModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Send Email</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={sendFormData.recipientEmail}
                    onChange={(e) => setSendFormData({ ...sendFormData, recipientEmail: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    value={sendFormData.customSubject}
                    onChange={(e) => setSendFormData({ ...sendFormData, customSubject: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Body</label>
                  <textarea
                    value={sendFormData.customBody}
                    onChange={(e) => setSendFormData({ ...sendFormData, customBody: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                  <p className="text-sm text-blue-400">
                    Available variables: {selectedTemplate.variable_schema?.map(v => v.key).join(', ') || 'none'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSendEmail}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all flex items-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Email
                </button>
                <button
                  onClick={() => setShowSendModal(false)}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
