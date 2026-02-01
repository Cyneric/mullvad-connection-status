/**
 * @file flags.ts
 *
 * @created 2026-02-01
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description Utility functions for converting country names to flag emojis
 */

/**
 * Maps country names to their ISO 3166-1 alpha-2 codes
 * Includes common Mullvad VPN server locations
 */
const COUNTRY_CODES: Record<string, string> = {
  // Europe
  Austria: 'AT',
  Belgium: 'BE',
  Bulgaria: 'BG',
  Croatia: 'HR',
  Cyprus: 'CY',
  'Czech Republic': 'CZ',
  Czechia: 'CZ',
  Denmark: 'DK',
  Estonia: 'EE',
  Finland: 'FI',
  France: 'FR',
  Germany: 'DE',
  Greece: 'GR',
  Hungary: 'HU',
  Ireland: 'IE',
  Italy: 'IT',
  Latvia: 'LV',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Malta: 'MT',
  Netherlands: 'NL',
  Poland: 'PL',
  Portugal: 'PT',
  Romania: 'RO',
  Slovakia: 'SK',
  Slovenia: 'SI',
  Spain: 'ES',
  Sweden: 'SE',
  'United Kingdom': 'GB',
  UK: 'GB',

  // Americas
  Canada: 'CA',
  'United States': 'US',
  USA: 'US',
  Brazil: 'BR',
  Mexico: 'MX',
  Argentina: 'AR',
  Chile: 'CL',

  // Asia Pacific
  Australia: 'AU',
  'New Zealand': 'NZ',
  Japan: 'JP',
  Singapore: 'SG',
  'Hong Kong': 'HK',
  'South Korea': 'KR',
  India: 'IN',
  Taiwan: 'TW',

  // Other
  Switzerland: 'CH',
  Norway: 'NO',
  Iceland: 'IS',
  Israel: 'IL',
  'South Africa': 'ZA',
  UAE: 'AE',
  'United Arab Emirates': 'AE',
};

/**
 * Converts a country name to its flag emoji
 * Note: Windows may not render flag emojis properly, use getCountryCode() for reliable display
 *
 * @param countryName - The name of the country
 * @returns The flag emoji for the country, or an empty string if not found
 *
 * @example
 * getCountryFlag('Germany') // Returns: 🇩🇪 (may not render on Windows)
 * getCountryFlag('United States') // Returns: 🇺🇸 (may not render on Windows)
 */
export function getCountryFlag(countryName: string | undefined): string {
  if (!countryName) return '';

  const code = COUNTRY_CODES[countryName];
  if (!code) return '';

  // Convert ISO code to flag emoji
  // Each letter is converted to its regional indicator symbol
  const codePoints = [...code].map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

/**
 * Gets a color for the country flag badge based on region
 *
 * @param countryCode - The ISO country code
 * @returns Tailwind color classes for the badge
 */
export function getCountryColor(countryCode: string | undefined): string {
  if (!countryCode) return 'bg-blue-500';

  // Europe - Blue
  if (
    [
      'AT',
      'BE',
      'BG',
      'HR',
      'CY',
      'CZ',
      'DK',
      'EE',
      'FI',
      'FR',
      'DE',
      'GR',
      'HU',
      'IE',
      'IT',
      'LV',
      'LT',
      'LU',
      'MT',
      'NL',
      'PL',
      'PT',
      'RO',
      'SK',
      'SI',
      'ES',
      'SE',
      'GB',
      'CH',
      'NO',
      'IS',
    ].includes(countryCode)
  ) {
    return 'bg-blue-500';
  }
  // Americas - Green
  if (['CA', 'US', 'BR', 'MX', 'AR', 'CL'].includes(countryCode)) {
    return 'bg-green-500';
  }
  // Asia Pacific - Purple
  if (['AU', 'NZ', 'JP', 'SG', 'HK', 'KR', 'IN', 'TW'].includes(countryCode)) {
    return 'bg-purple-500';
  }
  // Other - Orange
  return 'bg-orange-500';
}

/**
 * Gets the country code for a country name
 *
 * @param countryName - The name of the country
 * @returns The ISO 3166-1 alpha-2 code, or undefined if not found
 */
export function getCountryCode(countryName: string | undefined): string | undefined {
  if (!countryName) return undefined;
  return COUNTRY_CODES[countryName];
}
