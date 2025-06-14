import { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-2 border border-surface-300 rounded-button bg-white text-surface-900 placeholder-surface-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary';
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-surface-50' : '';

  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseClasses} ${disabledClasses} ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;