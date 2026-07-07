import 'server-only';

import { getServerAuthToken } from '@/lib/auth-token';
import type { DashboardTokenOverview } from '@/features/dashboard/types/dashboard';
import { buildDashboardTokenInfo } from '@/features/dashboard/utils/dashboard';

export async function getDashboardTokenOverview(): Promise<DashboardTokenOverview> {
  const serverToken = await getServerAuthToken();
  const accessTokenInfo = buildDashboardTokenInfo(
    'accessToken',
    serverToken.accessToken
  );
  const idTokenInfo = buildDashboardTokenInfo('idToken', serverToken.idToken);

  return {
    authError: serverToken.error,
    tokens: [
      {
        ...accessTokenInfo,
        roles:
          accessTokenInfo.roles.length > 0
            ? accessTokenInfo.roles
            : idTokenInfo.roles
      }
    ]
  };
}
