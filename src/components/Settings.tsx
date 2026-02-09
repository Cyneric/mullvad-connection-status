/**
 * @file Settings.tsx
 *
 * @created 2026-02-01
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description Settings panel for application preferences
 */

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useLanguage } from '@/hooks/useLanguage';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, SupportedLanguage } from '@/i18n/config';
import * as CountryFlags from 'country-flag-icons/react/3x2';

// Map language codes to country codes for flags
const LANGUAGE_FLAG_MAP: Record<SupportedLanguage, string> = {
  en: 'US', // United States flag for English
  de: 'DE', // Germany
  es: 'ES', // Spain
  fr: 'FR', // France
};

/**
 * Settings component with application configuration options
 * Currently includes auto-start toggle for Windows
 */
export function Settings() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [autoStartEnabled, setAutoStartEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark, toggleDarkMode } = useDarkMode();

  // Get the flag component for the current language
  const FlagComponent = (CountryFlags as any)[LANGUAGE_FLAG_MAP[currentLanguage]];

  // Check current auto-start status on mount
  useEffect(() => {
    checkAutoStartStatus();
  }, []);

  /**
   * Fetches the current auto-start setting from the system
   */
  const checkAutoStartStatus = async () => {
    try {
      const enabled = await invoke<boolean>('check_autostart');
      setAutoStartEnabled(enabled);
    } catch (error) {
      console.error('Failed to check auto-start status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles the auto-start setting when user clicks the switch
   */
  const handleToggleAutoStart = async (checked: boolean) => {
    try {
      await invoke<string>('toggle_autostart', { enable: checked });
      setAutoStartEnabled(checked);
    } catch (error) {
      console.error('Failed to toggle auto-start:', error);
      // Revert the UI state if the operation failed
      setAutoStartEnabled(!checked);
    }
  };

  return (
    <Card className="shadow-md border-muted/40">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          {t('settings.title')}
        </CardTitle>
        <CardDescription>{t('settings.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language Selector */}
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
          <div className="space-y-1 flex-1">
            <label htmlFor="language" className="text-sm font-semibold cursor-pointer block">
              {t('settings.language')}
            </label>
            <p className="text-xs text-muted-foreground">{t('settings.languageDescription')}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {FlagComponent && (
              <FlagComponent className="h-5 w-7 rounded shadow-sm border border-muted/20" />
            )}
            <select
              id="language"
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_NAMES[lang]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Auto Start */}
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
          <div className="space-y-1 flex-1">
            <label htmlFor="auto-start" className="text-sm font-semibold cursor-pointer block">
              {t('settings.autoStart')}
            </label>
            <p className="text-xs text-muted-foreground">{t('settings.autoStartDescription')}</p>
          </div>
          <Switch
            id="auto-start"
            checked={autoStartEnabled}
            onCheckedChange={handleToggleAutoStart}
            disabled={isLoading}
            className="ml-4"
          />
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
          <div className="space-y-1 flex-1">
            <label htmlFor="dark-mode" className="text-sm font-semibold cursor-pointer block">
              {t('settings.darkMode')}
            </label>
            <p className="text-xs text-muted-foreground">{t('settings.darkModeDescription')}</p>
          </div>
          <Switch
            id="dark-mode"
            checked={isDark}
            onCheckedChange={toggleDarkMode}
            className="ml-4"
          />
        </div>
      </CardContent>
    </Card>
  );
}
