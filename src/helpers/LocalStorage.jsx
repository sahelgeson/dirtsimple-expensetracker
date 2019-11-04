export const loadState = () => {
  try { 
    const serializedState = localStorage.getItem('stateDebug');
    if (serializedState === null) {
      return undefined; /* undefined is used so redux will hydrate with default values if none already present */
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('stateDebug', serializedState);
  } catch (err) {}
}