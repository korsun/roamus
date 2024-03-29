import { useState } from 'react';
import cx from 'classnames';

import { useStore } from '@/hooks';
import { ascDescToFixed, metresToKm, msToTime } from '@/helpers';
import {
  AscendSvgr,
  DescendSvgr,
  DistanceSvgr,
  TimeSvgr,
} from '@/assets/icons/index.svgr';
import { EngineSelect, Error, RouteInfo } from '@/components';

import s from './SidePanel.module.css';

export const SidePanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    distance,
    time,
    ascend,
    descend,
    error,
    engine,
    limits,
    setEngine,
    setRoute,
  } = useStore();

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
        <section className={s.section}>
          <EngineSelect engine={engine} setEngine={setEngine} limits={limits} />
        </section>
        <section className={cx(s.section, s.icons)}>
          <RouteInfo
            title='Distance'
            text={metresToKm(distance)}
            icon={<DistanceSvgr size={32} />}
          />
          <RouteInfo
            title='Time'
            text={msToTime(time)}
            icon={<TimeSvgr size={32} />}
          />
          <RouteInfo
            title='Ascend'
            text={ascDescToFixed(ascend)}
            icon={<AscendSvgr size={32} />}
          />
          <RouteInfo
            title='Descend'
            text={ascDescToFixed(descend)}
            icon={<DescendSvgr size={32} />}
          />
        </section>

        {Boolean(distance) && (
          <section className={s.section}>
            <button
              onClick={() =>
                setRoute({ distance: 0, time: 0, ascend: 0, descend: 0 })
              }
            >
              Clear route
            </button>
          </section>
        )}

        <Error message={error} />
      </div>
      <button className={s.collapseButton} onClick={handleClick}>
        {isCollapsed ? '>' : '<'}
      </button>
    </div>
  );
};
