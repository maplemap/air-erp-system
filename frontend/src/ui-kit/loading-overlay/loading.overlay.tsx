import {
  LoadingOverlay as MantineLoadingOverlay,
  LoadingOverlayProps as MantineLoadingOverlayProps,
} from '@mantine/core';

type LoadingOverlayProps = Omit<
  MantineLoadingOverlayProps,
  'zIndex' | 'overlayProps'
>;

export const LoadingOverlay = (props: LoadingOverlayProps) => (
  <MantineLoadingOverlay
    zIndex={1000}
    overlayProps={{radius: 'sm', blur: 2}}
    {...props}
  />
);
