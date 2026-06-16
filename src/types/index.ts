import { Icons } from '@/components/icons';

export interface PermissionCheck {
  permission?: string;
  plan?: string;
  feature?: string;
  role?: string;
  requireOrg?: boolean;
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  access?: PermissionCheck;
  header?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicturePath: string | null;
  role: string;
  status: string;
  createdAt: string;
  displayName?: string;
  jobTitle?: string | null;
  orgUnitId?: string | null;
  roles?: readonly string[];
  permissions?: readonly string[];
}

export interface CurrentUserDto {
  id: string;
  displayName: string;
  email: string | null;
  username: string;
  jobTitle: string | null;
  profilePicturePath: string | null;
  parentOrgUnitId: string | null;
  orgUnit: {
    id: string;
    displayName: string;
    code: string;
    path: string;
  } | null;
  userRoles: Array<{
    id: string;
    roleName: string;
    permissions: Array<{
      id: string;
      systemName: string;
      displayName: string | null;
    }>;
  }>;
  isActive: boolean;
  createdAt: string;
}

export * from './api-responses';
