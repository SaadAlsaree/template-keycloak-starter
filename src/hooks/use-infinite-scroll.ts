'use client';

import { useEffect } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Hook to handle infinite scrolling using Intersection Observer.
 * @param observerTarget The ref of the element to observe (usually a div at the bottom of the list)
 * @param props Configuration properties (hasNextPage, isFetchingNextPage, fetchNextPage)
 */
export function useInfiniteScroll(
  observerTarget: React.RefObject<HTMLElement | null>,
  {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold = 0.1,
    rootMargin = '100px'
  }: UseInfiniteScrollProps
) {
  useEffect(() => {
    const element = observerTarget.current;
    if (!element || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        // إذا ظهر العنصر المخفي في أسفل القائمة وكانت هناك صفحات أخرى ولا نقوم بالتحميل حالياً
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [
    observerTarget,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold,
    rootMargin
  ]);
}

// example of usage
// import { useRef } from 'react';
// import { useBooksList } from '@/hooks/use-books-list';
// import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';

// export function BooksList() {
//   const { books, hasNextPage, isFetchingNextPage, fetchNextPage } = useBooksList();

//   // 1. أنشئ مرجعاً للعنصر في أسفل القائمة
//   const bottomRef = useRef<HTMLDivElement>(null);

//   // 2. اربط الهوك بالمرجع وبالبيانات
//   useInfiniteScroll(bottomRef, {
//     hasNextPage,
//     isFetchingNextPage,
//     fetchNextPage
//   });

//   return (
//     <div>
//       {/* قائمة الكتب */}
//       {books.map(book => <div key={book.id}>{book.title}</div>)}

//       {/* 3. ضع هذا العنصر في نهاية القائمة ليتم مراقبته */}
//       <div ref={bottomRef} style={{ height: '20px' }}>
//         {isFetchingNextPage && <p>جاري تحميل المزيد...</p>}
//       </div>
//     </div>
//   );
// }
