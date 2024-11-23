import React from 'react';
import {ErrorBoundary as ErrorBoundaryComponent} from 'react-error-boundary';
import {useLocation} from 'react-router-dom';

const DEFAULT_MESSAGE =
  'Something went wrong. Please update the page now or try again it later.';

export type Props = {
  message?: string;
  children: React.ReactNode;
};

export const ErrorBoundary = ({children, message = DEFAULT_MESSAGE}: Props) => {
  const location = useLocation();

  return (
    <ErrorBoundaryComponent
      key={location.pathname}
      fallback={<div>{message}</div>}
    >
      {children}
    </ErrorBoundaryComponent>
  );
};
