import React, {FC, useCallback, useEffect, useRef, useState} from 'react';

import {useMistTargetRect, useThrottleCallback} from '../hooks';
import {Track} from '../track';
import {Film, FilmData} from '../utils';

const THROTTLE_INTERVAL_MS = 16 * 4;

export const MistFilter: FC<{
  id: string;
  blurSize: number;
  strokeWidth: number;
  scale: number;
}> = ({id, blurSize, strokeWidth, scale}) => {
  const rect = useMistTargetRect(id);

  const erasing = useRef(false);
  const films = useRef<[FilmData, FilmData]>();

  const [images, setImages] = useState<[string, string]>(['', '']);

  const next = (track: Track): void => {
    if (!films.current) {
      return;
    }

    setImages(films.current.map(line => line.next(track)) as [string, string]);
  };

  const onMouseDown = useCallback(
    ({clientX, clientY, target}: MouseEvent): void => {
      if ((target as HTMLElement).dataset.mask !== id) {
        return;
      }

      next([clientX - rect.left, clientY - rect.top, 1]);

      erasing.current = true;
    },
    [id, rect],
  );

  const onMouseUp = (): boolean => (erasing.current = false);

  const onMouseMove = useThrottleCallback(
    ({clientX, clientY}: MouseEvent) => {
      if (!erasing.current) {
        return;
      }

      next([clientX - rect.left, clientY - rect.top, 0]);
    },
    THROTTLE_INTERVAL_MS,
    [rect],
  );

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    const {width, height} = rect;

    films.current = [
      Film({
        width,
        height,
        lineWidth: strokeWidth,
        backgroundColor: '#000',
        color: '#fff',
        scale,
      }),
      Film({
        width,
        height,
        lineWidth: strokeWidth,
        backgroundColor: '#fff',
        color: '#000',
        scale,
      }),
    ];

    setImages(
      films.current.map(film => film.canvas.toDataURL()) as [string, string],
    );

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect]);

  return (
    <svg
      style={{
        position: 'absolute',
        top: '-99999px',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feImage xlinkHref={images[0]} result="a1" />
        <feImage xlinkHref={images[1]} result="b1" />
        <feBlend in="SourceGraphic" in2="a1" mode="darken" result="a2" />
        <feGaussianBlur
          in="SourceGraphic"
          stdDeviation={blurSize}
          result="b2"
        />
        <feBlend in="b1" in2="b2" mode="darken" result="b3" />
        <feBlend in="a2" in2="b3" mode="lighten" />
      </filter>
    </svg>
  );
};
