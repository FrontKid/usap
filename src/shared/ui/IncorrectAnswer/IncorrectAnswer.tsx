import { FC } from 'react';

import css from './IncorrectAnswer.module.scss';

type TIncorrectAnswerProps = object;

const IncorrectAnswer: FC<TIncorrectAnswerProps> = () => {
  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>We&apos;re Sorry</h2>

      <p className={css.text}>
        Apologies. Unfortunately, it appears that we might not be able to help
        you with you case based on your responses.
      </p>
    </div>
  );
};

export { IncorrectAnswer };
