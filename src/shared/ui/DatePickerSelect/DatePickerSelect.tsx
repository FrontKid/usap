/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';

import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import css from './DatePickerSelect.module.scss';

type TDatePickerSelectProps = {
  title: string;
  initialDate: string;
  value?: string;
  isDisabled?: boolean;
  styles?: any;
  onClick: (formattedDate: string) => void;
};

const DatePickerSelect: FC<TDatePickerSelectProps> = ({
  title = '',
  initialDate,
  value = '',
  styles,
  isDisabled = false,
  onClick = () => {},
}) => {
  const selectedDate = initialDate
    ? (() => {
        const [month, day, year] = initialDate.split('/');

        return new Date(+year, +month - 1, +day);
      })()
    : null;

  return (
    <div style={styles}>
      <span className={css.title}>{title}</span>
      <div className={css.wrapper}>
        <FaRegCalendarAlt className={css.calendarIcon} />
        <DatePicker
          className={css.datePicker}
          wrapperClassName={css.wrapperDatePicker}
          selected={selectedDate}
          disabled={isDisabled}
          value={value || undefined}
          maxDate={new Date()}
          onChange={date => {
            // prettier-ignore
            const formattedDate
              = date?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }) ?? '';

            onClick(formattedDate);
          }}
        />
      </div>
    </div>
  );
};

export { DatePickerSelect };
