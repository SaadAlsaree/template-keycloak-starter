'use client';

import { FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText
} from '@/components/ui/input-group';
import { BaseFormFieldProps } from '@/types/base-form';
import React from 'react';

interface FormInputGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  // Use startText/endText for Strings or Icons that should be styled naturally inside the group
  startText?: React.ReactNode;
  endText?: React.ReactNode;
  // Use startAction/endAction for Custom Elements like InputGroupButton or other Buttons
  startAction?: React.ReactNode;
  endAction?: React.ReactNode;
}

function FormInputGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required,
  type = 'text',
  placeholder,
  step,
  min,
  max,
  disabled,
  className,
  startText,
  endText,
  startAction,
  endAction
}: FormInputGroupProps<TFieldValues, TName>) {
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
            <InputGroup>
              {(startText || startAction) && (
                <InputGroupAddon align='inline-start'>
                  {startText && <InputGroupText>{startText}</InputGroupText>}
                  {startAction}
                </InputGroupAddon>
              )}

              <InputGroupInput
                type={type}
                placeholder={placeholder}
                step={step}
                min={min}
                max={max}
                disabled={disabled}
                {...field}
                onChange={(e) => {
                  if (type === 'number') {
                    const value = e.target.value;
                    field.onChange(
                      value === '' ? undefined : parseFloat(value)
                    );
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
              />

              {(endText || endAction) && (
                <InputGroupAddon align='inline-end'>
                  {endText && <InputGroupText>{endText}</InputGroupText>}
                  {endAction}
                </InputGroupAddon>
              )}
            </InputGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormInputGroup };
