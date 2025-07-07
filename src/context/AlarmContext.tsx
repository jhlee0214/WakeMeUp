import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlarmSettings } from '../types/transport';

interface AlarmContextType {
  activeAlarm: AlarmSettings | null;
  setActiveAlarm: (alarm: AlarmSettings | null) => void;
  clearActiveAlarm: () => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
};

interface AlarmProviderProps {
  children: ReactNode;
}

export const AlarmProvider: React.FC<AlarmProviderProps> = ({ children }) => {
  const [activeAlarm, setActiveAlarm] = useState<AlarmSettings | null>(null);

  const clearActiveAlarm = () => {
    setActiveAlarm(null);
  };

  return (
    <AlarmContext.Provider value={{ activeAlarm, setActiveAlarm, clearActiveAlarm }}>
      {children}
    </AlarmContext.Provider>
  );
}; 