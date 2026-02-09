/**
 * @file useLanguage.tsx
 *
 * @created 2026-02-09
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description Hook for managing application language with localStorage persistence
 */

import { useTranslation } from 'react-i18next';
import { invoke } from '@tauri-apps/api/core';
import { SupportedLanguage } from '@/i18n/config';

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as SupportedLanguage;

  const changeLanguage = async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
    localStorage.setItem('appLanguage', language);
    // Pass language to Rust backend
    try {
      await invoke('set_language', { language });
    } catch (error) {
      console.error('Failed to set language in Rust backend:', error);
    }
  };

  return {
    currentLanguage,
    changeLanguage,
  };
}
