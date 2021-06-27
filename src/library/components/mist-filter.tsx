import React, {FC, useCallback, useEffect, useRef, useState} from 'react';

import {useMistTargetRect, useThrottleCallback} from '../hooks';
import {Track, Tracker, TrackerData, checkAllWhite} from '../utils';

const THROTTLE_INTERVAL_MS = 16 * 4;

const IMAGE_BACKGROUND_WHITE = '#FFF';
const IMAGE_BACKGROUND_BLACK = '#000';

export const MistFilter: FC<{
  id: string;
  blurSize: number;
  strokeWidth: number;
  scale: number;
  onEnded(): void;
}> = ({id, blurSize, strokeWidth, scale, onEnded}) => {
  const rect = useMistTargetRect(id);

  const erasing = useRef(false);
  const trackers = useRef<[TrackerData, TrackerData]>();

  const [images, setImages] = useState<[string, string]>(['', '']);

  const next = (track: Track): void => {
    if (!trackers.current) {
      return;
    }

    setImages(
      trackers.current.map(line => line.next(track)) as [string, string],
    );
  };

  const onMouseDown = useCallback(
    ({clientX, clientY, target}: MouseEvent): void => {
      // hack
      if ((target as HTMLElement).dataset.mask !== id) {
        return;
      }

      next([clientX - rect.left, clientY - rect.top, 1]);

      erasing.current = true;
    },
    [id, rect],
  );

  const onMouseUp = (): void => {
    erasing.current = false;

    if (trackers.current && checkAllWhite(trackers.current[0].canvas)) {
      onEnded();
    }
  };

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

    trackers.current = [
      Tracker({
        width,
        height,
        lineWidth: strokeWidth,
        color: IMAGE_BACKGROUND_WHITE,
        backgroundColor: IMAGE_BACKGROUND_BLACK,
        scale,
      }),
      Tracker({
        width,
        height,
        lineWidth: strokeWidth,
        color: IMAGE_BACKGROUND_BLACK,
        backgroundColor: IMAGE_BACKGROUND_WHITE,
        scale,
      }),
    ];

    setImages(
      trackers.current.map(tracker => tracker.canvas.toDataURL()) as [
        string,
        string,
      ],
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
