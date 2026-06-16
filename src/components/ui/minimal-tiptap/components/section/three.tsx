import * as React from 'react';
import type { Editor } from '@tiptap/react';
import type { toggleVariants } from '@/components/ui/toggle';
import type { VariantProps } from 'class-variance-authority';
import { CaretDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { ToolbarButton } from '../toolbar-button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useTheme } from '../../hooks/use-theme';
import { useTranslation } from 'react-i18next';

interface ColorItem {
  cssVar: string;
  label: string;
  darkLabel?: string;
}

interface ColorPalette {
  label: string;
  colors: ColorItem[];
  inverse: string;
}

const MemoizedColorButton = React.memo<{
  color: ColorItem;
  isSelected: boolean;
  inverse: string;
  onClick: (value: string) => void;
}>(({ color, isSelected, inverse, onClick }) => {
  const isDarkMode = useTheme();
  const label = isDarkMode && color.darkLabel ? color.darkLabel : color.label;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroupItem
          tabIndex={0}
          className='relative size-7 rounded-md p-0'
          value={color.cssVar}
          aria-label={label}
          style={{ backgroundColor: color.cssVar }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            onClick(color.cssVar);
          }}
        >
          {isSelected && (
            <CheckIcon
              className='absolute inset-0 m-auto size-6'
              style={{ color: inverse }}
            />
          )}
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent side='bottom'>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
});

MemoizedColorButton.displayName = 'MemoizedColorButton';

const MemoizedColorPicker = React.memo<{
  palette: ColorPalette;
  selectedColor: string;
  inverse: string;
  onColorChange: (value: string) => void;
}>(({ palette, selectedColor, inverse, onColorChange }) => (
  <ToggleGroup
    type='single'
    value={selectedColor}
    onValueChange={(value: string) => {
      if (value) onColorChange(value);
    }}
    className='gap-1.5'
  >
    {palette.colors.map((color, index) => (
      <MemoizedColorButton
        key={index}
        inverse={inverse}
        color={color}
        isSelected={selectedColor === color.cssVar}
        onClick={onColorChange}
      />
    ))}
  </ToggleGroup>
));

MemoizedColorPicker.displayName = 'MemoizedColorPicker';

interface SectionThreeProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

export const SectionThree: React.FC<SectionThreeProps> = ({
  editor,
  size,
  variant
}) => {
  const { t } = useTranslation();

  const COLORS = React.useMemo<ColorPalette[]>(() => {
    return [
      {
        label: t('tiptap.colors.palette1'),
        inverse: 'hsl(var(--background))',
        colors: [
          {
            cssVar: 'hsl(var(--foreground))',
            label: t('tiptap.colors.default')
          },
          {
            cssVar: 'var(--mt-accent-bold-blue)',
            label: t('tiptap.colors.boldBlue')
          },
          {
            cssVar: 'var(--mt-accent-bold-teal)',
            label: t('tiptap.colors.boldTeal')
          },
          {
            cssVar: 'var(--mt-accent-bold-green)',
            label: t('tiptap.colors.boldGreen')
          },
          {
            cssVar: 'var(--mt-accent-bold-orange)',
            label: t('tiptap.colors.boldOrange')
          },
          {
            cssVar: 'var(--mt-accent-bold-red)',
            label: t('tiptap.colors.boldRed')
          },
          {
            cssVar: 'var(--mt-accent-bold-purple)',
            label: t('tiptap.colors.boldPurple')
          }
        ]
      },
      {
        label: t('tiptap.colors.palette2'),
        inverse: 'hsl(var(--background))',
        colors: [
          { cssVar: 'var(--mt-accent-gray)', label: t('tiptap.colors.gray') },
          { cssVar: 'var(--mt-accent-blue)', label: t('tiptap.colors.blue') },
          { cssVar: 'var(--mt-accent-teal)', label: t('tiptap.colors.teal') },
          { cssVar: 'var(--mt-accent-green)', label: t('tiptap.colors.green') },
          {
            cssVar: 'var(--mt-accent-orange)',
            label: t('tiptap.colors.orange')
          },
          { cssVar: 'var(--mt-accent-red)', label: t('tiptap.colors.red') },
          {
            cssVar: 'var(--mt-accent-purple)',
            label: t('tiptap.colors.purple')
          }
        ]
      },
      {
        label: t('tiptap.colors.palette3'),
        inverse: 'hsl(var(--foreground))',
        colors: [
          {
            cssVar: 'hsl(var(--background))',
            label: t('tiptap.colors.white'),
            darkLabel: t('tiptap.colors.black')
          },
          {
            cssVar: 'var(--mt-accent-blue-subtler)',
            label: t('tiptap.colors.blueSubtle')
          },
          {
            cssVar: 'var(--mt-accent-teal-subtler)',
            label: t('tiptap.colors.tealSubtle')
          },
          {
            cssVar: 'var(--mt-accent-green-subtler)',
            label: t('tiptap.colors.greenSubtle')
          },
          {
            cssVar: 'var(--mt-accent-yellow-subtler)',
            label: t('tiptap.colors.yellowSubtle')
          },
          {
            cssVar: 'var(--mt-accent-red-subtler)',
            label: t('tiptap.colors.redSubtle')
          },
          {
            cssVar: 'var(--mt-accent-purple-subtler)',
            label: t('tiptap.colors.purpleSubtle')
          }
        ]
      }
    ];
  }, [t]);
  const color =
    editor.getAttributes('textStyle')?.color || 'hsl(var(--foreground))';
  const [selectedColor, setSelectedColor] = React.useState(color);

  const handleColorChange = React.useCallback(
    (value: string) => {
      setSelectedColor(value);
      if (editor.state.storedMarks) {
        const textStyleMarkType = editor.schema.marks.textStyle;
        if (textStyleMarkType) {
          editor.view.dispatch(
            editor.state.tr.removeStoredMark(textStyleMarkType)
          );
        }
      }

      setTimeout(() => {
        editor.chain().setColor(value).run();
      }, 0);
    },
    [editor]
  );

  React.useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton
          tooltip={t('tiptap.toolbar.textColor')}
          aria-label={t('tiptap.toolbar.textColor')}
          className='gap-0'
          size={size}
          variant={variant}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='size-5'
            style={{ color: selectedColor }}
          >
            <path d='M4 20h16' />
            <path d='m6 16 6-12 6 12' />
            <path d='M8 12h8' />
          </svg>
          <CaretDownIcon className='size-5' />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-full'>
        <div className='space-y-1.5'>
          {COLORS.map((palette, index) => (
            <MemoizedColorPicker
              key={index}
              palette={palette}
              inverse={palette.inverse}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

SectionThree.displayName = 'SectionThree';

export default SectionThree;
