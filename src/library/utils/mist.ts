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
