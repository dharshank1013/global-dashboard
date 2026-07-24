import { create } from 'zustand';
import { type University } from '../types';

export type Language = 'en' | 'de' | 'fr' | 'es';

interface AppState {
  selectedUniversity: University | null;
  setSelectedUniversity: (uni: University | null) => void;
  hoveredUniversity: University | null;
  setHoveredUniversity: (uni: University | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedUniversity: null,
  setSelectedUniversity: (uni) => set({ selectedUniversity: uni }),
  hoveredUniversity: null,
  setHoveredUniversity: (uni) => set({ hoveredUniversity: uni }),
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  isSettingsOpen: false,
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
}));
