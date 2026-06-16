'use client';

import { type SVGProps } from 'react';
import { Root as Radio, Item } from '@radix-ui/react-radio-group';
import {
  CircleCheck,
  RotateCcw,
  Settings,
  Type,
  ALargeSmall,
  Palette
} from 'lucide-react';
import { IconDir } from '@/components/layout/assets/custom/icon-dir';
import { IconLayoutCompact } from '@/components/layout/assets/custom/icon-layout-compact';
import { IconLayoutDefault } from '@/components/layout/assets/custom/icon-layout-default';
import { IconLayoutFull } from '@/components/layout/assets/custom/icon-layout-full';
import { IconSidebarFloating } from '@/components/layout/assets/custom/icon-sidebar-floating';
import { IconSidebarInset } from '@/components/layout/assets/custom/icon-sidebar-inset';
import { IconSidebarSidebar } from '@/components/layout/assets/custom/icon-sidebar-sidebar';
import { IconThemeDark } from '@/components/layout/assets/custom/icon-theme-dark';
import { IconThemeLight } from '@/components/layout/assets/custom/icon-theme-light';
import { IconThemeSystem } from '@/components/layout/assets/custom/icon-theme-system';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useLayout } from '@/contexts/layout-context';
import { useTheme } from '@/components/providers/theme-provider';
import { useThemeConfig } from '@/components/themes/active-theme';
import { THEMES, DEFAULT_THEME } from '@/components/themes/theme.config';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { useSidebar } from '@/components/ui/sidebar';
import { useI18n } from '@/components/providers/i18n-provider';

export function ConfigDrawer() {
  const { setOpen, open } = useSidebar();
  const { resetTheme, theme, setTheme, defaultTheme } = useTheme();
  const {
    resetLayout,
    defaultVariant,
    variant,
    setVariant,
    defaultCollapsible,
    collapsible,
    setCollapsible,
    settings,
    updateSettings
  } = useLayout();
  const { activeTheme, setActiveTheme } = useThemeConfig();
  const { t } = useI18n();

  const handleReset = () => {
    setOpen(true);
    resetTheme();
    resetLayout();
    setActiveTheme(DEFAULT_THEME);
    updateSettings({ direction: 'rtl' });
  };

  const SHEET_SIDE = settings.direction === 'ltr' ? 'right' : 'left';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          aria-label={t('settings.themeSettings')}
          aria-describedby='config-drawer-description'
          className='rounded-full'
        >
          <Settings aria-hidden='true' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col' side={SHEET_SIDE}>
        <SheetHeader className='pb-0 text-start'>
          <SheetTitle>{t('settings.themeSettings')}</SheetTitle>
          <SheetDescription id='config-drawer-description'>
            {t('settings.adjustAppearance')}
          </SheetDescription>
        </SheetHeader>
        <div className='no-scrollbar flex-1 space-y-6 overflow-y-auto px-4 py-4'>
          <ThemePresetConfig
            activeTheme={activeTheme}
            setActiveTheme={setActiveTheme}
            t={t}
          />
          {/* <ThemeConfig theme={theme} setTheme={setTheme} defaultTheme={defaultTheme} t={t} /> */}
          <MainColorConfig
            settings={settings}
            updateSettings={updateSettings}
            t={t}
          />
          <RadiusConfig
            settings={settings}
            updateSettings={updateSettings}
            t={t}
          />

          <div className='grid grid-cols-2 gap-4'>
            <FontSizeConfig
              settings={settings}
              updateSettings={updateSettings}
              t={t}
            />
            <FontTypeConfig
              settings={settings}
              updateSettings={updateSettings}
              t={t}
            />
          </div>

          <SidebarConfig
            variant={variant}
            setVariant={setVariant}
            defaultVariant={defaultVariant as any}
            t={t}
          />
          <LayoutConfig
            open={open}
            setOpen={setOpen}
            collapsible={collapsible}
            setCollapsible={setCollapsible}
            defaultCollapsible={defaultCollapsible as any}
            t={t}
          />
          <DirConfig
            settings={settings}
            updateSettings={updateSettings}
            t={t}
          />
        </div>
        <SheetFooter className='gap-2 sm:justify-start'>
          <Button
            variant='default'
            onClick={handleReset}
            aria-label={t('common.reset')}
            className='w-full'
          >
            {t('common.reset')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SectionTitle({
  title,
  showReset = false,
  onReset,
  className
}: {
  title: string;
  showReset?: boolean;
  onReset?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold',
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          size='icon'
          variant='secondary'
          className='size-4 rounded-full'
          onClick={onReset}
        >
          <RotateCcw className='size-3' />
        </Button>
      )}
    </div>
  );
}

function RadioGroupItem({
  item,
  children,
  className,
  value,
  isTheme = false
}: {
  item: {
    value: string;
    label: string;
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  };
  children?: React.ReactNode;
  className?: string;
  value?: string;
  isTheme?: boolean;
}) {
  return (
    <Item
      value={item.value}
      className={cn(
        'group relative cursor-pointer outline-none',
        'transition duration-200 ease-in',
        className
      )}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          'ring-border relative overflow-hidden rounded-[6px] ring-[1px]',
          'group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-xl',
          'group-focus-visible:ring-2'
        )}
        role='img'
        aria-hidden='false'
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn(
            'fill-primary z-10 size-6 stroke-white',
            'group-data-[state=unchecked]:hidden',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
          aria-hidden='true'
        />
        <div className='bg-muted/20 aspect-[16/10] w-full'>
          <item.icon
            className={cn(
              'h-full w-full object-contain',
              !isTheme &&
                'fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground'
            )}
            aria-hidden='true'
          />
        </div>
      </div>
      <div
        className='mt-1 text-center text-xs font-medium'
        id={`${item.value}-description`}
        aria-live='polite'
      >
        {item.label}
      </div>
    </Item>
  );
}

function ThemeConfig({ theme, setTheme, defaultTheme, t }: any) {
  return (
    <div>
      <SectionTitle
        title={t('settings.sections.theme')}
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
      />
      <Radio
        value={theme}
        onValueChange={setTheme}
        className='grid w-full grid-cols-3 gap-4'
        aria-label='Select theme preference'
        aria-describedby='theme-description'
      >
        {[
          {
            value: 'system',
            label: t('settings.theme.system'),
            icon: IconThemeSystem
          },
          {
            value: 'light',
            label: t('settings.theme.light'),
            icon: IconThemeLight
          },
          {
            value: 'dark',
            label: t('settings.theme.dark'),
            icon: IconThemeDark
          }
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
    </div>
  );
}

function MainColorConfig({ settings, updateSettings, t }: any) {
  const colors = [
    { name: 'blue', label: t('settings.colors.blue'), bg: 'bg-blue-600' },
    { name: 'cyan', label: t('settings.colors.cyan'), bg: 'bg-cyan-600' },
    { name: 'purple', label: t('settings.colors.purple'), bg: 'bg-purple-600' },
    { name: 'violet', label: t('settings.colors.violet'), bg: 'bg-violet-600' },
    { name: 'green', label: t('settings.colors.green'), bg: 'bg-green-600' },
    { name: 'amber', label: t('settings.colors.amber'), bg: 'bg-amber-600' },
    { name: 'rose', label: t('settings.colors.rose'), bg: 'bg-rose-600' },
    { name: 'orange', label: t('settings.colors.orange'), bg: 'bg-orange-600' },
    { name: 'default', label: t('settings.colors.default'), bg: 'bg-zinc-600' }
  ];
  const defaultColor = 'blue';

  return (
    <div>
      <SectionTitle
        title={t('settings.sections.mainColor')}
        showReset={settings.themeColor !== defaultColor}
        onReset={() => updateSettings({ themeColor: defaultColor })}
      />
      <div className='flex items-center justify-center gap-2 overflow-x-auto py-2'>
        {colors.map((color) => {
          const isActive = settings.themeColor === color.name;
          return (
            <Button
              key={color.name}
              variant='outline'
              size='icon'
              onClick={() => updateSettings({ themeColor: color.name })}
              className={cn(
                'size-6 shrink-0 overflow-hidden rounded-full transition-all',
                isActive && 'ring-primary border-primary ring-2 ring-offset-2'
              )}
            >
              <div className={cn('size-full', color.bg)} />
              <span className='sr-only'>{color.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function RadiusConfig({ settings, updateSettings, t }: any) {
  const radiuses = [0, 0.3, 0.5, 0.75, 1.0];
  const defaultRadius = 0.5;

  return (
    <div>
      <SectionTitle
        title={t('settings.sections.radius')}
        showReset={settings.radius !== defaultRadius}
        onReset={() => updateSettings({ radius: defaultRadius })}
      />
      <div className='grid grid-cols-5 gap-2'>
        {radiuses.map((radius) => {
          return (
            <Button
              key={radius}
              variant='outline'
              size='sm'
              onClick={() => updateSettings({ radius: radius })}
              className={cn(
                isActive(settings.radius, radius) &&
                  'border-primary ring-primary ring-1'
              )}
            >
              {radius}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function FontSizeConfig({ settings, updateSettings, t }: any) {
  return (
    <div>
      <SectionTitle title={t('settings.sections.fontSize')} />
      <Select
        value={settings.fontSize.toString()}
        onValueChange={(val) => updateSettings({ fontSize: parseFloat(val) })}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('settings.placeholders.selectSize')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='0.75'>
            {t('settings.fontSize.extraSmall')}
          </SelectItem>
          <SelectItem value='0.875'>{t('settings.fontSize.small')}</SelectItem>
          <SelectItem value='1'>{t('settings.fontSize.medium')}</SelectItem>
          <SelectItem value='1.125'>{t('settings.fontSize.large')}</SelectItem>
          <SelectItem value='1.25'>
            {t('settings.fontSize.extraLarge')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function FontTypeConfig({ settings, updateSettings, t }: any) {
  return (
    <div>
      <SectionTitle title={t('settings.sections.fontType')} />
      <Select
        value={settings.fontType}
        onValueChange={(val) => updateSettings({ fontType: val })}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('settings.placeholders.selectFont')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='sans'>{t('settings.fontType.inter')}</SelectItem>
          <SelectItem value='mono'>
            {t('settings.fontType.jetBrainsMono')}
          </SelectItem>
          <SelectItem value='cairo'>{t('settings.fontType.cairo')}</SelectItem>
          <SelectItem value='cairo-play'>
            {t('settings.fontType.cairoPlay')}
          </SelectItem>
          <SelectItem value='amiri'>{t('settings.fontType.amiri')}</SelectItem>
          <SelectItem value='noto-naskh'>
            {t('settings.fontType.notoNaskh')}
          </SelectItem>
          <SelectItem value='tajawal'>
            {t('settings.fontType.tajawal')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function SidebarConfig({ variant, setVariant, defaultVariant, t }: any) {
  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title={t('settings.sections.sidebar')}
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
      />
      <Radio
        value={variant}
        onValueChange={setVariant}
        className='grid w-full grid-cols-3 gap-4'
        aria-label='Select sidebar style'
        aria-describedby='sidebar-description'
      >
        {[
          {
            value: 'inset',
            label: t('settings.sidebar.inset'),
            icon: IconSidebarInset
          },
          {
            value: 'floating',
            label: t('settings.sidebar.floating'),
            icon: IconSidebarFloating
          },
          {
            value: 'sidebar',
            label: t('settings.sidebar.sidebar'),
            icon: IconSidebarSidebar
          }
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
    </div>
  );
}

function LayoutConfig({
  open,
  setOpen,
  collapsible,
  setCollapsible,
  defaultCollapsible,
  t
}: any) {
  const radioState = open ? 'default' : collapsible;

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title={t('settings.sections.layout')}
        showReset={radioState !== 'default'}
        onReset={() => {
          setOpen(true);
          setCollapsible(defaultCollapsible);
        }}
      />
      <Radio
        value={radioState}
        onValueChange={(v) => {
          if (v === 'default') {
            setOpen(true);
            return;
          }
          setOpen(false);
          setCollapsible(v as any);
        }}
        className='grid w-full grid-cols-3 gap-4'
        aria-label='Select layout style'
        aria-describedby='layout-description'
      >
        {[
          {
            value: 'default',
            label: t('settings.layout.default'),
            icon: IconLayoutDefault
          },
          {
            value: 'icon',
            label: t('settings.layout.compact'),
            icon: IconLayoutCompact
          },
          {
            value: 'offcanvas',
            label: t('settings.layout.fullLayout'),
            icon: IconLayoutFull
          }
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
    </div>
  );
}

function DirConfig({ settings, updateSettings, t }: any) {
  const defaultDir = 'rtl';
  return (
    <div>
      <SectionTitle
        title={t('settings.sections.direction')}
        showReset={defaultDir !== settings.direction}
        onReset={() => updateSettings({ direction: defaultDir })}
      />
      <Radio
        value={settings.direction}
        onValueChange={(val) =>
          updateSettings({ direction: val as 'ltr' | 'rtl' })
        }
        className='grid w-full grid-cols-2 gap-4'
        aria-label='Select site direction'
        aria-describedby='direction-description'
      >
        {[
          {
            value: 'ltr',
            label: t('settings.direction.ltr'),
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='ltr' {...props} />
            )
          },
          {
            value: 'rtl',
            label: t('settings.direction.rtl'),
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='rtl' {...props} />
            )
          }
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
    </div>
  );
}

function isActive(value: any, target: any) {
  return value === target;
}

const THEME_PREVIEW_COLORS: Record<
  string,
  { bg: string; sidebar: string; accent: string; primary: string }
> = {
  claude: {
    bg: 'bg-orange-50',
    sidebar: 'bg-orange-100',
    accent: 'bg-orange-500',
    primary: 'bg-orange-600'
  },
  neobrutualism: {
    bg: 'bg-yellow-50',
    sidebar: 'bg-yellow-200',
    accent: 'bg-yellow-400',
    primary: 'bg-black'
  },
  supabase: {
    bg: 'bg-emerald-950',
    sidebar: 'bg-emerald-900',
    accent: 'bg-emerald-400',
    primary: 'bg-emerald-500'
  },
  vercel: {
    bg: 'bg-white',
    sidebar: 'bg-gray-50',
    accent: 'bg-gray-200',
    primary: 'bg-black'
  },
  reading: {
    bg: 'bg-amber-50',
    sidebar: 'bg-amber-100/80',
    accent: 'bg-amber-200',
    primary: 'bg-amber-800'
  },
  notebook: {
    bg: 'bg-amber-50',
    sidebar: 'bg-amber-100',
    accent: 'bg-amber-200',
    primary: 'bg-amber-800'
  }
};

function ThemePresetConfig({
  activeTheme,
  setActiveTheme,
  t
}: {
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  t: any;
}) {
  return (
    <div>
      <SectionTitle
        title={t('settings.sections.themePreset') || 'Theme Preset'}
        showReset={activeTheme !== DEFAULT_THEME}
        onReset={() => setActiveTheme(DEFAULT_THEME)}
      />
      <div className='grid grid-cols-3 gap-3'>
        {THEMES.map((themeItem) => {
          const isSelected = activeTheme === themeItem.value;
          const colors =
            THEME_PREVIEW_COLORS[themeItem.value] ||
            THEME_PREVIEW_COLORS.vercel;
          return (
            <button
              key={themeItem.value}
              onClick={() => setActiveTheme(themeItem.value)}
              className={cn(
                'group relative flex cursor-pointer flex-col items-center gap-1.5 rounded-lg p-1.5 transition-all duration-200',
                'ring-border hover:ring-primary/50 ring-1',
                isSelected && 'ring-primary shadow-md ring-2'
              )}
            >
              {isSelected && (
                <CircleCheck
                  className='fill-primary absolute -top-1.5 -right-1.5 z-10 size-4 stroke-white'
                  aria-hidden='true'
                />
              )}
              {/* Mini preview card */}
              <div
                className={cn(
                  'border-border/50 aspect-4/3 w-full overflow-hidden rounded-md border',
                  colors.bg
                )}
              >
                <div className='flex h-full'>
                  {/* Mini sidebar */}
                  <div
                    className={cn(
                      'border-border/30 h-full w-1/4 border-r',
                      colors.sidebar
                    )}
                  >
                    <div className='space-y-1 p-1'>
                      <div
                        className={cn(
                          'h-1 w-full rounded-full',
                          colors.primary
                        )}
                      />
                      <div
                        className={cn(
                          'h-1 w-3/4 rounded-full opacity-40',
                          colors.accent
                        )}
                      />
                      <div
                        className={cn(
                          'h-1 w-3/4 rounded-full opacity-40',
                          colors.accent
                        )}
                      />
                    </div>
                  </div>
                  {/* Mini content */}
                  <div className='flex-1 space-y-1 p-1.5'>
                    <div
                      className={cn('h-1.5 w-2/3 rounded-full', colors.primary)}
                    />
                    <div
                      className={cn(
                        'h-1 w-full rounded-full opacity-30',
                        colors.accent
                      )}
                    />
                    <div
                      className={cn(
                        'h-1 w-5/6 rounded-full opacity-30',
                        colors.accent
                      )}
                    />
                    <div
                      className={cn(
                        'mt-1 h-3 w-1/3 rounded-sm',
                        colors.primary
                      )}
                    />
                  </div>
                </div>
              </div>
              <span
                className={cn(
                  'text-[10px] leading-none font-medium',
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {themeItem.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
