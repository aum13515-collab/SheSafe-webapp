import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { smsService } from '../services/smsService';
import { AppSettings, AlertLog } from '../types';
import { validateIndianPhone, formatDisplayPhone, cleanPhone } from '../utils/phoneUtils';
import { Eye, EyeOff, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings());
  const [alerts, setAlerts] = useState<AlertLog[]>([]);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.fast2smsApiKey);
  const [espIpInput, setEspIpInput] = useState(settings.espIpAddress);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testingSms, setTestingSms] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userAlerts = storageService.getAlertLogs(user.id);
    setAlerts(userAlerts);
  }, [user]);

  const handleSaveSettings = () => {
    const updated: AppSettings = {
      ...settings,
      fast2smsApiKey: apiKeyInput,
      espIpAddress: espIpInput
    };
    storageService.saveSettings(updated);
    setSettings(updated);
    setMessage({ type: 'success', text: 'Settings saved successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleTestSMS = async () => {
    if (!user || !apiKeyInput) {
      setMessage({ type: 'error', text: 'Please configure API key first' });
      return;
    }

    setTestingSms(true);
    try {
      await smsService.sendTestSMS(`+91${user.phone}`, apiKeyInput);
      setMessage({ type: 'success', text: `Test SMS sent to ${formatDisplayPhone(user.phone)}` });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Failed to send test SMS: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setTestingSms(false);
    }
  };

  const handleClearAlerts = () => {
    if (confirm('Clear all alert history? This cannot be undone.')) {
      if (user) {
        storageService.clearAlertLogs(user.id);
        setAlerts([]);
        setMessage({ type: 'success', text: 'Alert history cleared' });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area pb-24">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Messages */}
        {message && (
          <div
            className={`rounded-xl p-4 flex gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 text-green-600`} />
            ) : (
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 text-red-600`} />
            )}
            <span
              className={`text-sm ${
                message.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {message.text}
            </span>
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
              <input
                type="text"
                value={formatDisplayPhone(user.phone)}
                disabled
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Fast2SMS Configuration */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Fast2SMS Configuration</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">📱 Setup Guide</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Go to fast2sms.com</li>
              <li>Create free account with your Indian number</li>
              <li>Go to Dev API section</li>
              <li>Copy your API key</li>
              <li>Paste here and save</li>
            </ol>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Your Fast2SMS API key"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {showApiKey ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleTestSMS}
            disabled={!apiKeyInput || testingSms}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testingSms ? 'Sending test SMS...' : 'Send Test SMS'}
          </button>
        </div>

        {/* Device Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Device Settings</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ESP8266 IP Address</label>
            <input
              type="text"
              value={espIpInput}
              onChange={(e) => setEspIpInput(e.target.value)}
              placeholder="e.g., 192.168.1.100:3000"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Default: localhost:3000 (when running on same PC)
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
            <input type="checkbox" id="polling" defaultChecked className="w-4 h-4" />
            <label htmlFor="polling" className="text-sm font-semibold text-gray-700">
              Enable device polling
            </label>
          </div>
        </div>

        {/* Alert History */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Alert History</h2>
            {alerts.length > 0 && (
              <button
                onClick={handleClearAlerts}
                className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {alerts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Contacts</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="text-xs">
                          {new Date(alert.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <a
                          href={alert.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:underline font-semibold"
                        >
                          📍 {alert.contactsNotified}
                        </a>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            alert.status === 'success'
                              ? 'bg-green-100 text-green-700'
                              : alert.status === 'partial'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No alerts yet</p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};
