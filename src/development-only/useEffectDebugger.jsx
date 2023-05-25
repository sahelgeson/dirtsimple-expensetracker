import { useEffect } from 'react';
import { usePrevious } from 'helpers/usePrevious.js';

/*
  Used to debug which dependency is triggering a useEffect

  How to use:
  replace the useEffect with this:

  useEffectDebugger(() => {
    // useEffect code here...
  }, [dep1, dep2], ['dep1', 'dep2'])

  and add
  import { useEffectDebugger } from 'src/development-only/useEffectDebugger';

*/

export const useEffectDebugger = (
  effectHook,
  dependencies,
  dependencyNames = [],
) => {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency,
        },
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log('[use-effect-debugger] ', changedDeps);
  }

  useEffect(effectHook, dependencies);
};
