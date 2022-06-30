import type { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { I18nProvider } from './i18n';
import { ReduxProvider } from './redux';
import { SwrProvider } from './swr';

export * from './i18n';
export * from './redux';

export const AppProvider = ({ children }: PropsWithChildren) => (
  <I18nProvider>
    <ReduxProvider>
      <SwrProvider>
        <ErrorBoundary>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </ErrorBoundary>
      </SwrProvider>
    </ReduxProvider>
  </I18nProvider>
)


