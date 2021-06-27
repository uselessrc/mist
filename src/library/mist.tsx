import React, {
  Children,
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {Film, FilmData} from './@film';
import {
  useMistCursor,
  useMistId,
  useMistMask,
  useMistTargetRect,
  useThrottleCallback,
} from './hooks';
import {Track} from './track';

interface MistProps {
  /**
   * def: 24
   */
  strokeWidth?: number;
  /**
   * def: 4
   */
  blur?: number;
  children: ReactElement;
}

const BLUR_DEFAULT = 4;
const STROKE_WIDTH_DEFAULT = 24;
const THROTTLE_INTERVAL_MS = 16 * 4;

export const Mist: FC<MistProps> = ({
  blur = BLUR_DEFAULT,
  strokeWidth = STROKE_WIDTH_DEFAULT,
  children,
}) => {
  Children.only(children);

  const id = useMistId();
  const Cursor = useMistCursor(id, strokeWidth);
  const Mask = useMistMask(id);
  const rect = useMistTargetRect(id);

  const erasing = useRef(false);
  const films = useRef<[FilmData, FilmData]>();
  // const rect = useRef({
  //   width: 0,
  //   height: 0,
  //   left: 0,
  //   top: 0,
  // });

  const [href, setHref] = useState<[string, string]>(['', '']);

  const next = (track: Track): void => {
    if (!films.current) {
      return;
    }

    setHref(films.current.map(line => line.next(track)) as [string, string]);
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

    const filterElement = document.querySelector(`#${id}`) as HTMLElement;

    let targetElement = filterElement.parentNode?.nextSibling as
      | HTMLElement
      | undefined;

    if (!targetElement) {
      throw Error('[Mist]: Not found dom to bind event');
    }

    Object.assign(targetElement.style, {filter: `url(#${id})`});

    const {width, height} = targetElement.getBoundingClientRect();

    const film1 = Film({
      width,
      height,
      lineWidth: strokeWidth,
      backgroundColor: '#000',
      color: '#fff',
    });

    const film2 = Film({
      width,
      height,
      lineWidth: strokeWidth,
      backgroundColor: '#fff',
      color: '#000',
    });

    films.current = [film1, film2];

    setHref([film1.canvas.toDataURL(), film2.canvas.toDataURL()]);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <svg
        style={{
          position: 'absolute',
          top: '-99999px',
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feImage xlinkHref={href[0]} result="a1" />
          <feImage xlinkHref={href[1]} result="b1" />
          <feBlend in="SourceGraphic" in2="a1" mode="darken" result="a2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="b2" />
          <feBlend in="b1" in2="b2" mode="darken" result="b3" />
          <feBlend in="a2" in2="b3" mode="lighten" />
        </filter>
      </svg>

      {children}

      <Mask />
      <Cursor />
    </>
  );
};
