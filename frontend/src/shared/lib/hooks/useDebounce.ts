import { useRef, useCallback, useEffect } from "react";

function useDebounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  const timeoutRef = useRef<number | null>(null);
  const fnRef = useRef(fn);

  // всегда держим в рефе актуальную функцию
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // стабильная debounced функция (не меняется пока не сменится delay)
  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        fnRef.current(...(args as any));
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedFn;
}

export default useDebounce;
