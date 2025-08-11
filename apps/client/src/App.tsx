import { StrictMode } from 'react';

import { Map, SidePanel } from '@/domains';

export const App = () => (
  <StrictMode>
    <Map />
    <SidePanel />
  </StrictMode>
);
