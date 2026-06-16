'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AuthError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <AlertTriangle className='text-destructive h-12 w-12' />
        <h1 className='text-2xl font-bold'>
          {error.message || 'Authentication Error'}
        </h1>
        <p className='text-muted-foreground max-w-md text-sm'>
          Something went wrong during authentication. Please try again.
        </p>
      </div>
      <div className='flex gap-2'>
        <Button variant='outline' onClick={reset}>
          Try Again
        </Button>
        <Button asChild>
          <Link href='/auth/sign-in'>Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
