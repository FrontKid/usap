import { FC } from 'react';
import { GoQuestion } from 'react-icons/go';

import { Button } from '@/shared/ui';

import css from './UpdateMissingInfo.module.scss';
import { useAppDispatch } from '@/shared/hooks';
import { setQuizPage } from '@/entities/quiz';

type TUpdateMissingInfoProps = {
  quizStep: number;
};

const UpdateMissingInfo: FC<TUpdateMissingInfoProps> = ({ quizStep }) => {
  const dispatch = useAppDispatch();

  const handleUpdateInfo = () => {
    dispatch(setQuizPage(quizStep));
  };

  return (
    <Button
      onClick={handleUpdateInfo}
      styled="withIcon"
      className={css.updateInfo}
      color="updateInfo"
    >
      <GoQuestion />
      Update missing info
    </Button>
  );
};

export { UpdateMissingInfo };
