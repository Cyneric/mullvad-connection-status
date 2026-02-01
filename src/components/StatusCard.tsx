/**
 * @file StatusCard.tsx
 *
 * @created 2026-02-01
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description Main status card component showing VPN connection state
 */

import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { CountryBadge } from './CountryBadge';
import { cn } from '@/lib/utils';
import ShieldEncrypted from '@/assets/icons/shield_encrypted.svg?react';
import ShieldQuestion from '@/assets/icons/shield_question.svg?react';

interface StatusCardProps {
  connected: boolean;
  country?: string;
}

/**
 * Displays a prominent card showing whether the VPN is connected
 * Features a shield icon and color-coded badge
 *
 * @param connected - Whether the VPN is currently connected
 * @param country - The country the VPN is connected to
 */
export function StatusCard({ connected, country }: StatusCardProps) {
  return (
    <Card className={cn(
      'border-2 shadow-lg transition-all duration-300',
      connected
        ? 'border-green-500/20 bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20'
        : 'border-destructive/20 bg-gradient-to-br from-red-50/50 to-background dark:from-red-950/20'
    )}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              'p-3 rounded-2xl transition-all duration-300 relative',
              connected
                ? 'bg-green-500/10 ring-2 ring-green-500/20'
                : 'bg-destructive/10 ring-2 ring-destructive/20'
            )}>
              {connected ? (
                <ShieldEncrypted className="h-14 w-14 text-green-600 dark:text-green-400" />
              ) : (
                <ShieldQuestion className="h-14 w-14 text-destructive" />
              )}
              {connected && country && (
                <div className="absolute -bottom-2 -right-2">
                  <CountryBadge country={country} size="lg" />
                </div>
              )}
            </div>
            <div>
              <h2 className={cn(
                'text-2xl font-bold mb-1 transition-colors flex items-center gap-2',
                connected ? 'text-green-700 dark:text-green-400' : 'text-destructive'
              )}>
                {connected ? 'Connected' : 'Disconnected'}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                {connected ? (
                  <>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    {country ? `Protected via ${country}` : 'Your traffic is protected'}
                  </>
                ) : (
                  <>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive"></span>
                    No VPN connection detected
                  </>
                )}
              </p>
            </div>
          </div>
          <Badge
            variant={connected ? 'success' : 'destructive'}
            className="shadow-sm"
          >
            {connected ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
