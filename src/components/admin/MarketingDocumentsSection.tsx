import { useState, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, Eye, X, FolderOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MarketingDocument {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  category: string;
  tags: string[];
  uploaded_at: string;
  download_count: number;
  is_public: boolean;
}

export default function MarketingDocumentsSection() {
  const [documents, setDocuments] = useState<MarketingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file_url: '',
    file_name: '',
    file_type: 'pdf',
    file_size: 0,
    category: 'brochure',
    tags: '',
    is_public: false,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.file_url) {
      alert('Title and file URL are required');
      return;
    }

    setUploading(true);
    try {
      const tagsArray = uploadForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const { error } = await supabase
        .from('marketing_documents')
        .insert({
          title: uploadForm.title,
          description: uploadForm.description,
          file_url: uploadForm.file_url,
          file_name: uploadForm.file_name || uploadForm.title,
          file_type: uploadForm.file_type,
          file_size: uploadForm.file_size,
          category: uploadForm.category,
          tags: tagsArray,
          is_public: uploadForm.is_public,
        });

      if (error) throw error;

      setShowUploadModal(false);
      setUploadForm({
        title: '',
        description: '',
        file_url: '',
        file_name: '',
        file_type: 'pdf',
        file_size: 0,
        category: 'brochure',
        tags: '',
        is_public: false,
      });
      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await supabase
        .from('marketing_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const incrementDownloadCount = async (doc: MarketingDocument) => {
    try {
      const { error } = await supabase
        .from('marketing_documents')
        .update({ download_count: doc.download_count + 1 })
        .eq('id', doc.id);

      if (error) throw error;
      window.open(doc.file_url, '_blank');
      loadDocuments();
    } catch (error) {
      console.error('Error updating download count:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    return <FileText className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      brochure: 'bg-blue-900/30 border-blue-600/30 text-blue-400',
      presentation: 'bg-purple-900/30 border-purple-600/30 text-purple-400',
      whitepaper: 'bg-green-900/30 border-green-600/30 text-green-400',
      case_study: 'bg-orange-900/30 border-orange-600/30 text-orange-400',
      template: 'bg-pink-900/30 border-pink-600/30 text-pink-400',
      other: 'bg-gray-900/30 border-gray-600/30 text-gray-400',
    };
    return colors[category] || colors.other;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-orange-500" />
          Marketing Documents
        </h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center gap-2"
        >
          <Upload className="h-5 w-5" />
          Upload Document
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading documents...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-900/30 border border-orange-600/30 rounded-lg">
                  {getFileTypeIcon(doc.file_type)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => incrementDownloadCount(doc)}
                    className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {doc.title}
              </h3>

              {doc.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {doc.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(doc.category)}`}>
                  {doc.category.replace('_', ' ')}
                </span>
                {doc.is_public && (
                  <span className="px-2 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Public
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatFileSize(doc.file_size)}</span>
                <span>{doc.download_count} downloads</span>
              </div>

              {doc.tags.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-700/30 text-gray-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {documents.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FolderOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No documents uploaded yet</p>
            </div>
          )}
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Upload Document</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Document title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">File URL</label>
                  <input
                    type="text"
                    value={uploadForm.file_url}
                    onChange={(e) => setUploadForm({ ...uploadForm, file_url: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="brochure">Brochure</option>
                      <option value="presentation">Presentation</option>
                      <option value="whitepaper">Whitepaper</option>
                      <option value="case_study">Case Study</option>
                      <option value="template">Template</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">File Type</label>
                    <select
                      value={uploadForm.file_type}
                      onChange={(e) => setUploadForm({ ...uploadForm, file_type: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="pdf">PDF</option>
                      <option value="doc">Word Document</option>
                      <option value="ppt">Presentation</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="marketing, sales, 2024"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadForm.is_public}
                      onChange={(e) => setUploadForm({ ...uploadForm, is_public: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                  <span className="text-sm text-gray-300">Make this document public</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
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
