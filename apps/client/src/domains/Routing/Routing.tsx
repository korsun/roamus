import { Engine } from '@common/schemas/routing';

import { useStore } from '@/shared/services';
import { Error } from '@/shared/ui';

import { Route } from './ui';
import { useAlarm } from './useAlarm';
import s from './Routing.module.css';

export const Routing = () => {
  const { routes, setActiveEngines, setPath, isServerAwake } = useStore();
  useAlarm();

  return (
    <>
      <p>Click on the map to set some markers</p>
      {Object.entries(routes).map(([name, engine]) => (
        <Route
          key={name}
          name={name as Engine}
          engine={engine}
          setActiveEngines={setActiveEngines}
        />
      ))}
      {Object.values(routes).some((route) => route.path) && (
        <section className={s.section}>
          <button
            onClick={() => {
              for (const name in routes) {
                setPath(name as Engine, undefined);
              }
            }}
          >
            Clear route
          </button>
        </section>
      )}
      {isServerAwake === false && (
        <Error message="Server is sleeping. Wait a bit..." />
      )}
      <Error message={routes.graphhopper.error} />
    </>
  );
};
