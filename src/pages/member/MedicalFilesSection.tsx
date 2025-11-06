import { useState, useEffect } from 'react';
import { FileText, Upload, Download, Share2, Printer, Copy, Trash2, Eye, Filter, Search, FileImage, FileVideo, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MedicalFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  category: string;
  upload_date: string;
  tags: string[];
  ocr_extracted_text: string | null;
}

const CATEGORIES = ['Lab Results', 'X-Ray', 'MRI', 'CT Scan', 'Prescription', 'Report', 'Other'];
const FILE_TYPES = ['pdf', 'image', 'document', 'video', 'dicom'];

export default function MedicalFilesSection() {
  const [files, setFiles] = useState<MedicalFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadForm, setUploadForm] = useState({
    file_name: '',
    file_url: '',
    file_type: 'pdf',
    category: 'Lab Results',
    tags: '',
  });

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('medical_files')
        .select('*')
        .eq('user_id', user.user.id)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file_name || !uploadForm.file_url) {
      alert('File name and URL are required');
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const tagsArray = uploadForm.tags.split(',').map(t => t.trim()).filter(t => t);

      const { error } = await supabase
        .from('medical_files')
        .insert({
          user_id: user.user.id,
          file_name: uploadForm.file_name,
          file_url: uploadForm.file_url,
          file_type: uploadForm.file_type,
          file_size: 0,
          category: uploadForm.category,
          tags: tagsArray,
        });

      if (error) throw error;

      setShowUploadModal(false);
      setUploadForm({
        file_name: '',
        file_url: '',
        file_type: 'pdf',
        category: 'Lab Results',
        tags: '',
      });
      loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('medical_files')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  const handleCopy = (file: MedicalFile) => {
    navigator.clipboard.writeText(file.file_url);
    alert('File URL copied to clipboard');
  };

  const handleShare = (file: MedicalFile) => {
    alert(`Share functionality: In production, this would generate a secure share link for "${file.file_name}"`);
  };

  const handlePrint = (file: MedicalFile) => {
    window.open(file.file_url, '_blank');
  };

  const handleDownload = (file: MedicalFile) => {
    window.open(file.file_url, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <FileImage className="h-5 w-5" />;
      case 'video': return <FileVideo className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FileText className="h-8 w-8 text-orange-500" />
          Medical Files & Documents
        </h1>
        <p className="text-gray-400">
          Store and manage your medical records, test results, and health documents securely
        </p>
      </div>

      <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-200 font-medium mb-1">Important Legal Notice</p>
            <p className="text-xs text-yellow-300/80">
              Only store legal medical documents relevant to health services. You are fully responsible for the content
              of your files and any legal consequences related to storing personal health information. Ensure compliance
              with local regulations (HIPAA, GDPR, etc.).
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files by name or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all flex items-center gap-2"
          >
            <Upload className="h-5 w-5" />
            Upload File
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading files...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No medical files uploaded yet</p>
          <p className="text-sm text-gray-500">Upload your lab results, scans, and medical documents to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-4 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-orange-900/30 border border-orange-600/30 rounded-lg">
                  {getFileIcon(file.file_type)}
                </div>
                <span className="px-2 py-1 bg-blue-900/30 border border-blue-600/30 text-blue-400 text-xs rounded-full">
                  {file.category}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{file.file_name}</h3>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <span>{formatFileSize(file.file_size)}</span>
                <span>•</span>
                <span>{new Date(file.upload_date).toLocaleDateString()}</span>
              </div>

              {file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {file.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-700/30 text-gray-400 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDownload(file)}
                  className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
                  title="Download"
                >
                  <Download className="h-4 w-4 text-blue-400" />
                </button>
                <button
                  onClick={() => handleShare(file)}
                  className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
                  title="Share"
                >
                  <Share2 className="h-4 w-4 text-green-400" />
                </button>
                <button
                  onClick={() => handlePrint(file)}
                  className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
                  title="Print"
                >
                  <Printer className="h-4 w-4 text-purple-400" />
                </button>
                <button
                  onClick={() => handleCopy(file)}
                  className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
                  title="Copy URL"
                >
                  <Copy className="h-4 w-4 text-yellow-400" />
                </button>
                <button
                  onClick={() => window.open(file.file_url, '_blank')}
                  className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
                  title="View"
                >
                  <Eye className="h-4 w-4 text-orange-400" />
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 bg-gray-800/50 hover:bg-red-900/30 rounded-lg transition-colors flex items-center justify-center"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Upload Medical File</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">File Name</label>
                <input
                  type="text"
                  value={uploadForm.file_name}
                  onChange={(e) => setUploadForm({ ...uploadForm, file_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Blood Test Results - Jan 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">File URL</label>
                <input
                  type="text"
                  value={uploadForm.file_url}
                  onChange={(e) => setUploadForm({ ...uploadForm, file_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/file.pdf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">File Type</label>
                <select
                  value={uploadForm.file_type}
                  onChange={(e) => setUploadForm({ ...uploadForm, file_type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {FILE_TYPES.map(type => (
                    <option key={type} value={type}>{type.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="blood, cholesterol, 2024"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpload}
                className="flex-1 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all"
              >
                Upload
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
      )}
    </div>
  );
}
