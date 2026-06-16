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
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap/minimal-tiptap';
import { BaseFormFieldProps } from '@/types/base-form';
import type { Content } from '@tiptap/react';

interface FormMinimalTiptapEditorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  placeholder?: string;
  editorContentClassName?: string;
  output?: 'html' | 'json' | 'text';
  editable?: boolean;
  editorClassName?: string;
  throttleDelay?: number;
  autofocus?: boolean;
  immediatelyRender?: boolean;
  shouldRerenderOnTransaction?: boolean;
}

function FormMinimalTiptapEditor<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required,
  placeholder,
  disabled,
  className,
  editorContentClassName,
  output = 'html',
  editable = true,
  editorClassName,
  throttleDelay,
  autofocus,
  immediatelyRender,
  shouldRerenderOnTransaction
}: FormMinimalTiptapEditorProps<TFieldValues, TName>) {
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
            <MinimalTiptapEditor
              value={field.value as Content}
              onChange={field.onChange}
              className={editorClassName}
              editorContentClassName={editorContentClassName}
              output={output}
              placeholder={placeholder}
              editable={disabled !== undefined ? !disabled : editable}
              throttleDelay={throttleDelay}
              autofocus={autofocus}
              immediatelyRender={immediatelyRender}
              shouldRerenderOnTransaction={shouldRerenderOnTransaction}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormMinimalTiptapEditor };
