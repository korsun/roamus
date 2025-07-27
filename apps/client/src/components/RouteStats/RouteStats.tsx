import cx from 'classnames';

import { RouteInfo } from '@/components';
import { ascDescToFixed, metresToKm, msToTime } from '@/helpers';
import {
  AscendSvgr,
  DescendSvgr,
  DistanceSvgr,
  TimeSvgr,
} from '@/assets/icons/index.svgr';

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
      icon={<DistanceSvgr size={32} />}
    />
    <RouteInfo
      title="Time"
      text={msToTime(time)}
      icon={<TimeSvgr size={32} />}
    />
    <RouteInfo
      title="Ascend"
      text={ascDescToFixed(ascend)}
      icon={<AscendSvgr size={32} />}
    />
    <RouteInfo
      title="Descend"
      text={ascDescToFixed(descend)}
      icon={<DescendSvgr size={32} />}
    />
  </section>
);
