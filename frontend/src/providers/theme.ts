import '@fontsource/roboto-mono';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/600.css';
import '@fontsource/roboto-mono/700.css';
import {createTheme} from '@mantine/core';
import '@mantine/dates/styles.css';
import {buttonTheme, inputTheme} from './component-themes';
import './global-style-ovveride.css';

export const theme = createTheme({
  colors: {
    darkGrey: [
      'var(--darkGrey100)',
      'var(--darkGrey90)',
      'var(--darkGrey80)',
      'var(--darkGrey70)',
      'var(--darkGrey60)',
      'var(--darkGrey50)',
      'var(--darkGrey40)',
      'var(--darkGrey30)',
      'var(--darkGrey20)',
      'var(--darkGrey10)',
    ],
  },
  fontSizes: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
  },
  spacing: {
    xxs: '2px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    xxl: '32px',
  },
  fontFamily: 'Roboto Mono, monospace',
  defaultRadius: 'xs',
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  lineHeights: {
    xs: '14px',
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '28rpx',
    xxl: '32px',
  },
  components: {
    TextInput: inputTheme,
    Select: inputTheme,
    PasswordInput: inputTheme,
    Button: buttonTheme,
  },
});
