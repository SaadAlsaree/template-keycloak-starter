'use client';

import { ReactNode } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Autocomplete } from '@/components/ui/autocomplete';
import { BaseFormFieldProps } from '@/types/base-form';
import { ApiError } from '@/types/api-responses';

interface FormAutocompleteProps<
  T,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  data: T[] | undefined;
  isLoading: boolean;
  error?: ApiError | Error | null;
  renderOption: (item: T) => ReactNode;
  getDisplayValue?: (item: T) => string;
  onSelect: (item: T) => void;
  icon?: ReactNode;
  placeholder?: string;
  emptyMessage?: string;
}

function FormAutocomplete<
  T,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  data,
  isLoading,
  error,
  renderOption,
  getDisplayValue,
  onSelect,
  icon,
  placeholder = 'Search...',
  emptyMessage = 'No results found'
}: FormAutocompleteProps<T, TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className='ml-1 text-red-500'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className={disabled ? 'pointer-events-none opacity-50' : ''}>
              <Autocomplete<T>
                value={field.value as string}
                onChange={field.onChange}
                onSelect={onSelect}
                data={data}
                isLoading={isLoading}
                error={error}
                renderOption={renderOption}
                getDisplayValue={getDisplayValue}
                icon={icon}
                placeholder={placeholder}
                emptyMessage={emptyMessage}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormAutocomplete };
