import { CurrentUserDto } from '@/types';

function extractPermissionValues(user: CurrentUserDto | null): string[] {
  if (!user) {
    return [];
  }

  const permissions = new Set<string>();

  user.userRoles.forEach((role) => {
    role.permissions.forEach((permission) => {
      permissions.add(permission.systemName);
    });
  });

  return Array.from(permissions);
}

export function hasPermission(
  user: CurrentUserDto | null,
  permissionValue: string
): boolean {
  const permissions = extractPermissionValues(user);
  if (!permissions.length) {
    return false;
  }

  return permissions.includes(permissionValue);
}

export function hasAnyPermission(
  user: CurrentUserDto | null,
  permissionValues: string[]
): boolean {
  if (!user || !permissionValues.length) {
    return false;
  }

  return permissionValues.some((permission) => hasPermission(user, permission));
}

export function hasAllPermissions(
  user: CurrentUserDto | null,
  permissionValues: string[]
): boolean {
  if (!user || !permissionValues.length) {
    return false;
  }

  return permissionValues.every((permission) =>
    hasPermission(user, permission)
  );
}

export function getUserRoles(user: CurrentUserDto | null): string[] {
  if (!user || !user.userRoles?.length) {
    return [];
  }

  return user.userRoles.map((role) => role.roleName);
}

export function getUserPermissions(user: CurrentUserDto | null): string[] {
  return extractPermissionValues(user);
}

export function isAuthenticated(user: CurrentUserDto | null): boolean {
  return Boolean(user?.id && user.isActive);
}

export function isInOrganizationalUnit(
  user: CurrentUserDto | null,
  organizationalUnitId: string
): boolean {
  if (!user) {
    return false;
  }

  return (
    user.orgUnit?.id === organizationalUnitId ||
    user.parentOrgUnitId === organizationalUnitId
  );
}
