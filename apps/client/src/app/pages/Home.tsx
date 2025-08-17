import { Map, Routing } from '@/domains';
import { SidePanel } from '@/shared/ui';

export const Home = () => {
  return (
    <>
      <Map />
      <SidePanel>
        <Routing />
      </SidePanel>
    </>
  );
};
