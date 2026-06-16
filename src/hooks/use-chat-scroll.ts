'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook to handle chat-like scroll behavior.
 * Automatically scrolls to bottom when data changes, unless the user has scrolled up to read history.
 * @param deps Dependency array (usually the messages/comments array)
 */
export function useChatScroll(deps: any[]) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      // Logic to determine if we should scroll to bottom:
      // 1. If it's the first load (scrollHeight is larger than clientHeight but we are at top)
      // 2. If the user is already near the bottom (within 150px)
      const isNearBottom =
        scrollContainer.scrollHeight - scrollContainer.scrollTop <=
        scrollContainer.clientHeight + 150;

      if (isNearBottom) {
        // Use requestAnimationFrame to ensure the DOM has updated before scrolling
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        });
      }
    }
  }, [deps]);

  // Initial scroll to bottom on mount
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, []);

  return scrollRef;
}
