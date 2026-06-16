'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function TooManyRequests() {
  const router = useRouter();

  return (
    <div className='absolute top-1/2 left-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center'>
      <span className='from-foreground bg-linear-to-b to-transparent bg-clip-text text-[10rem] leading-none font-extrabold text-transparent'>
        429
      </span>
      <h2 className='font-heading my-2 text-2xl font-bold'>
        Too many requests
      </h2>
      <p>
        You&apos;ve sent too many requests in a short amount of time. Please
        wait a moment before trying again.
      </p>
      <div className='mt-8 flex justify-center gap-2'>
        <Button onClick={() => router.back()} variant='default' size='lg'>
          Go back
        </Button>
        <Button onClick={() => router.refresh()} variant='ghost' size='lg'>
          Try again
        </Button>
      </div>
    </div>
  );
}
