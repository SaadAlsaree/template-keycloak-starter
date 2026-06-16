'use client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  description?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title || t('alert.title')}
      description={description || t('alert.description')}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex w-full items-center justify-end space-x-2 pt-6'>
        <Button
          disabled={loading}
          variant='outline'
          onClick={onClose}
          className='cursor-pointer'
        >
          {t('alert.cancel')}
        </Button>
        <Button
          disabled={loading}
          variant='destructive'
          onClick={onConfirm}
          className='cursor-pointer'
        >
          {t('alert.continue')}
        </Button>
      </div>
    </Modal>
  );
};
