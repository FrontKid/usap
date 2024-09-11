import { FC } from 'react';

import { TTabs } from '@/entities/sidebar';

import { EditInfo, UpdateMissingInfo } from '@/features/summary';

import css from './Summary.module.scss';

type TSummaryProps = {
  list: TTabs[];
  incompleteQuizItems: string[];
};

const Summary: FC<TSummaryProps> = ({ list, incompleteQuizItems }) => {
  return (
    <>
      <h2 className={css.title}>Summary</h2>

      <ul className={css.list}>
        {list.slice(0, -1).map(el => (
          <li key={el.id} className={css.item}>
            <span className={css.itemTitle}>{el.title}</span>

            <div className={css.buttonWrapper}>
              {incompleteQuizItems.every(qId => !el.quizIds?.includes(qId)) ? (
                <>
                  <span className={css.buttonComplete}>Complete</span>
                  <EditInfo quizStep={el.quizStep} />
                </>
              ) : (
                <UpdateMissingInfo quizStep={el.quizStep} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export { Summary };
