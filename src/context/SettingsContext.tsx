import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings, Category, Announcement, ComputerService, Advertisement } from '../types';
import {
  getClientSettings,
  getClientCategories,
  getClientAnnouncements,
  getClientServices,
  getClientAds,
} from '../utils/clientStorage';

interface SettingsContextType {
  settings: SiteSettings | null;
  categories: Category[];
  announcements: Announcement[];
  services: ComputerService[];
  ads: Advertisement[];
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  refreshAnnouncements: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshServices: () => Promise<void>;
  refreshAds: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(() => getClientSettings());
  const [categories, setCategories] = useState<Category[]>(() => getClientCategories());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getClientAnnouncements());
  const [services, setServices] = useState<ComputerService[]>(() => getClientServices());
  const [ads, setAds] = useState<Advertisement[]>(() => getClientAds());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      } else {
        setSettings(getClientSettings());
      }
    } catch {
      setSettings(getClientSettings());
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        setCategories(getClientCategories());
      }
    } catch {
      setCategories(getClientCategories());
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      } else {
        setAnnouncements(getClientAnnouncements());
      }
    } catch {
      setAnnouncements(getClientAnnouncements());
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      } else {
        setServices(getClientServices());
      }
    } catch {
      setServices(getClientServices());
    }
  };

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/ads');
      if (res.ok) {
        const data = await res.json();
        setAds(data);
      } else {
        setAds(getClientAds());
      }
    } catch {
      setAds(getClientAds());
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchSettings(),
        fetchCategories(),
        fetchAnnouncements(),
        fetchServices(),
        fetchAds(),
      ]);
      setIsLoading(false);
    };
    loadAll();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        categories,
        announcements,
        services,
        ads,
        isLoading,
        refreshSettings: fetchSettings,
        refreshAnnouncements: fetchAnnouncements,
        refreshCategories: fetchCategories,
        refreshServices: fetchServices,
        refreshAds: fetchAds,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
