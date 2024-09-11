import { FC, ReactNode } from 'react';
import cn from 'classnames';

import css from './Textarea.module.scss';

type TTextareaProps = {
  placeholder?: string;
  className?: string;
  name: string;
  label?: ReactNode;
  defaultValue: string;
  textareaStyles?: string;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
  labelStyles?: string;
};

const Textarea: FC<TTextareaProps> = ({
  name,
  placeholder = '',
  className = '',
  label,
  defaultValue,
  textareaStyles = '',
  labelStyles = '',
  onBlur = () => {},
}) => {
  return (
    <label className={cn(className, css.labelWrapper)}>
      {label && <span className={cn(css.label, labelStyles)}>{label}</span>}
      <textarea
        defaultValue={defaultValue}
        onBlur={onBlur}
        className={cn(css.textarea, textareaStyles)}
        placeholder={placeholder}
        name={name}
      />
    </label>
  );
};

export { Textarea };
