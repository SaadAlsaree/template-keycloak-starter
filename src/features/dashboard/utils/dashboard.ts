import type {
  DashboardClaimEntry,
  DashboardTokenInfo,
  DashboardTokenKind
} from '@/features/dashboard/types/dashboard';

type JwtClaims = Record<string, unknown>;

const TOKEN_LABELS: Record<DashboardTokenKind, string> = {
  accessToken: 'Access Token',
  idToken: 'ID Token'
};

const PRIORITY_CLAIMS = [
  'sub',
  'preferred_username',
  'name',
  'email',
  'iss',
  'aud',
  'azp',
  'typ',
  'scope',
  'sid',
  'session_state',
  'client_id'
];

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function getStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string') {
    return value
      .split(' ')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function decodeJwtPayload(token?: string): JwtClaims | undefined {
  if (!token) {
    return undefined;
  }

  const [, payload] = token.split('.');

  if (!payload) {
    return undefined;
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '='
    );

    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8')) as JwtClaims;
  } catch {
    return undefined;
  }
}

function formatTimestamp(value: unknown): string | undefined {
  if (typeof value !== 'number') {
    return undefined;
  }

  return new Date(value * 1000).toISOString();
}

function formatClaimValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value);
}

function extractRoles(claims: JwtClaims): string[] {
  return getStringArray(claims.roles);
}

function getClaimEntries(claims: JwtClaims): DashboardClaimEntry[] {
  const allKeys = Object.keys(claims);
  const orderedKeys = [
    ...PRIORITY_CLAIMS.filter((key) => key in claims),
    ...allKeys
      .filter((key) => !PRIORITY_CLAIMS.includes(key))
      .sort((left, right) => left.localeCompare(right))
  ];

  return orderedKeys.slice(0, 14).map((key) => ({
    key,
    value: formatClaimValue(claims[key])
  }));
}

export function buildDashboardTokenInfo(
  kind: DashboardTokenKind,
  token?: string
): DashboardTokenInfo {
  const claims = decodeJwtPayload(token);

  if (!claims) {
    return {
      kind,
      label: TOKEN_LABELS[kind],
      isAvailable: false,
      audience: [],
      scopes: [],
      roles: [],
      claimCount: 0,
      claims: []
    };
  }

  return {
    kind,
    label: TOKEN_LABELS[kind],
    isAvailable: true,
    subject: typeof claims.sub === 'string' ? claims.sub : undefined,
    username:
      typeof claims.preferred_username === 'string'
        ? claims.preferred_username
        : typeof claims.name === 'string'
          ? claims.name
          : undefined,
    email: typeof claims.email === 'string' ? claims.email : undefined,
    issuer: typeof claims.iss === 'string' ? claims.iss : undefined,
    audience: getStringArray(claims.aud),
    scopes: getStringArray(claims.scope ?? claims.scp),
    roles: extractRoles(claims),
    issuedAt: formatTimestamp(claims.iat),
    expiresAt: formatTimestamp(claims.exp),
    claimCount: Object.keys(claims).length,
    claims: getClaimEntries(claims)
  };
}
