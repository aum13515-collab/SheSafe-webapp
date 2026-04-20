import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AlertContextType, AlertLog } from '../types';
import { alertService } from '../services/alertService';
import { useAuth } from './AuthContext';

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isTriggering, setIsTriggering] = useState(false);
  const [lastAlert, setLastAlert] = useState<AlertLog | null>(() => {
    return user ? alertService.getLastAlert(user.id) : null;
  });
  const [error, setError] = useState<string | null>(null);

  const triggerAlert = useCallback(async () => {
    if (!user) {
      setError('User not logged in');
      return;
    }

    setIsTriggering(true);
    setError(null);

    try {
      await alertService.triggerAlert(user.id);
      const updated = alertService.getLastAlert(user.id);
      setLastAlert(updated || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger alert');
      throw err;
    } finally {
      setIsTriggering(false);
    }
  }, [user]);

  const getAlertHistory = useCallback((): AlertLog[] => {
    return user ? alertService.getAlertHistory(user.id) : [];
  }, [user]);

  const clearAlertHistory = useCallback(() => {
    if (user) {
      alertService.clearAlertHistory(user.id);
      setLastAlert(null);
    }
  }, [user]);

  const value: AlertContextType = {
    isTriggering,
    lastAlert,
    triggerAlert,
    getAlertHistory,
    clearAlertHistory,
    error
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
