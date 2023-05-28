import { useEffect, useRef } from 'react';
/* Variation of
 * https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * this version is more flexible and allows for the useEffectDebugger function found here
 * https://stackoverflow.com/a/59843241
 */
export const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
