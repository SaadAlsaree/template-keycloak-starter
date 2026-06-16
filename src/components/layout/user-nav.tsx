'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { keycloakSignOut } from '@/lib/keycloak-logout';
import { useUserStore } from '@/store/user-store';
import { useI18n } from '@/components/providers/i18n-provider';
import { IconLogout, IconUserCircle } from '@tabler/icons-react';

function getUserInitials(
  user: {
    displayName?: string | null;
    name?: string | null;
    email?: string | null;
  } | null
): string {
  if (!user) return '?';
  const name = user.displayName || user.name || user.email || '';
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function UserNav() {
  const router = useRouter();
  const { status } = useSession();
  const { user } = useUserStore();
  const { t } = useI18n();

  const handleSignOut = () => {
    keycloakSignOut();
  };

  if (status !== 'authenticated' || !user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        align='end'
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>
              {user.displayName || user.username}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <IconUserCircle className='mr-2 h-4 w-4' />
            {t('common.profile')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <IconLogout className='mr-2 h-4 w-4' />
          {t('common.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
