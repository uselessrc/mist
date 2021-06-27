import {useEffect, useState} from 'react';

import {requireMistTargetElement} from '../utils';

const RECT_DEFAULT = {
  width: 0,
  height: 0,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  x: 0,
  y: 0,
} as DOMRect;

export const useMistTargetRect = (id: string): DOMRect => {
  const [rect, setRect] = useState<DOMRect>(RECT_DEFAULT);

  useEffect(() => {
    let targetElement = requireMistTargetElement(id);
    setRect(targetElement.getBoundingClientRect().toJSON());
  }, [id]);

  return rect;
};
