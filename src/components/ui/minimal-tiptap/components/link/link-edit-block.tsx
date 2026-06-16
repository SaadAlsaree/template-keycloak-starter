import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface LinkEditorProps extends React.ComponentProps<'div'> {
  defaultUrl?: string;
  defaultText?: string;
  defaultIsNewTab?: boolean;
  onSave: (url: string, text?: string, isNewTab?: boolean) => void;
}

import { useTranslation } from 'react-i18next';

export const LinkEditBlock = ({
  onSave,
  defaultIsNewTab,
  defaultUrl,
  defaultText,
  className
}: LinkEditorProps) => {
  const { t } = useTranslation();
  const formRef = React.useRef<HTMLDivElement>(null);
  const [url, setUrl] = React.useState(defaultUrl || '');
  const [text, setText] = React.useState(defaultText || '');
  const [isNewTab, setIsNewTab] = React.useState(defaultIsNewTab || false);

  const handleSave = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (formRef.current) {
        const isValid = Array.from(
          formRef.current.querySelectorAll('input')
        ).every((input) => input.checkValidity());

        if (isValid) {
          onSave(url, text, isNewTab);
        } else {
          formRef.current.querySelectorAll('input').forEach((input) => {
            if (!input.checkValidity()) {
              input.reportValidity();
            }
          });
        }
      }
    },
    [onSave, url, text, isNewTab]
  );

  return (
    <div ref={formRef}>
      <div className={cn('space-y-4', className)}>
        <div className='space-y-1'>
          <Label>{t('tiptap.link.url')}</Label>
          <Input
            type='url'
            required
            placeholder={t('tiptap.link.enterUrl')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className='space-y-1'>
          <Label>{t('tiptap.link.displayText')}</Label>
          <Input
            type='text'
            placeholder={t('tiptap.link.enterDisplayText')}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className='flex items-center space-x-2 rtl:space-x-reverse'>
          <Label>{t('tiptap.link.openInNewTab')}</Label>
          <Switch checked={isNewTab} onCheckedChange={setIsNewTab} />
        </div>

        <div className='flex justify-end space-x-2 rtl:space-x-reverse'>
          <Button type='button' onClick={handleSave}>
            {t('tiptap.link.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

LinkEditBlock.displayName = 'LinkEditBlock';

export default LinkEditBlock;
