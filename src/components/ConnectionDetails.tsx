/**
 * @file ConnectionDetails.tsx
 *
 * @created 2026-02-01
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description Component displaying detailed VPN connection information
 */

import { Globe, MapPin, Server, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CountryBadge } from './CountryBadge';

interface MullvadStatus {
  connected: boolean;
  ip?: string;
  country?: string;
  city?: string;
  hostname?: string;
  server_type?: string;
}

interface ConnectionDetailsProps {
  status: MullvadStatus;
}

/**
 * Displays detailed information about the current VPN connection
 * Shows IP address, location, server hostname, and connection type
 *
 * @param status - The current VPN status including connection details
 */
export function ConnectionDetails({ status }: ConnectionDetailsProps) {
  if (!status.connected) {
    return null;
  }

  const locationText =
    status.city && status.country
      ? `${status.city}, ${status.country}`
      : status.country || 'Unknown';

  const details = [
    {
      icon: Globe,
      label: 'IP Address',
      value: status.ip || 'Unknown',
      badge: null,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: locationText,
      badge: status.country ? <CountryBadge country={status.country} size="sm" /> : null,
    },
    {
      icon: Server,
      label: 'Server',
      value: status.hostname || 'Unknown',
      badge: null,
    },
    {
      icon: Network,
      label: 'Protocol',
      value: status.server_type?.toUpperCase() || 'Unknown',
      badge: null,
    },
  ];

  return (
    <Card className="shadow-md border-muted/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Connection Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="p-2 rounded-md bg-primary/5">
              <detail.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {detail.label}
              </p>
              <div className="flex items-center gap-2">
                {detail.badge}
                <p className="text-sm font-medium truncate">{detail.value}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
