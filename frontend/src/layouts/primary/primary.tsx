import {Outlet} from 'react-router-dom';
import {ErrorBoundary, Header} from '@/components';
import {AppShell} from '@/ui-kit';

export const PrimaryLayout = () => (
  <AppShell header={{height: 64}}>
    <AppShell.Header withBorder={false}>
      <ErrorBoundary message="'Header' is not available at this time. Please reload the page">
        <Header />
      </ErrorBoundary>
    </AppShell.Header>
    <AppShell.Main>
      <ErrorBoundary message="Something went wrong. Please update later">
        <Outlet />
      </ErrorBoundary>
    </AppShell.Main>
  </AppShell>
);
