import PageContainer from '@/components/layout/page-container';

export default function HomePage() {
  return (
    <PageContainer pageTitle='Dashboard' pageDescription='Welcome to your application.'>
      <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed p-8'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold'>Getting Started</h3>
          <p className='text-muted-foreground mt-2 text-sm'>
            Start building your application by adding pages, components, and
            features.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
