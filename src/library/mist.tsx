import React, {Children, FC, ReactElement, useEffect, useState} from 'react';

import {Cursor, Mask, MistFilter} from './components';
import {useMistId} from './hooks';
import {requireMistTargetElement} from './utils';

export interface MistProps {
  /**
   * def: 24
   */
  strokeWidth?: number;
  /**
   * def: 4
   */
  blurSize?: number;
  /**
   * def: 20
   */
  canvasScale?: number;
  children: ReactElement;
}

const BLUR_DEFAULT = 4;
const SCALE_DEFAULT = 20;
const STROKE_WIDTH_DEFAULT = 24;

export const Mist: FC<MistProps> = ({
  blurSize = BLUR_DEFAULT,
  strokeWidth = STROKE_WIDTH_DEFAULT,
  canvasScale = SCALE_DEFAULT,
  children,
}) => {
  Children.only(children);

  const [ended, setEnded] = useState(false);
  const id = useMistId();

  useEffect(() => {
    Object.assign(requireMistTargetElement(id).style, {
      filter: `url(#${id})`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (ended) {
    return <>{children}</>;
  }

  return (
    <>
      <MistFilter
        id={id}
        blurSize={blurSize}
        strokeWidth={strokeWidth}
        scale={canvasScale}
        onEnded={() => setEnded(true)}
      />
      {children}
      <Mask id={id} />
      <Cursor id={id} size={strokeWidth} />
    </>
  );
};
