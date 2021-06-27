import React, {FC} from 'react';
import {createPortal} from 'react-dom';

import {useMistTargetRect} from '../hooks';

export const Mask: FC<{id: string}> = ({id}) => {
  const {width, height, left, top} = useMistTargetRect(id);

  return createPortal(
    <div
      data-mask={id}
      style={{
        position: 'fixed',
        cursor: 'none',
        userSelect: 'none',
        zIndex: 99,
        width,
        height,
        left,
        top,
      }}
    />,
    document.body,
  );
};
