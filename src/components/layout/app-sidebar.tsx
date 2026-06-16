'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { navItems } from '@/config/nav-config';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useFilteredNavItems } from '@/hooks/use-nav';
import {
  IconChevronLeft,
  IconChevronsDown,
  IconLogout,
  IconUserCircle
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { useLayout } from '@/contexts/layout-context';
import { useI18n } from '@/components/providers/i18n-provider';
import { useUserStore } from '@/store/user-store';
import { keycloakSignOut } from '@/lib/keycloak-logout';

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

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const router = useRouter();
  const { settings } = useLayout();
  const { t } = useI18n();
  const { user } = useUserStore();
  const sidebarSide =
    settings.direction === 'rtl' ? 'right' : ('left' as const);
  const sidebarVariant = settings.variant as 'sidebar' | 'floating' | 'inset';
  const sidebarCollapsible = settings.collapsible as
    | 'offcanvas'
    | 'icon'
    | 'none';

  const filteredItems = useFilteredNavItems(navItems);

  const handleSignOut = () => {
    keycloakSignOut();
  };

  React.useEffect(() => {}, [isOpen]);

  return (
    <Sidebar
      variant={sidebarVariant}
      side={sidebarSide}
      collapsible={sidebarCollapsible}
    >
      <SidebarHeader>
        <div className='flex items-center gap-2 px-4 py-2'>
          <Icons.logo className='h-6 w-6 shrink-0' />
          <span className='text-sm font-semibold'>App</span>
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarMenu>
            {filteredItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              const translatedTitle = t(`nav.${item.title.toLowerCase()}`);
              const translatedHeader = item.header
                ? t(`nav.${item.header.toLowerCase()}`)
                : null;

              return (
                <React.Fragment key={item.title}>
                  {translatedHeader && (
                    <SidebarGroupLabel className='text-muted-foreground mt-1 px-4 py-2 text-xs font-semibold uppercase first:mt-0'>
                      {translatedHeader}
                    </SidebarGroupLabel>
                  )}
                  {item?.items && item?.items?.length > 0 ? (
                    <Collapsible
                      asChild
                      defaultOpen={item.isActive}
                      className='group/collapsible'
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={translatedTitle}
                            isActive={pathname === item.url}
                            className='cursor-pointer'
                          >
                            {item.icon && <Icon />}
                            <span>{translatedTitle}</span>
                            <IconChevronLeft className='mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => {
                              const translatedSubTitle = t(
                                `nav.${subItem.title.toLowerCase()}`
                              );
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                  >
                                    <Link href={subItem.url}>
                                      <span>{translatedSubTitle}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip={translatedTitle}
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url}>
                          <Icon />
                          <span>{translatedTitle}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </React.Fragment>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg'>
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.displayName || user?.username || 'User'}
                    </span>
                    <span className='text-muted-foreground truncate text-xs'>
                      {user?.email || ''}
                    </span>
                  </div>
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarFallback className='rounded-lg'>
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col space-y-1 leading-tight'>
                      <p className='text-sm font-medium'>
                      {user?.displayName || user?.username || 'User'}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {user?.email || ''}
                      </p>
                    </div>
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
