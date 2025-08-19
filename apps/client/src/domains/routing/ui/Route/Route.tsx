import type { Engine } from '@common/schemas/routing';

import type { Route as TRoute } from '@/shared/services';

import { RouteStats } from '../RouteStats';

import s from './Route.module.css';

type Props = {
  name: Engine;
  engine: TRoute;
  setActiveEngines: (engine: Engine) => void;
};

export const Route = ({ name, engine, setActiveEngines }: Props) => (
  <div>
    <div className={s.checkbox}>
      <input
        type="checkbox"
        id={name}
        disabled={engine.hasLimits}
        onChange={() => setActiveEngines(name as Engine)}
        checked={engine.isActive}
      />
      <label htmlFor={name}>{name}</label>
    </div>

    <RouteStats
      distance={engine.path?.distance ?? 0}
      time={engine.path?.time ?? 0}
      ascend={engine.path?.ascend ?? 0}
      descend={engine.path?.descend ?? 0}
    />
  </div>
);
