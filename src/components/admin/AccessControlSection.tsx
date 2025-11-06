import { useState, useEffect } from 'react';
import { Shield, Users, Plus, Edit2, Trash2, UserPlus, UserMinus, Key, Lock, Search, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system: boolean;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  profiles?: {
    id: string;
  };
  roles?: Role;
}

interface Profile {
  id: string;
  email?: string;
  name?: string;
  privacy_flags?: {
    is_admin?: boolean;
  };
  created_at: string;
  last_sign_in_at?: string;
  roles?: string[];
}

const PERMISSION_CATEGORIES = {
  'Content Management': [
    { key: 'content.view', label: 'View Content', description: 'View all content (blog, news, jobs)' },
    { key: 'content.create', label: 'Create Content', description: 'Create new content items' },
    { key: 'content.edit', label: 'Edit Content', description: 'Edit existing content' },
    { key: 'content.delete', label: 'Delete Content', description: 'Delete content items' },
    { key: 'content.publish', label: 'Publish Content', description: 'Publish or unpublish content' },
  ],
  'User Management': [
    { key: 'users.view', label: 'View Users', description: 'View user list and profiles' },
    { key: 'users.create', label: 'Create Users', description: 'Create new user accounts' },
    { key: 'users.edit', label: 'Edit Users', description: 'Edit user profiles and settings' },
    { key: 'users.delete', label: 'Delete Users', description: 'Delete user accounts' },
    { key: 'users.manage_roles', label: 'Manage User Roles', description: 'Assign/revoke user roles' },
  ],
  'System Administration': [
    { key: 'system.settings', label: 'System Settings', description: 'Configure system settings' },
    { key: 'system.analytics', label: 'View Analytics', description: 'Access analytics dashboard' },
    { key: 'system.roles', label: 'Manage Roles', description: 'Create and manage roles' },
    { key: 'system.permissions', label: 'Manage Permissions', description: 'Manage permission assignments' },
    { key: 'system.logs', label: 'View Logs', description: 'View system logs and audit trails' },
  ],
  'Email & Communications': [
    { key: 'emails.templates', label: 'Email Templates', description: 'Manage email templates' },
    { key: 'emails.send', label: 'Send Emails', description: 'Send emails to users' },
    { key: 'emails.campaigns', label: 'Email Campaigns', description: 'Create and manage email campaigns' },
  ],
  'Marketing & Documents': [
    { key: 'marketing.documents', label: 'Marketing Documents', description: 'Manage marketing materials' },
    { key: 'marketing.upload', label: 'Upload Documents', description: 'Upload new marketing materials' },
  ],
};

export default function AccessControlSection() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'permissions'>('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([loadRoles(), loadUserRoles(), loadUsers()]);
    setLoading(false);
  };

  const loadRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const loadUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*, profiles(id), roles(*)')
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error loading user roles:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, first_name, last_name, is_admin, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers = (data || []).map(user => ({
        id: user.id,
        email: user.email || '',
        name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unknown',
        privacy_flags: { is_admin: user.is_admin },
        created_at: user.created_at,
        roles: user.role ? [user.role] : [],
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const getRoleUserCount = (roleId: string) => {
    return userRoles.filter(ur => ur.role_id === roleId).length;
  };

  const getUserRoles = (userId: string) => {
    return userRoles.filter(ur => ur.user_id === userId);
  };

  const openCreateRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', description: '', permissions: [] });
    setShowRoleModal(true);
  };

  const openEditRole = (role: Role) => {
    if (role.is_system) {
      alert('System roles cannot be edited');
      return;
    }
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setShowRoleModal(true);
  };

  const handleSaveRole = async () => {
    if (!roleForm.name) {
      alert('Role name is required');
      return;
    }

    try {
      const roleData = {
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissions,
      };

      if (editingRole) {
        const { error } = await supabase
          .from('roles')
          .update(roleData)
          .eq('id', editingRole.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('roles')
          .insert(roleData);

        if (error) throw error;
      }

      setShowRoleModal(false);
      loadRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role');
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.is_system) {
      alert('System roles cannot be deleted');
      return;
    }

    if (!confirm(`Delete role "${role.name}"? Users with this role will lose their permissions.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', role.id);

      if (error) throw error;
      loadRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role');
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      if (!currentUser.user) {
        alert('You must be logged in to assign roles');
        return;
      }

      console.log('=== Role Assignment Debug ===');
      console.log('Current User ID:', currentUser.user.id);
      console.log('Target User ID:', userId);
      console.log('Role ID:', roleId);

      // Check if current user is admin by querying their profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', currentUser.user.id)
        .single();

      console.log('Profile check:', profile);

      if (profileError) {
        console.error('Error checking profile:', profileError);
        alert('Failed to verify admin status. Please try again.');
        return;
      }

      if (!profile?.is_admin) {
        alert('Permission denied: You must be an admin or super_admin to assign roles.');
        return;
      }

      console.log('Admin check passed (is_admin = true), inserting role assignment...');

      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId,
          assigned_by: currentUser.user.id,
        })
        .select();

      if (error) {
        console.error('Error details:', error);
        console.error('Error code:', error.code);
        console.error('Error hint:', error.hint);
        console.error('Error details:', error.details);

        if (error.code === '23505') {
          alert('User already has this role');
        } else if (error.code === '42501') {
          alert('Permission denied. You must be an admin to assign roles.');
        } else if (error.message && error.message.includes('infinite recursion')) {
          alert('System error: Infinite recursion detected. Please contact administrator.');
        } else {
          alert(`Failed to assign role: ${error.message}`);
        }
      } else {
        console.log('Role assigned successfully:', data);
        await loadUserRoles();
        setShowAssignModal(false);
        alert('Role assigned successfully!');
      }
    } catch (error: any) {
      console.error('Error assigning role:', error);
      alert(`Failed to assign role: ${error.message || 'Unknown error'}`);
    }
  };

  const handleRevokeRole = async (userRoleId: string) => {
    if (!confirm('Revoke this role assignment?')) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', userRoleId);

      if (error) throw error;
      loadUserRoles();
    } catch (error) {
      console.error('Error revoking role:', error);
      alert('Failed to revoke role');
    }
  };

  const togglePermission = (permission: string) => {
    if (roleForm.permissions.includes(permission)) {
      setRoleForm({
        ...roleForm,
        permissions: roleForm.permissions.filter(p => p !== permission),
      });
    } else {
      setRoleForm({
        ...roleForm,
        permissions: [...roleForm.permissions, permission],
      });
    }
  };

  const toggleAllInCategory = (categoryPerms: typeof PERMISSION_CATEGORIES[keyof typeof PERMISSION_CATEGORIES]) => {
    const categoryKeys = categoryPerms.map(p => p.key);
    const allSelected = categoryKeys.every(key => roleForm.permissions.includes(key));

    if (allSelected) {
      setRoleForm({
        ...roleForm,
        permissions: roleForm.permissions.filter(p => !categoryKeys.includes(p)),
      });
    } else {
      const newPerms = [...new Set([...roleForm.permissions, ...categoryKeys])];
      setRoleForm({ ...roleForm, permissions: newPerms });
    }
  };

  const getAllPermissions = () => {
    return Object.values(PERMISSION_CATEGORIES).flat();
  };

  const filteredUsers = users.filter(user =>
    user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="h-8 w-8 text-orange-500" />
          Access Control
        </h1>
        <div className="flex gap-2">
          {activeTab === 'roles' && (
            <button
              onClick={openCreateRole}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Role
            </button>
          )}
          {activeTab === 'users' && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Assign Role
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex gap-4 border-b border-gray-700/50 overflow-x-auto">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-3 font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Key className="h-4 w-4" />
          Roles & Permissions
          <span className="px-2 py-0.5 bg-gray-700 rounded-full text-xs">{roles.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'users'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          User Assignments
          <span className="px-2 py-0.5 bg-gray-700 rounded-full text-xs">{userRoles.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-6 py-3 font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'permissions'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Lock className="h-4 w-4" />
          Permission Matrix
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : activeTab === 'roles' ? (
        <div className="grid gap-4">
          {roles.map(role => (
            <div
              key={role.id}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-900/30 border border-orange-600/30 rounded-lg">
                      <Shield className="h-5 w-5 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{role.name}</h3>
                    {role.is_system && (
                      <span className="px-2 py-1 bg-blue-900/30 border border-blue-600/30 text-blue-400 text-xs font-medium rounded-full">
                        System Role
                      </span>
                    )}
                    <span className="px-2 py-1 bg-orange-900/30 border border-orange-600/30 text-orange-400 text-xs font-medium rounded-full flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {getRoleUserCount(role.id)} {getRoleUserCount(role.id) === 1 ? 'user' : 'users'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.includes('*') ? (
                      <span className="px-3 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs rounded-full font-medium">
                        ★ All Permissions
                      </span>
                    ) : (
                      role.permissions.map(perm => {
                        const permInfo = getAllPermissions().find(p => p.key === perm);
                        return (
                          <span
                            key={perm}
                            className="px-3 py-1 bg-gray-700/50 border border-gray-600/30 text-gray-300 text-xs rounded-full"
                            title={permInfo?.description}
                          >
                            {permInfo?.label || perm}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
                {!role.is_system && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditRole(role)}
                      className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit Role"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role)}
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete Role"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'users' ? (
        <div>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by email, name, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl mb-2">No users found</p>
              <p className="text-sm">
                {searchQuery ? 'Try adjusting your search criteria' : 'No users are registered yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map(user => {
              const userRolesList = getUserRoles(user.id);
              return (
                <div
                  key={user.id}
                  className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-900/30 border border-blue-600/30 rounded-lg">
                          <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-white">
                            {user.email || user.name || 'Unknown User'}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono">{user.id}</p>
                        </div>
                        {user.privacy_flags?.is_admin && (
                          <span className="px-2 py-1 bg-orange-900/30 border border-orange-600/30 text-orange-400 text-xs font-medium rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                        {user.last_sign_in_at && (
                          <span>• Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="space-y-3">
                        {userRolesList.length > 0 && (
                          <div className="space-y-2">
                            {userRolesList.map(ur => (
                              <div
                                key={ur.id}
                                className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-orange-400" />
                                  <span className="text-sm font-medium text-white">{ur.roles?.name}</span>
                                  <span className="text-xs text-gray-500">
                                    • Assigned {new Date(ur.assigned_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleRevokeRole(ur.id)}
                                  className="p-1 text-red-400 hover:bg-red-900/30 rounded transition-colors"
                                  title="Revoke Role"
                                >
                                  <UserMinus className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignRole(user.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">+ Assign role...</option>
                            {roles
                              .filter(role => !userRolesList.some(ur => ur.role_id === role.id))
                              .map(role => (
                                <option key={role.id} value={role.id}>
                                  {role.name} {role.is_system ? '(System)' : ''}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => (
            <div
              key={category}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-orange-400" />
                {category}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {perms.map(perm => (
                  <div
                    key={perm.key}
                    className="p-4 bg-gray-800/50 border border-gray-700/30 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <Key className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white mb-1">{perm.label}</p>
                        <p className="text-xs text-gray-400">{perm.description}</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{perm.key}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-900 pb-4">
                <h2 className="text-2xl font-bold text-white">
                  {editingRole ? 'Edit Role' : 'Create Role'}
                </h2>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role Name</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Content Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe this role's purpose"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-400">Permissions</label>
                    <span className="text-xs text-gray-500">
                      {roleForm.permissions.length} of {getAllPermissions().length} selected
                    </span>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => {
                      const categoryKeys = perms.map(p => p.key);
                      const allSelected = categoryKeys.every(key => roleForm.permissions.includes(key));
                      const someSelected = categoryKeys.some(key => roleForm.permissions.includes(key));

                      return (
                        <div key={category} className="border border-gray-700/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-white flex items-center gap-2">
                              <Lock className="h-4 w-4 text-orange-400" />
                              {category}
                            </h4>
                            <button
                              onClick={() => toggleAllInCategory(perms)}
                              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                                allSelected
                                  ? 'bg-orange-900/30 border border-orange-600/30 text-orange-400'
                                  : someSelected
                                  ? 'bg-blue-900/30 border border-blue-600/30 text-blue-400'
                                  : 'bg-gray-700/30 border border-gray-600/30 text-gray-400'
                              }`}
                            >
                              {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>

                          <div className="space-y-2">
                            {perms.map(perm => (
                              <label
                                key={perm.key}
                                className="flex items-start gap-3 p-3 bg-gray-800/30 border border-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={roleForm.permissions.includes(perm.key)}
                                  onChange={() => togglePermission(perm.key)}
                                  className="mt-1 h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white">{perm.label}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{perm.description}</p>
                                  <p className="text-xs text-gray-500 font-mono mt-1">{perm.key}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 sticky bottom-0 bg-gray-900 pt-4">
                <button
                  onClick={handleSaveRole}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all"
                >
                  {editingRole ? 'Update Role' : 'Create Role'}
                </button>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <UserPlus className="h-6 w-6 text-orange-400" />
                  Assign Role to User
                </h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Select User</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Choose a user...</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.id}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Select Role
                    {selectedUserId && (
                      <span className="ml-2 text-xs text-gray-500">
                        (Click a role to assign)
                      </span>
                    )}
                  </label>

                  {(() => {
                    const systemRoles = roles.filter(r => r.is_system);
                    const customRoles = roles.filter(r => !r.is_system);

                    return (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {systemRoles.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              System Roles
                            </h4>
                            <div className="space-y-2">
                              {systemRoles.map(role => (
                                <button
                                  key={role.id}
                                  onClick={() => {
                                    if (selectedUserId) {
                                      handleAssignRole(selectedUserId, role.id);
                                    } else {
                                      alert('Please select a user first');
                                    }
                                  }}
                                  disabled={!selectedUserId}
                                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                                    selectedUserId
                                      ? 'bg-gray-800/50 border-gray-700/30 hover:bg-gray-800 hover:border-orange-500/50 cursor-pointer'
                                      : 'bg-gray-800/20 border-gray-700/20 opacity-50 cursor-not-allowed'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${
                                      role.name === 'super_admin' ? 'bg-purple-900/30 border border-purple-600/30' :
                                      role.name === 'admin' ? 'bg-orange-900/30 border border-orange-600/30' :
                                      'bg-blue-900/30 border border-blue-600/30'
                                    }`}>
                                      <Shield className={`h-5 w-5 ${
                                        role.name === 'super_admin' ? 'text-purple-400' :
                                        role.name === 'admin' ? 'text-orange-400' :
                                        'text-blue-400'
                                      }`} />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-white">{role.name}</span>
                                        {role.name === 'super_admin' && (
                                          <span className="px-2 py-0.5 bg-purple-900/30 border border-purple-600/30 text-purple-400 text-xs font-medium rounded-full">
                                            ★ FULL ACCESS
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-400">{role.description}</p>
                                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <Users className="h-3 w-3" />
                                        {getRoleUserCount(role.id)} {getRoleUserCount(role.id) === 1 ? 'user' : 'users'}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {customRoles.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Custom Roles
                            </h4>
                            <div className="space-y-2">
                              {customRoles.map(role => (
                                <button
                                  key={role.id}
                                  onClick={() => {
                                    if (selectedUserId) {
                                      handleAssignRole(selectedUserId, role.id);
                                    } else {
                                      alert('Please select a user first');
                                    }
                                  }}
                                  disabled={!selectedUserId}
                                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                                    selectedUserId
                                      ? 'bg-gray-800/50 border-gray-700/30 hover:bg-gray-800 hover:border-orange-500/50 cursor-pointer'
                                      : 'bg-gray-800/20 border-gray-700/20 opacity-50 cursor-not-allowed'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-900/30 border border-green-600/30 rounded-lg">
                                      <Shield className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-white">{role.name}</span>
                                      </div>
                                      <p className="text-sm text-gray-400">{role.description}</p>
                                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <Users className="h-3 w-3" />
                                        {getRoleUserCount(role.id)} {getRoleUserCount(role.id) === 1 ? 'user' : 'users'}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <button
                onClick={() => setShowAssignModal(false)}
                className="w-full mt-6 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
