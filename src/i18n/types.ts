/**
 * @file types.ts
 *
 * @created 2026-02-09
 * @author Christian Blank <christianblank91@gmail.com>
 *
 * @copyright 2026 Christian Blank
 *
 * @description TypeScript types for i18next translation keys
 */

import 'react-i18next';
import enTranslation from './locales/en/translation.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof enTranslation;
    };
  }
}
