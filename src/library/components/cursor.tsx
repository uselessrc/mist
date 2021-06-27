import React, {FC, useCallback, useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';

export const Cursor: FC<{id: string; size: number}> = ({id, size}) => {
  const cursorRef = useRef<HTMLElement>();

  const onMouseMove = useCallback(
    ({clientX, clientY, target}: MouseEvent) => {
      let mask = target as HTMLElement;
      let cursor = cursorRef.current;

      if (mask.dataset.mask !== id || !cursor) {
        return;
      }

      let offset = size / 2;

      translate(cursor, [clientX - offset, clientY - offset]);
    },
    [id, size],
  );

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);

    cursorRef.current = document.querySelector(
      `[data-cursor=${id}]`,
    ) as HTMLElement;

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      data-cursor={id}
      style={{
        position: 'fixed',
        borderRadius: '50%',
        zIndex: 100,
        left: 0,
        top: 0,
        width: size,
        height: size,
        pointerEvents: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        transform: 'translate(-100vw, -100vh)',
      }}
    />,
    document.body,
  );
};

function translate(element: HTMLElement, [x, y]: [number, number]): void {
  Object.assign(element.style, {
    transform: `translate(${x}px, ${y}px)`,
  });
}
