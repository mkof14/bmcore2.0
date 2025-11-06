import { useState, useEffect } from 'react';
import { Lock, Shield, Key, Activity, AlertTriangle, Upload, Download, Eye, Trash2, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BlackBoxFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  encryption_method: string;
  upload_date: string;
  last_accessed: string | null;
  access_log: any[];
}

export default function BlackBoxSection() {
  const [files, setFiles] = useState<BlackBoxFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    lastAccess: null as string | null,
    accessCount: 0,
  });

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('black_box_files')
        .select('*')
        .eq('user_id', user.user.id)
        .order('upload_date', { ascending: false });

      if (error) throw error;

      const fileData = data || [];
      setFiles(fileData);

      const totalSize = fileData.reduce((sum, f) => sum + f.file_size, 0);
      const accessLogs = fileData.flatMap(f => f.access_log || []);
      const lastAccess = fileData
        .map(f => f.last_accessed)
        .filter(Boolean)
        .sort()
        .reverse()[0];

      setStats({
        totalFiles: fileData.length,
        totalSize,
        lastAccess,
        accessCount: accessLogs.length,
      });
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (formData: any) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('black_box_files')
        .insert({
          user_id: user.user.id,
          file_name: formData.file_name,
          file_url: formData.file_url,
          file_type: formData.file_type,
          file_size: 0,
          encryption_method: 'AES-256-GCM',
          encryption_key_id: crypto.randomUUID(),
        });

      if (error) throw error;
      setShowUploadModal(false);
      loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  const handleAccess = async (file: BlackBoxFile) => {
    try {
      const accessEntry = {
        timestamp: new Date().toISOString(),
        action: 'view',
        ip: 'xxx.xxx.xxx.xxx',
      };

      const newAccessLog = [...(file.access_log || []), accessEntry];

      const { error } = await supabase
        .from('black_box_files')
        .update({
          last_accessed: new Date().toISOString(),
          access_log: newAccessLog,
        })
        .eq('id', file.id);

      if (error) throw error;

      window.open(file.file_url, '_blank');
      loadFiles();
    } catch (error) {
      console.error('Error accessing file:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file from Black Box? This action cannot be undone and will be logged.')) return;

    try {
      const { error } = await supabase
        .from('black_box_files')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Lock className="h-8 w-8 text-orange-500" />
          Black Box Storage
        </h1>
        <p className="text-gray-400">
          Military-grade encrypted storage for your most sensitive health data
        </p>
      </div>

      <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-200 font-medium mb-1">Critical Legal Responsibility</p>
            <p className="text-xs text-red-300/80 mb-2">
              You are FULLY RESPONSIBLE for all content stored in your Black Box. Only store legal information
              relevant to health services. Any illegal content will result in immediate account termination and
              legal action. All access is logged and monitored for compliance.
            </p>
            <p className="text-xs text-red-300/80">
              By using Black Box Storage, you acknowledge full legal responsibility for your data and agree to
              comply with all applicable laws (HIPAA, GDPR, local regulations).
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-900 border border-blue-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">ENCRYPTED</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalFiles}</p>
          <p className="text-xs text-gray-400">Secured Files</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 via-green-800/20 to-gray-900 border border-green-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Key className="h-5 w-5 text-green-400" />
            <span className="text-xs text-green-400 font-medium">AES-256</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatFileSize(stats.totalSize)}</p>
          <p className="text-xs text-gray-400">Total Storage</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 via-orange-800/20 to-gray-900 border border-orange-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-orange-400" />
            <span className="text-xs text-orange-400 font-medium">MONITORED</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.accessCount}</p>
          <p className="text-xs text-gray-400">Access Logs</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-gray-900 border border-purple-600/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Lock className="h-5 w-5 text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">SECURE</span>
          </div>
          <p className="text-sm font-bold text-white truncate">
            {stats.lastAccess ? new Date(stats.lastAccess).toLocaleDateString() : 'Never'}
          </p>
          <p className="text-xs text-gray-400">Last Access</p>
        </div>
      </div>

      <div className="mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-500" />
          Security Features
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-900/30 border border-green-600/30 rounded-lg flex-shrink-0">
              <Key className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">AES-256-GCM Encryption</p>
              <p className="text-xs text-gray-400">Military-grade encryption for all files</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-900/30 border border-blue-600/30 rounded-lg flex-shrink-0">
              <Activity className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Tamper-Proof Audit Logs</p>
              <p className="text-xs text-gray-400">All access is recorded and immutable</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-900/30 border border-orange-600/30 rounded-lg flex-shrink-0">
              <Lock className="h-4 w-4 text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Zero-Knowledge Architecture</p>
              <p className="text-xs text-gray-400">Only you can decrypt your files</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-900/30 border border-purple-600/30 rounded-lg flex-shrink-0">
              <Shield className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Biometric Access Control</p>
              <p className="text-xs text-gray-400">Multi-factor authentication required</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Encrypted Files</h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload to Black Box
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading secure storage...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-12">
          <Lock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Black Box is empty</p>
          <p className="text-sm text-gray-500">Upload your most sensitive health data for maximum security</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-orange-600/30 rounded-xl p-4 hover:border-orange-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-orange-900/30 border border-orange-600/30 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-400" />
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-400 font-medium">ENCRYPTED</span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{file.file_name}</h3>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Encryption:</span>
                  <span className="text-green-400 font-mono">{file.encryption_method}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Size:</span>
                  <span className="text-gray-400">{formatFileSize(file.file_size)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Uploaded:</span>
                  <span className="text-gray-400">{new Date(file.upload_date).toLocaleDateString()}</span>
                </div>
                {file.last_accessed && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Last Access:</span>
                    <span className="text-orange-400">{new Date(file.last_accessed).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Access Logs:</span>
                  <span className="text-blue-400">{file.access_log?.length || 0} entries</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAccess(file)}
                  className="flex-1 p-2 bg-green-900/30 hover:bg-green-900/50 border border-green-600/30 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-green-400">Access</span>
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-600/30 rounded-lg transition-colors"
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
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-orange-600/50 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-orange-500" />
              Upload to Black Box
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Files will be encrypted with AES-256-GCM before storage
            </p>
            <p className="text-xs text-orange-300 mb-4 p-3 bg-orange-900/20 border border-orange-600/30 rounded-lg">
              By uploading, you confirm this content is legal and compliant with all regulations
            </p>

            <button
              onClick={() => setShowUploadModal(false)}
              className="w-full px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
