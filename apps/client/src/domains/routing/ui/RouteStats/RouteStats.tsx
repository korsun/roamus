import cx from 'classnames';

import { ascDescToFixed, metresToKm, msToTime } from '@/shared';

import Ascend from '../../assets/ascend.svg?react';
import Descend from '../../assets/descend.svg?react';
import Distance from '../../assets/distance.svg?react';
import Time from '../../assets/time.svg?react';
import { RouteInfo } from '../RouteInfo';

import s from './RouteStats.module.css';

type Props = {
  distance: number;
  time: number;
  ascend: number;
  descend: number;
};

export const RouteStats = ({ distance, time, ascend, descend }: Props) => (
  <section className={cx(s.section, s.icons)}>
    <RouteInfo
      title="Distance"
      text={metresToKm(distance)}
      icon={<Distance width={32} height={32} />}
    />
    <RouteInfo
      title="Time"
      text={msToTime(time)}
      icon={<Time width={32} height={32} />}
    />
    <RouteInfo
      title="Ascend"
      text={ascDescToFixed(ascend)}
      icon={<Ascend width={32} height={32} />}
    />
    <RouteInfo
      title="Descend"
      text={ascDescToFixed(descend)}
      icon={<Descend width={32} height={32} />}
    />
  </section>
);
