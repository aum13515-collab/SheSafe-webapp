import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { User, Contact, AlertLog } from '../types';
import { formatDisplayPhone } from '../utils/phoneUtils';
import { BarChart3, Users, AlertCircle, Search, Trash2, Eye } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [allAlerts, setAllAlerts] = useState<AlertLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserContacts, setSelectedUserContacts] = useState<Contact[]>([]);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = storageService.getAllUsers();
    setUsers(allUsers);
    const allAlertLogs = storageService.getAllAlertLogs();
    setAllAlerts(allAlertLogs);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Delete this user? This will also delete all their contacts and alerts.')) {
      storageService.deleteUser(id);
      loadData();
    }
  };

  const handleViewContacts = (user: User) => {
    const contacts = storageService.getContacts(user.id);
    setSelectedUser(user);
    setSelectedUserContacts(contacts);
    setShowContactsModal(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAlerts = allAlerts.length;
  const alertsToday = allAlerts.filter((a) => {
    const alertDate = new Date(a.timestamp).toDateString();
    const today = new Date().toDateString();
    return alertDate === today;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System Overview & Management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="w-12 h-12 text-pink-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-3xl font-bold text-gray-900">{totalAlerts}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerts Today</p>
                <p className="text-3xl font-bold text-gray-900">{alertsToday}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Contacts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {users.length > 0
                    ? (
                        allAlerts.reduce((sum, a) => sum + a.contactsNotified, 0) /
                        allAlerts.length
                      ).toFixed(1)
                    : '0'}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Users</h2>
              <p className="text-sm text-gray-600">{users.length} registered users</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, username, or phone..."
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Username</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Mobile</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Joined</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-gray-900">{user.name}</td>
                      <td className="py-4 px-6 text-gray-700">{user.username}</td>
                      <td className="py-4 px-6 text-gray-700">{formatDisplayPhone(user.phone)}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewContacts(user)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Contacts
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contacts Modal */}
        {showContactsModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Contacts - {selectedUser.name}
              </h2>

              {selectedUserContacts.length > 0 ? (
                <div className="space-y-2">
                  {selectedUserContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="border border-gray-200 rounded-xl p-3"
                    >
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{formatDisplayPhone(contact.phone)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No contacts</p>
              )}

              <button
                onClick={() => setShowContactsModal(false)}
                className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
