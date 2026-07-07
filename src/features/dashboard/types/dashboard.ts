export type DashboardTokenKind = 'accessToken' | 'idToken';

export interface DashboardClaimEntry {
  key: string;
  value: string;
}

export interface DashboardTokenInfo {
  kind: DashboardTokenKind;
  label: string;
  isAvailable: boolean;
  subject?: string;
  username?: string;
  email?: string;
  issuer?: string;
  audience: string[];
  scopes: string[];
  roles: string[];
  issuedAt?: string;
  expiresAt?: string;
  claimCount: number;
  claims: DashboardClaimEntry[];
}

export interface DashboardTokenOverview {
  authError?: string;
  tokens: DashboardTokenInfo[];
}
