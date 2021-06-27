export const requireMistTargetElement = (id: string): HTMLElement => {
  let filterElement = document.querySelector(`#${id}`) as HTMLElement;

  let targetElement = filterElement.parentNode?.nextSibling as
    | HTMLElement
    | undefined;

  if (!targetElement) {
    throw Error('[Mist]: Not found target node');
  }

  return targetElement;
};

export function checkAllWhite(
  canvas: HTMLCanvasElement,
  proportion = 95,
): boolean {
  const ctx = canvas.getContext('2d')!;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let total = imageData.data.length / 4;
  let white = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i] !== 255) {
      continue;
    }

    white++;
  }

  return (white / total) * 100 > proportion;
}
