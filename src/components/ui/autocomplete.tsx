import { useState, useRef, useEffect, ReactNode } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/minimal-tiptap/components/spinner';
import { Search } from 'lucide-react';
import { ApiError } from '@/types/api-responses';

interface AutocompleteProps<T> {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: T) => void;
  data: T[] | undefined;
  isLoading: boolean;
  error?: ApiError | Error | null;
  renderOption: (item: T) => ReactNode;
  getDisplayValue?: (item: T) => string;
  icon?: ReactNode;
  placeholder?: string;
  emptyMessage?: string;
}

export function Autocomplete<T>({
  value,
  onChange,
  onSelect,
  data,
  isLoading,
  error,
  renderOption,
  getDisplayValue,
  icon,
  placeholder = 'Search...',
  emptyMessage = 'No results found'
}: AutocompleteProps<T>) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelect = (item: T) => {
    if (getDisplayValue) {
      onChange(getDisplayValue(item));
    }
    onSelect(item);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative w-full' ref={dropdownRef}>
      <InputGroup className='' dir='rtl'>
        <InputGroupInput
          placeholder={placeholder}
          onChange={handleSearch}
          value={value}
          onFocus={() => setIsDropdownOpen(true)}
        />
        <InputGroupAddon>
          {icon || <Search className='text-primary h-4 w-4 opacity-50' />}
        </InputGroupAddon>
        {isLoading && (
          <InputGroupAddon align='inline-end'>
            <Spinner />
          </InputGroupAddon>
        )}
      </InputGroup>

      {isDropdownOpen && value && (
        <div
          className='bg-popover text-popover-foreground absolute top-full right-0 left-0 z-50 mt-1 rounded-md border shadow-md outline-none'
          dir='rtl'
        >
          {error && (
            <div className='text-destructive p-4 text-sm'>
              {(error as Error).message ||
                (error as ApiError).description ||
                'An error occurred'}
            </div>
          )}

          {data && data.length > 0 ? (
            <ul className='max-h-60 overflow-auto p-1'>
              {data.map((item, index) => (
                <li
                  // If items have an `id`, it's generally best to use it as key,
                  // but since this is generic, we'll fall back to index if not provided.
                  // Provide a key prop locally in `renderOption` if you want a cleaner DOM error.
                  key={(item as any).id || index}
                  className='hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer flex-col items-start rounded-sm px-2 py-1.5 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50'
                  onClick={() => handleSelect(item)}
                >
                  {renderOption(item)}
                </li>
              ))}
            </ul>
          ) : !isLoading ? (
            <div className='text-muted-foreground p-4 text-sm'>
              {emptyMessage}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
