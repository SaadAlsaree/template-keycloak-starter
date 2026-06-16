'use client';

/**
 * Fully client-side hook for filtering navigation items
 * (Simplified/Clerk removed)
 */

import { useMemo } from 'react';
import type { NavItem } from '@/types';
import { useUserStore } from '@/store/user-store';

/**
 * Hook to filter navigation items
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]) {
  const { user } = useUserStore();

  // Mock access context (Clerk removed)
  const accessContext = useMemo(() => {
    return {
      organization: { id: 'default-org', name: 'Default Org' },
      user: { id: user?.id, fullName: user?.displayName },
      permissions:
        user?.userRoles.flatMap((role) =>
          role.permissions.map((permission) => permission.systemName)
        ) ?? [],
      roles: user?.userRoles.map((role) => role.roleName) ?? [],
      hasOrg: true
    };
  }, [user]);

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // No access restrictions
        if (!item.access) {
          return true;
        }

        // Check requireOrg
        if (item.access.requireOrg && !accessContext.hasOrg) {
          return false;
        }

        // Check permission
        if (item.access.permission) {
          if (!accessContext.hasOrg) {
            return false;
          }
          if (!accessContext.permissions.includes(item.access.permission)) {
            return false;
          }
        }

        // Check role
        if (item.access.role) {
          if (!accessContext.hasOrg) {
            return false;
          }
          if (!accessContext.roles.includes(item.access.role)) {
            return false;
          }
        }

        return true;
      })
      .map((item) => {
        // Recursively filter child items
        if (item.items && item.items.length > 0) {
          const filteredChildren = item.items.filter((childItem) => {
            // No access restrictions
            if (!childItem.access) {
              return true;
            }

            // Check requireOrg
            if (childItem.access.requireOrg && !accessContext.hasOrg) {
              return false;
            }

            // Check permission
            if (childItem.access.permission) {
              if (!accessContext.hasOrg) {
                return false;
              }
              if (
                !accessContext.permissions.includes(childItem.access.permission)
              ) {
                return false;
              }
            }

            // Check role
            if (childItem.access.role) {
              if (!accessContext.hasOrg) {
                return false;
              }
              if (!accessContext.roles.includes(childItem.access.role)) {
                return false;
              }
            }

            return true;
          });

          return {
            ...item,
            items: filteredChildren
          };
        }

        return item;
      });
  }, [items, accessContext]);

  return filteredItems;
}
