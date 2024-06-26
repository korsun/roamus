import { useState } from 'react';
import cx from 'classnames';
import { Engine } from '@common/types';

import { useStore } from '@/hooks';
import { Error, Route } from '@/components';

import s from './SidePanel.module.css';

export const SidePanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { routes, setActiveEngines, setPath } = useStore();

  const handleClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cx(s.container, {
        [s.collapsed]: isCollapsed,
      })}
    >
      <div
        className={cx(s.panel, {
          [s.collapsedPanel]: isCollapsed,
        })}
      >
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

        <Error message={routes.graphhopper.error} />
      </div>

      <button className={s.collapseButton} onClick={handleClick}>
        {isCollapsed ? '>' : '<'}
      </button>
    </div>
  );
};
