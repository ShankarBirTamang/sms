import { useRef, useEffect } from "react";

function useDocumentTitle(
  title: string,
  prevailOnUnmount: boolean = false
): void {
  const defaultTitleRef = useRef<string>(document.title);

  useEffect(() => {
    document.title = title + " | Infinity School";
  }, [title]);

  useEffect(() => {
    const defaultTitle = defaultTitleRef.current; // Capture the ref value at the time of effect setup
    return () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle;
      }
    };
  }, [prevailOnUnmount]);
}

export default useDocumentTitle;
