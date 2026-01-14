import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 1. Create a media query list
    const media = window.matchMedia(query);
    
    // 2. Update state if the query matches initially
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // 3. Create a listener for when the viewport changes
    const listener = () => setMatches(media.matches);
    
    // 4. Add the listener
    window.addEventListener("resize", listener); // or media.addEventListener("change", listener)

    // 5. Cleanup on unmount
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}