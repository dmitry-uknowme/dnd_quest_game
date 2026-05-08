import { useState, useEffect, useRef, useCallback } from "react";
import smoothScrollTo from "../utils/smoothScrollTo";

const useSection = (threshold = 0.8) => {
  // const [allSections, setAllSections] = useState<HTMLElement[]>([]);
  const allSectionsRef = useRef<HTMLElement[]>([]);
  const [currentSection, setCurrentSection] = useState<{
    index: number;
    el: HTMLElement;
    name: string;
  }>();

  const currentSectionRef = useRef(currentSection);

  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  useEffect(() => {
    allSectionsRef.current = Array.from(document.querySelectorAll(".section"));
    const allSections = allSectionsRef.current;
    const observer: IntersectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.map(({ target, isIntersecting }) => {
          if (isIntersecting && target instanceof HTMLElement) {
            const targetIndex = allSections.indexOf(target);
            setCurrentSection({
              index: targetIndex,
              el: target,
              name: target.dataset.section!,
            });
          }
        });
      },
      { threshold }
    );
    allSections.map((section) => observer.observe(section));
  }, []);

  const scrollNextSection = useCallback(() => {
    const allSections = allSectionsRef.current;
    const section = currentSectionRef.current;
    if (!section || section.index + 1 >= allSections.length) return;

    const nextSection = allSections[section.index + 1];
    const nextTop = nextSection.getBoundingClientRect().top + window.scrollY;

    smoothScrollTo(nextTop, 500, () => {
      setCurrentSection({
        index: section.index + 1,
        el: nextSection,
        name: nextSection.dataset.section!,
      });
    });
  }, []);

  const scrollPrevSection = useCallback(() => {
    const allSections = allSectionsRef.current;
    const section = currentSectionRef.current;
    if (!section || section.index - 1 < 0) return;

    const prevSection = allSections[section.index - 1];
    const prevTop = prevSection.getBoundingClientRect().top + window.scrollY;

    smoothScrollTo(prevTop, 500, () => {
      setCurrentSection({
        index: section.index - 1,
        el: prevSection,
        name: prevSection.dataset.section!,
      });
    });
  }, []);

  return {
    allSections: allSectionsRef.current,
    currentSection,
    scrollNextSection,
    scrollPrevSection,
  };
};
export default useSection;

// const useSection = (threshold = 0.8) => {
//   const [allSections, setAllSections] = useState<HTMLElement[]>([]);
//   const [currentSection, setCurrentSection] = useState<{
//     index: number;
//     el: HTMLElement;
//     name: string;
//   }>();

//   const currentSectionRef = useRef(currentSection);

//   useEffect(() => {
//     currentSectionRef.current = currentSection;
//   }, [currentSection]);

//   useEffect(() => {
//     const allSections = Array.from(document.querySelectorAll(".section"));
//     setAllSections(allSections);
//     console.log(allSections);
//     const observer: IntersectionObserver = new IntersectionObserver(
//       (entries, observer) => {
//         entries.map(({ target, isIntersecting }) => {
//           if (isIntersecting && target instanceof HTMLElement) {
//             const targetIndex = allSections.indexOf(target);
//             setCurrentSection({
//               index: targetIndex,
//               el: target,
//               name: target.dataset.section!,
//             });
//           }
//         });
//       },
//       { threshold }
//     );
//     allSections.map((section) => observer.observe(section));
//   }, []);

//   const scrollNextSection = () => {
//     // const section = currentSectionRef.current;
//     // if (!section || section.index + 1 >= allSections.length) return;

//     const section = currentSection;
//     if (!section || section.index + 1 >= allSections.length) return;

//     const nextSection = allSections[section.index + 1];
//     const nextTop = nextSection.getBoundingClientRect().top + window.scrollY;

//     smoothScrollTo(nextTop, 500, () => {
//       setCurrentSection({
//         index: section.index + 1,
//         el: nextSection,
//         name: nextSection.dataset.section!,
//       });
//     });
//   };

//   const scrollPrevSection = () => {
//     // const section = currentSectionRef.current;
//     // if (!section || section.index - 1 < 0) return;

//     const section = currentSection;
//     if (!section || section.index - 1 < 0) return;

//     const prevSection = allSections[section.index - 1];
//     const prevTop = prevSection.getBoundingClientRect().top + window.scrollY;

//     smoothScrollTo(prevTop, 500, () => {
//       setCurrentSection({
//         index: section.index - 1,
//         el: prevSection,
//         name: prevSection.dataset.section!,
//       });
//     });
//   };

//   return { allSections, currentSection, scrollNextSection, scrollPrevSection };
// };

// export default useSection;
