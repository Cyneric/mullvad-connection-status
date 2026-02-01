/**
 * @file TitleBar.tsx
 *
 * @created 2026-02-01
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description Custom title bar with window controls and drag functionality
 */

import { getCurrentWindow } from '@tauri-apps/api/window';
import { X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TitleBarProps {
  title?: string;
  showControls?: boolean;
  className?: string;
}

/**
 * Custom title bar component that replaces native window decorations
 * Includes drag region and window control buttons
 */
export function TitleBar({ title = 'Mullvad Status', showControls = true, className }: TitleBarProps) {
  const appWindow = getCurrentWindow();

  const handleMinimize = async () => {
    await appWindow.minimize();
  };

  const handleClose = async () => {
    await appWindow.hide();
  };

  return (
    <div
      data-tauri-drag-region
      className={cn(
        'flex items-center justify-between h-12 px-4 bg-gradient-to-r from-[#294d73] to-[#1a3a56] text-white',
        'cursor-move select-none',
        className
      )}
    >
      <div data-tauri-drag-region className="flex items-center gap-2 flex-1">
        <div className="w-2 h-2 rounded-full bg-white/60"></div>
        <span className="font-medium text-sm">{title}</span>
      </div>

      {showControls && (
        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={handleMinimize}
            className="p-2 hover:bg-white/10 rounded transition-colors cursor-pointer"
            aria-label="Minimize"
            type="button"
          >
            <Minus className="h-4 w-4 pointer-events-none" />
          </button>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-red-500/80 rounded transition-colors cursor-pointer"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4 pointer-events-none" />
          </button>
        </div>
      )}
    </div>
  );
}
