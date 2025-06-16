import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  min,
  max,
  step,
  prefix,
  suffix,
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          className={`
            block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 
            focus:border-transparent transition-colors
            ${prefix ? 'pl-12' : ''}
            ${suffix ? 'pr-12' : ''}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;