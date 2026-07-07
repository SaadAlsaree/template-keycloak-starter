import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getDashboardTokenOverview } from '@/features/dashboard/api/dashboard.service';
import type { DashboardTokenInfo } from '@/features/dashboard/types/dashboard';
import {
  AlertTriangle,
  Fingerprint,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

function SummaryCard({
  title,
  value,
  description,
  icon: Icon
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof KeyRound;
}) {
  return (
    <div className='rounded-lg border bg-card p-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='space-y-1'>
          <p className='text-muted-foreground text-sm'>{title}</p>
          <p className='text-2xl font-semibold'>{value}</p>
          <p className='text-muted-foreground text-xs'>{description}</p>
        </div>
        <div className='bg-primary/10 text-primary rounded-md p-2'>
          <Icon className='size-4' />
        </div>
      </div>
    </div>
  );
}

function TokenCard({ token }: { token: DashboardTokenInfo }) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <CardTitle>{token.label}</CardTitle>
            <CardDescription>
              Decoded claims extracted from the current session token.
            </CardDescription>
          </div>
          <Badge variant={token.isAvailable ? 'default' : 'outline'}>
            {token.isAvailable ? 'Available' : 'Missing'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='rounded-md border p-3'>
            <div className='text-muted-foreground text-xs'>Subject</div>
            <div className='mt-1 break-all text-sm font-medium'>
              {token.subject ?? '-'}
            </div>
          </div>
          <div className='rounded-md border p-3'>
            <div className='text-muted-foreground text-xs'>Username</div>
            <div className='mt-1 break-all text-sm font-medium'>
              {token.username ?? '-'}
            </div>
          </div>
          <div className='rounded-md border p-3'>
            <div className='text-muted-foreground text-xs'>Email</div>
            <div className='mt-1 break-all text-sm font-medium'>
              {token.email ?? '-'}
            </div>
          </div>
          <div className='rounded-md border p-3'>
            <div className='text-muted-foreground text-xs'>Issuer</div>
            <div className='mt-1 break-all text-sm font-medium'>
              {token.issuer ?? '-'}
            </div>
          </div>
          <div className='rounded-md border p-3'>
            <div className='text-muted-foreground text-xs'>Issued At</div>
            <div className='mt-1 text-sm font-medium'>{token.issuedAt ?? '-'}</div>
          </div>
          <div className='rounded-md border p-3'>
            <div className='text-muted-foreground text-xs'>Expires At</div>
            <div className='mt-1 text-sm font-medium'>{token.expiresAt ?? '-'}</div>
          </div>
        </div>

        <div className='grid gap-3 lg:grid-cols-2'>
          <div className='rounded-md border p-3'>
            <div className='text-muted-foreground text-xs'>Audience</div>
            <div className='mt-2 flex flex-wrap gap-2'>
              {token.audience.length > 0 ? (
                token.audience.map((item) => (
                  <Badge key={`${token.kind}-aud-${item}`} variant='secondary'>
                    {item}
                  </Badge>
                ))
              ) : (
                <span className='text-muted-foreground text-sm'>-</span>
              )}
            </div>
          </div>

          <div className='rounded-md border p-3'>
            <div className='text-muted-foreground text-xs'>Scopes</div>
            <div className='mt-2 flex flex-wrap gap-2'>
              {token.scopes.length > 0 ? (
                token.scopes.map((item) => (
                  <Badge key={`${token.kind}-scope-${item}`} variant='outline'>
                    {item}
                  </Badge>
                ))
              ) : (
                <span className='text-muted-foreground text-sm'>-</span>
              )}
            </div>
          </div>
        </div>

        <div className='rounded-md border p-3'>
          <div className='text-muted-foreground text-xs'>Roles</div>
          <div className='mt-2 flex flex-wrap gap-2'>
            {token.roles.length > 0 ? (
              token.roles.map((role) => (
                <Badge key={`${token.kind}-role-${role}`} variant='secondary'>
                  {role}
                </Badge>
              ))
            ) : (
              <span className='text-muted-foreground text-sm'>-</span>
            )}
          </div>
        </div>

        <div className='overflow-hidden rounded-md border'>
          <div className='bg-muted/40 grid grid-cols-[minmax(0,180px)_1fr] gap-3 border-b px-4 py-3 text-xs font-medium'>
            <span>Claim</span>
            <span>Value</span>
          </div>
          {token.claims.length > 0 ? (
            token.claims.map((claim) => (
              <div
                key={`${token.kind}-${claim.key}`}
                className='grid grid-cols-[minmax(0,180px)_1fr] gap-3 border-b px-4 py-3 text-sm last:border-b-0'
              >
                <span className='font-medium'>{claim.key}</span>
                <span className='text-muted-foreground break-all'>{claim.value}</span>
              </div>
            ))
          ) : (
            <div className='text-muted-foreground px-4 py-6 text-sm'>
              No readable claims were found for this token.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function HomePage() {
  const overview = await getDashboardTokenOverview();
  const availableTokenCount = overview.tokens.filter(
    (token) => token.isAvailable
  ).length;
  const uniqueRoles = new Set(overview.tokens.flatMap((token) => token.roles)).size;
  const uniqueScopes = new Set(
    overview.tokens.flatMap((token) => token.scopes)
  ).size;

  return (
    <PageContainer
      pageTitle='Dashboard'
      pageDescription='Current token details extracted from the authenticated Keycloak session.'
    >
      <div className='flex flex-col gap-6'>
        {overview.authError ? (
          <div className='text-amber-700 bg-amber-50 border-amber-200 flex items-start gap-3 rounded-lg border px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300'>
            <AlertTriangle className='mt-0.5 size-4 shrink-0' />
            <div>
              <div className='text-sm font-medium'>Authentication issue</div>
              <div className='text-sm'>{overview.authError}</div>
            </div>
          </div>
        ) : null}

        <div className='grid gap-4 md:grid-cols-3'>
          <SummaryCard
            title='Available Tokens'
            value={`${availableTokenCount}/${overview.tokens.length}`}
            description='Tokens decoded successfully from the current session.'
            icon={KeyRound}
          />
          <SummaryCard
            title='Unique Roles'
            value={String(uniqueRoles)}
            description='Combined realm and client roles found in the token payloads.'
            icon={ShieldCheck}
          />
          <SummaryCard
            title='Unique Scopes'
            value={String(uniqueScopes)}
            description='Scopes discovered across the decoded token claims.'
            icon={Fingerprint}
          />
        </div>

        <div className='grid gap-6 xl:grid-cols-2'>
          {overview.tokens.map((token) => (
            <TokenCard key={token.kind} token={token} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
