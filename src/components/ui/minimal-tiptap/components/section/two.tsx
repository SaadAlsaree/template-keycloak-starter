import * as React from 'react';
import type { Editor } from '@tiptap/react';
import type { FormatAction } from '../../types';
import type { toggleVariants } from '@/components/ui/toggle';
import type { VariantProps } from 'class-variance-authority';
import {
  CodeIcon,
  DotsHorizontalIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  TextNoneIcon,
  UnderlineIcon
} from '@radix-ui/react-icons';
import { ToolbarSection } from '../toolbar-section';
import { useTranslation } from 'react-i18next';

type TextStyleAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'clearFormatting';

interface TextStyle extends FormatAction {
  value: TextStyleAction;
}

interface SectionTwoProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
  activeActions?: TextStyleAction[];
  mainActionCount?: number;
}

export const SectionTwo: React.FC<SectionTwoProps> = ({
  editor,
  activeActions = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'code',
    'clearFormatting'
  ],
  mainActionCount = 2,
  size,
  variant
}) => {
  const { t } = useTranslation();

  const formatActions = React.useMemo<TextStyle[]>(
    () => [
      {
        value: 'bold',
        label: t('tiptap.toolbar.bold'),
        icon: <FontBoldIcon className='size-5' />,
        action: (editor) => editor.chain().focus().toggleBold().run(),
        isActive: (editor) => editor.isActive('bold'),
        canExecute: (editor) =>
          editor.can().chain().focus().toggleBold().run() &&
          !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'B']
      },
      {
        value: 'italic',
        label: t('tiptap.toolbar.italic'),
        icon: <FontItalicIcon className='size-5' />,
        action: (editor) => editor.chain().focus().toggleItalic().run(),
        isActive: (editor) => editor.isActive('italic'),
        canExecute: (editor) =>
          editor.can().chain().focus().toggleItalic().run() &&
          !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'I']
      },
      {
        value: 'underline',
        label: t('tiptap.toolbar.underline'),
        icon: <UnderlineIcon className='size-5' />,
        action: (editor) => editor.chain().focus().toggleUnderline().run(),
        isActive: (editor) => editor.isActive('underline'),
        canExecute: (editor) =>
          editor.can().chain().focus().toggleUnderline().run() &&
          !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'U']
      },
      {
        value: 'strikethrough',
        label: t('tiptap.toolbar.strikethrough'),
        icon: <StrikethroughIcon className='size-5' />,
        action: (editor) => editor.chain().focus().toggleStrike().run(),
        isActive: (editor) => editor.isActive('strike'),
        canExecute: (editor) =>
          editor.can().chain().focus().toggleStrike().run() &&
          !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'shift', 'S']
      },
      {
        value: 'code',
        label: t('tiptap.toolbar.code'),
        icon: <CodeIcon className='size-5' />,
        action: (editor) => editor.chain().focus().toggleCode().run(),
        isActive: (editor) => editor.isActive('code'),
        canExecute: (editor) =>
          editor.can().chain().focus().toggleCode().run() &&
          !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'E']
      },
      {
        value: 'clearFormatting',
        label: t('tiptap.toolbar.clearFormatting'),
        icon: <TextNoneIcon className='size-5' />,
        action: (editor) => editor.chain().focus().unsetAllMarks().run(),
        isActive: () => false,
        canExecute: (editor) =>
          editor.can().chain().focus().unsetAllMarks().run() &&
          !editor.isActive('codeBlock'),
        shortcuts: ['mod', '\\']
      }
    ],
    [t]
  );

  return (
    <ToolbarSection
      editor={editor}
      actions={formatActions}
      activeActions={activeActions}
      mainActionCount={mainActionCount}
      dropdownIcon={<DotsHorizontalIcon className='size-5' />}
      dropdownTooltip={t('tiptap.toolbar.moreFormatting')}
      dropdownClassName='w-8'
      size={size}
      variant={variant}
    />
  );
};

SectionTwo.displayName = 'SectionTwo';

export default SectionTwo;
