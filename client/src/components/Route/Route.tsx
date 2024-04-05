import { Engine } from '@common/types';

import { Route as TRoute } from '@/hooks/useStore';

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
      <label>{name}</label>
    </div>

    <RouteStats
      distance={engine.path?.distance ?? 0}
      time={engine.path?.time ?? 0}
      ascend={engine.path?.ascend ?? 0}
      descend={engine.path?.descend ?? 0}
    />
  </div>
);
