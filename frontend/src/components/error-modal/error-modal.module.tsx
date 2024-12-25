import {useAppStore} from '@/services/store';
import {Modal} from '@/ui-kit';
import styles from './error-modal.module.scss';

export const ErrorModalModule = () => {
  const {error, cleanError} = useAppStore();

  return (
    <Modal
      title="Error"
      classNames={{
        root: styles.root,
      }}
      opened={Boolean(error)}
      onClose={cleanError}
    >
      {error}
    </Modal>
  );
};
