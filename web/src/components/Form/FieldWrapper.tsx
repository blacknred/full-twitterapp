import clsx from 'clsx';
import { FieldError } from 'react-hook-form';

interface IFieldWrapperProps {
  label?: string;
  className?: string;
  children: React.ReactNode;
  error?: FieldError | undefined;
  description?: string;
};

export type FieldWrapperPassThroughProps = Omit<IFieldWrapperProps, 'className' | 'children'>;

export const FieldWrapper = (props: IFieldWrapperProps) => {
  const { label, className, error, children } = props;
  
  return (
    <div>
      <label className={clsx('block text-sm font-medium text-gray-700', className)}>
        {label}
        <div className="mt-1">{children}</div>
      </label>
      {error?.message && (
        <div role="alert" aria-label={error.message} className="text-sm font-semibold text-red-500">
          {error.message}
        </div>
      )}
    </div>
  );
};
