import { useEffect, useState } from "react";

export enum BREAKPOINTS {
  // мобильные
  xsMobile = "(max-width: 639px)", // <640px
  mobile = "(max-width: 767px)", // <768px

  // планшеты
  tablet = "(min-width: 768px) and (max-width: 1023px)", // 768px–1023px

  // десктоп
  // bigDesktop = "(min-width: 1280px)",
  desktop = "(min-width: 1024px) and (max-width: 1279px)", // 1024px–1279px
  // xlDesktop = "(min-width: 1280px) and (max-width: 1535px)", // 1280px–1535px
  // xxlDesktop = "(min-width: 1536px)", // >=1536px

  // любые десктопы
  bigDesktop = "(min-width: 1279px)",
}

const useMatchBreakpoint = (breakpoint: BREAKPOINTS) => {
  const query = breakpoint;
  const getMatches = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

export default useMatchBreakpoint;
