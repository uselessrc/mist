export type Track = [x: number, y: number, start: number];

export interface TrackerOptions {
  width: number;
  height: number;
  color: string;
  backgroundColor: string;
  lineWidth: number;
  scale: number;
  tracks?: Track[];
}

export interface TrackerData {
  canvas: HTMLCanvasElement;
  next(track: Track): string;
}

export function Tracker({
  tracks = [],
  width,
  height,
  backgroundColor,
  color,
  lineWidth,
  scale,
}: TrackerOptions): TrackerData {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d')!;

  width /= scale;
  height /= scale;
  lineWidth /= scale;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  ctx.lineCap = 'round';
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;

  tracks.forEach(track => next(track, ctx));

  ctx.stroke();

  return {
    canvas,
    next(track: Track) {
      next(track);
      return canvas.toDataURL();
    },
  };

  function next([x, y, start]: Track, ctx = canvas.getContext('2d')!): void {
    x /= scale;
    y /= scale;

    if (start) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }
}
