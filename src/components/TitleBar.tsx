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
export function TitleBar({
  title = 'Mullvad Status',
  showControls = true,
  className,
}: TitleBarProps) {
  const appWindow = getCurrentWindow();

  const handleMinimize = async () => {
    await appWindow.minimize();
  };

  const handleClose = async () => {
    await appWindow.hide();
  };

  const handleDragStart = async (e: React.MouseEvent) => {
    // Only start dragging on left mouse button
    if (e.button === 0) {
      await appWindow.startDragging();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between h-12 px-4 bg-gradient-to-r from-[#294d73] to-[#1a3a56] text-white',
        'select-none',
        className
      )}
    >
      <div className="flex items-center gap-2 flex-1 cursor-move" onMouseDown={handleDragStart}>
        <span className="font-medium text-sm">{title}</span>
      </div>

      {showControls && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleMinimize}
            className="p-2 hover:bg-white/10 rounded transition-colors cursor-pointer"
            aria-label="Minimize"
            type="button"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-red-500/80 rounded transition-colors cursor-pointer"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
