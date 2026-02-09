/// <reference types="vite/client" />

// SVG imports with ?react suffix
declare module '*.svg?react' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

// Regular SVG imports
declare module '*.svg' {
  const content: string;
  export default content;
}

// CSS modules
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
