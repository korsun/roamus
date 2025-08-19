import type { Engine } from '@common/schemas/routing';

import { useStore } from '@/shared/services';
import { Error } from '@/shared/ui';
import s from './Routing.module.css';
import { Route } from './ui';
import { useAlarm } from './useAlarm';

export const Routing = () => {
  const {
    routes,
    setActiveEngines,
    setPath,
    isServerAwake,
    setGraphhopperLimits,
  } = useStore();
  useAlarm();
  const handleClearRoute = () => {
    for (const name in routes) {
      setPath(name as Engine, undefined);
    }
    setGraphhopperLimits(false);
  };

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
          <button type="button" onClick={handleClearRoute}>
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
