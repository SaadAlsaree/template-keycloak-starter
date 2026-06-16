'use client';

import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { CalendarIcon, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  className
}: DateRangePickerProps) {
  const hasValue = value?.from || value?.to;

  const formatRange = (range: DateRange) => {
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    return formatDate(range.from ?? range.to);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'h-[30px] cursor-pointer gap-1.5 border-dashed px-2.5 text-[13px] font-normal',
            hasValue && 'bg-muted border-solid',
            className
          )}
        >
          <CalendarIcon className='size-3.5 shrink-0' />
          {hasValue ? (
            <span className='truncate'>{formatRange(value!)}</span>
          ) : (
            <span className='text-muted-foreground truncate'>
              {placeholder}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='flex items-center justify-between px-3 pt-3'>
          <span className='text-sm font-medium'>{placeholder}</span>
          {hasValue && (
            <button
              type='button'
              onClick={() => onChange(undefined)}
              className='text-muted-foreground hover:text-foreground cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100'
            >
              <XCircle className='size-3.5' />
            </button>
          )}
        </div>
        <Calendar
          mode='range'
          captionLayout='dropdown'
          selected={value ?? { from: undefined, to: undefined }}
          onSelect={onChange}
          numberOfMonths={2}
          fromYear={1970}
          toYear={new Date().getFullYear() + 10}
        />
      </PopoverContent>
    </Popover>
  );
}
