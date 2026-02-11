type UnsubscribeFn = () => void;

const listeners = new Set<UnsubscribeFn>();

export const registerListener = (unsubscribe: UnsubscribeFn) => {
  listeners.add(unsubscribe);
  return () => {
    listeners.delete(unsubscribe);
  };
};

export const clearAllListeners = () => {
  listeners.forEach((unsubscribe) => {
    try {
      unsubscribe();
    } catch {
      // ignore
    }
  });
  listeners.clear();
};
