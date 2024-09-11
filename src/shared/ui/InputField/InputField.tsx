import { FC, ReactNode } from 'react';
import { Field, useField } from 'formik';
import cn from 'classnames';

import { TAutoComplete, TInputType } from './types';

import css from './InputField.module.scss';
import { capitalizeLetter } from '@/shared/utils';

type TInputFieldProps = {
  placeholder?: string;
  classNames?: string;
  name: string;
  label?: ReactNode;
  autoComplete?: TAutoComplete;
  className?: string;
  children?: ReactNode;
  childrenWrapper?: string;
  wrapperContainer?: string;
  labelWrapper?: string;
  type?: TInputType;
  isRounded?: boolean;
  errorClassname?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  isCapitalize?: boolean;
};

const InputField: FC<TInputFieldProps> = ({
  placeholder = '',
  classNames = '',
  childrenWrapper = '',
  errorClassname = '',
  wrapperContainer = '',
  className = '',
  labelWrapper = '',
  name = '',
  autoComplete = 'on',
  disabled = false,
  label = null,
  value = '',
  isCapitalize = true,
  isRounded = false,
  onChange = () => {},
  onBlur = () => {},
  children = null,
  type = '',
}) => {
  const [field, meta] = useField({ name });

  const hasError = meta.touched && meta.error;

  return (
    <div className={cn(css.wrapper, wrapperContainer)}>
      <label className={cn(className, labelWrapper)}>
        {label && <span>{label}</span>}
        <Field
          type={type}
          disabled={disabled}
          name={name}
          autoComplete={autoComplete}
          className={cn(css.input, classNames, {
            [css.errorActive]: hasError,
            [css.isRounded]: isRounded,
          })}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            field.onBlur(e);
            onBlur(e);
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            field.onChange(e);

            if (e.target.name === field.name) {
              onChange(e);
            }
          }}
          value={
            isCapitalize
              ? capitalizeLetter(field.value) ?? capitalizeLetter(value)
              : field.value ?? value
          }
          placeholder={placeholder}
        />

        {type && <span className={childrenWrapper}>{children}</span>}
      </label>

      {hasError && field.name === name ? (
        <div className={cn(css.error, errorClassname)}>{meta.error}</div>
      ) : null}
    </div>
  );
};

export { InputField };
