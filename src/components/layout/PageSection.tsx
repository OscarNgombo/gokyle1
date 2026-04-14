import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageSectionProps extends ComponentPropsWithoutRef<'section'> {
  as?: ElementType;
  backgroundClassName?: string;
  containerClassName?: string;
  children: ReactNode;
}

const PageSection = ({
  as: Component = 'section',
  backgroundClassName,
  containerClassName,
  className,
  children,
  ...props
}: PageSectionProps) => {
  return (
    <Component className={cn('py-24', backgroundClassName, className)} {...props}>
      <div className={cn('container mx-auto px-6', containerClassName)}>{children}</div>
    </Component>
  );
};

export default PageSection;
