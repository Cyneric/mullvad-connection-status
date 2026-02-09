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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useDarkMode } from '@/hooks/useDarkMode';

/**
 * Settings component with application configuration options
 * Currently includes auto-start toggle for Windows
 */
export function Settings() {
  const [autoStartEnabled, setAutoStartEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark, toggleDarkMode } = useDarkMode();

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
          Settings
        </CardTitle>
        <CardDescription>Configure application preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
          <div className="space-y-1 flex-1">
            <label htmlFor="auto-start" className="text-sm font-semibold cursor-pointer block">
              Start on Boot
            </label>
            <p className="text-xs text-muted-foreground">
              Launch the app automatically when Windows starts
            </p>
          </div>
          <Switch
            id="auto-start"
            checked={autoStartEnabled}
            onCheckedChange={handleToggleAutoStart}
            disabled={isLoading}
            className="ml-4"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
          <div className="space-y-1 flex-1">
            <label htmlFor="dark-mode" className="text-sm font-semibold cursor-pointer block">
              Dark Mode
            </label>
            <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
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
