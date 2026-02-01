/**
 * @file App.tsx
 *
 * @created 2026-02-01
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description Main application component that displays VPN connection status
 */

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { StatusCard } from './components/StatusCard';
import { ConnectionDetails } from './components/ConnectionDetails';
import { Settings } from './components/Settings';
import { TitleBar } from './components/TitleBar';
import { cn } from './lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import SettingsIconSvg from '@/assets/icons/settings.svg?react';

/**
 * Represents the Mullvad VPN connection status response
 */
interface MullvadStatus {
  connected: boolean;
  ip?: string;
  country?: string;
  city?: string;
  hostname?: string;
  server_type?: string;
}

/**
 * Main application component
 * Listens for VPN status updates from the Rust backend and displays them
 */
function App() {
  const [status, setStatus] = useState<MullvadStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'status' | 'settings'>('status');

  useEffect(() => {
    // Get initial status
    const fetchStatus = async () => {
      try {
        const result = await invoke<MullvadStatus>('get_vpn_status');
        setStatus(result);
      } catch (error) {
        console.error('Failed to fetch VPN status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Listen for status updates from the backend
    const unlisten = listen<MullvadStatus>('vpn-status-changed', (event) => {
      setStatus(event.payload);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col bg-gradient-to-br from-background via-background to-muted/20">
        <TitleBar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
            <div className="text-sm text-muted-foreground">Loading status...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Custom Title Bar */}
      <TitleBar />

      {/* Navigation Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-background/50 backdrop-blur-sm">
        {currentPage === 'settings' ? (
          <button
            onClick={() => setCurrentPage('status')}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Status
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Connection Status
            </span>
          </div>
        )}
        {currentPage === 'status' && (
          <button
            onClick={() => setCurrentPage('settings')}
            className="p-2.5 rounded-lg hover:bg-accent/50 transition-all hover:scale-105"
            aria-label="Settings"
          >
            <SettingsIconSvg className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main content area with enhanced styling */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-md space-y-4 animate-in fade-in duration-300">
          {currentPage === 'status' ? (
            <>
              <StatusCard
                connected={status?.connected ?? false}
                country={status?.country}
              />
              {status && <ConnectionDetails status={status} />}
            </>
          ) : (
            <Settings />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
