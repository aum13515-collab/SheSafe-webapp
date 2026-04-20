import React, { useState, useEffect } from 'react';
import { AlertButton } from '../components/AlertButton';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/ContactsContext';
import { storageService } from '../services/storageService';
import { espPollingService } from '../services/espPollingService';
import { DEFAULT_ESP_RETRY_INTERVAL } from '../utils/constants';
import { MapPin, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export const MainPage: React.FC = () => {
  const { user } = useAuth();
  const { triggerAlert, lastAlert, isTriggering, error } = useAlert();
  const [contacts, setContacts] = useState<number>(0);
  const [gpsReady, setGpsReady] = useState(true);
  const [espStatus, setEspStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState<string>('Never');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const updateStatus = () => {
      const userContacts = storageService.getContacts(user.id);
      setContacts(userContacts.length);

      const settings = storageService.getSettings();
      setApiKeyConfigured(!!settings.fast2smsApiKey);

      const alert = storageService.getAlertLogs(user.id)[0];
      if (alert) {
        const date = new Date(alert.timestamp);
        setLastAlertTime(date.toLocaleString());
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const startPolling = async () => {
      const connected = await espPollingService.checkESPConnection();
      setEspStatus(connected ? 'connected' : 'offline');

      if (connected) {
        espPollingService.startPolling(user.id);
      } else {
        espPollingService.startConnectionRetry(user.id, DEFAULT_ESP_RETRY_INTERVAL);
      }

      const checkInterval = setInterval(async () => {
        const isConnected = espPollingService.isConnected();
        setEspStatus(isConnected ? 'connected' : 'offline');
      }, 2000);

      return () => clearInterval(checkInterval);
    };

    startPolling();

    return () => {
      espPollingService.stopPolling();
      espPollingService.stopConnectionRetry();
    };
  }, [user]);

  const handleAlert = async () => {
    try {
      setSuccessMessage('');
      await triggerAlert();
      setSuccessMessage(`Alert sent to ${contacts} contact${contacts !== 1 ? 's' : ''}!`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      // Error is handled in AlertButton
    }
  };

  const handleTestAlert = async () => {
    try {
      setSuccessMessage('');
      if (!navigator.geolocation) {
        alert('GPS not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition((pos) => {
        const mapsLink = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
        setSuccessMessage(`Test location: ${mapsLink}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area pb-24">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl shadow-sm p-6 text-white">
          <h1 className="text-2xl font-bold">Hello, {user.name}!</h1>
          <p className="text-pink-100 mt-1">Stay safe and alert</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              {gpsReady ? (
                <span className="text-lg">🟢</span>
              ) : (
                <span className="text-lg">🔴</span>
              )}
              <span className="text-sm font-semibold text-gray-700">GPS</span>
            </div>
            <p className="text-xs text-gray-600">{gpsReady ? 'Ready' : 'Unavailable'}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              {contacts > 0 ? <span className="text-lg">🟢</span> : <span className="text-lg">🔴</span>}
              <span className="text-sm font-semibold text-gray-700">Contacts</span>
            </div>
            <p className="text-xs text-gray-600">{contacts} saved</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              {apiKeyConfigured ? (
                <span className="text-lg">🟢</span>
              ) : (
                <span className="text-lg">🔴</span>
              )}
              <span className="text-sm font-semibold text-gray-700">SMS</span>
            </div>
            <p className="text-xs text-gray-600">{apiKeyConfigured ? 'Configured' : 'Not set'}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              {espStatus === 'connected' ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">Device</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">Device</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-600">
              {espStatus === 'checking'
                ? 'Checking...'
                : espStatus === 'connected'
                ? 'Connected'
                : 'Offline'}
            </p>
          </div>
        </div>

        {/* Main SOS Button */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 flex flex-col items-center">
          <AlertButton onPress={handleAlert} isDisabled={isTriggering} contactCount={contacts} />
        </div>

        {/* Helper Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleTestAlert}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            📍 Test Location
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-700">
              <p className="font-semibold">Success!</p>
              <p className="mt-1">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-semibold">Error</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Last Alert Info */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-pink-600" />
            <h3 className="font-semibold text-gray-900">Last Alert</h3>
          </div>
          <p className="text-sm text-gray-600">{lastAlertTime}</p>
          {lastAlert && (
            <a
              href={lastAlert.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 text-sm font-semibold hover:underline mt-2 inline-block"
            >
              View Location →
            </a>
          )}
        </div>

        {/* Warnings */}
        {contacts === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-semibold">No Emergency Contacts</p>
              <p className="mt-1">Add at least one emergency contact to use SOS alerts.</p>
            </div>
          </div>
        )}

        {!apiKeyConfigured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-semibold">SMS Not Configured</p>
              <p className="mt-1">Configure Fast2SMS API key in Settings to send alerts.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
