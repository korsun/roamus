import React from 'react';

declare module '*.svgr.tsx' {
  import { FC, SVGProps } from 'react';
  const Component: FC<SVGProps<SVGSVGElement> & { size?: number | string }>;
  export default Component;
}
