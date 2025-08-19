import cx from 'classnames';
import { useState } from 'react';

import s from './SidePanel.module.css';

export const SidePanel = ({ children }: React.PropsWithChildren) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        {children}
      </div>

      <button className={s.collapseButton} onClick={handleClick} type="button">
        {isCollapsed ? '>' : '<'}
      </button>
    </div>
  );
};
