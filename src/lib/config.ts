function getEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function getEnvOr(name: keyof NodeJS.ProcessEnv, fallback: string): string {
  return process.env[name] || fallback;
}

const isProd = process.env.NODE_ENV === 'production';

function requireEnv(name: keyof NodeJS.ProcessEnv, devFallback = ''): string {
  return isProd ? getEnv(name) : getEnvOr(name, devFallback);
}

export const authConfig = {
  kcIssuer: getEnvOr(
    'AUTH_KEYCLOAK_ISSUER',
    'https://identity.inss.local/realms/inss'
  ),
  kcSecret: requireEnv('AUTH_KEYCLOAK_SECRET'),
  kcClientId: getEnvOr('AUTH_KEYCLOAK_ID', 'diwan'),
  kcInternal: getEnvOr(
    'AUTH_KEYCLOAK_ISSUER_INTERNAL',
    'https://identity.inss.local/realms/inss'
  ),
  secret: requireEnv('AUTH_SECRET'),
  authUrl: getEnvOr('AUTH_URL', 'http://localhost:3000')
};

export const apiConfig = {
  baseUrl: getEnvOr('API_URL', 'http://localhost:8080/api')
};

export const proxyConfig = {
  internalKey: requireEnv('INTERNAL_PROXY_KEY')
};
