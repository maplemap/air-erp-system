import {MantineProvider as CoreMantineProvider} from '@mantine/core';
import {ReactNode} from 'react';
import {theme} from './theme.ts';

type Props = {
  children: ReactNode;
};

export const MantineProvider = ({children}: Props) => {
  return <CoreMantineProvider theme={theme}>{children}</CoreMantineProvider>;
};
