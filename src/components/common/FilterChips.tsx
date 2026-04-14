import { cn } from '@/lib/utils';

export interface FilterChipOption<T extends string = string> {
  value: T;
  label: string;
  count?: number;
}

interface FilterChipsProps<T extends string = string> {
  options: FilterChipOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
  className?: string;
}

const FilterChips = <T extends string>({
  options,
  activeValue,
  onChange,
  className,
}: FilterChipsProps<T>) => {
  return (
    <div className={cn('flex flex-wrap justify-center gap-3', className)}>
      {options.map((option) => {
        const isActive = option.value === activeValue;

        return (
          <button
            type="button"
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-medium transition-all',
              isActive
                ? 'bg-safari text-white'
                : 'bg-secondary text-foreground hover:bg-safari/10 hover:text-safari',
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="ml-1.5 text-xs opacity-70">({option.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
