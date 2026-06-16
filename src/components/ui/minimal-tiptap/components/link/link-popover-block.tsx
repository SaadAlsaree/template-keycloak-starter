import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { ToolbarButton } from '../toolbar-button';
import {
  CopyIcon,
  ExternalLinkIcon,
  LinkBreak2Icon
} from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

interface LinkPopoverBlockProps {
  url: string;
  onClear: () => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const LinkPopoverBlock: React.FC<LinkPopoverBlockProps> = ({
  url,
  onClear,
  onEdit
}) => {
  const { t } = useTranslation();
  const [copyTitle, setCopyTitle] = React.useState<string>(
    t('tiptap.link.copy')
  );

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopyTitle(t('tiptap.link.copied'));
          setTimeout(() => setCopyTitle(t('tiptap.link.copy')), 1000);
        })
        .catch(console.error);
    },
    [url, t]
  );

  const handleOpenLink = React.useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [url]);

  return (
    <div className='bg-background flex overflow-hidden rounded p-2 shadow-lg'>
      <div className='inline-flex items-center gap-1'>
        <ToolbarButton tooltip={t('tiptap.link.edit')} onClick={onEdit}>
          {t('tiptap.link.edit')}
        </ToolbarButton>
        <Separator orientation='vertical' />
        <ToolbarButton
          tooltip={t('tiptap.link.openNewTab')}
          onClick={handleOpenLink}
        >
          <ExternalLinkIcon />
        </ToolbarButton>
        <Separator orientation='vertical' />
        <ToolbarButton tooltip={t('tiptap.link.clear')} onClick={onClear}>
          <LinkBreak2Icon />
        </ToolbarButton>
        <Separator orientation='vertical' />
        <ToolbarButton
          tooltip={copyTitle}
          onClick={handleCopy}
          tooltipOptions={{
            onPointerDownOutside: (e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            }
          }}
        >
          <CopyIcon />
        </ToolbarButton>
      </div>
    </div>
  );
};
