import { FC } from 'react';
import { FaPencil } from 'react-icons/fa6';

import { Button } from '@/shared/ui';

import css from './EditInfo.module.scss';
import { useAppDispatch } from '@/shared/hooks';
import { setQuizPage } from '@/entities/quiz';

type TEditInfoProps = {
  quizStep: number;
};

const EditInfo: FC<TEditInfoProps> = ({ quizStep }) => {
  const dispatch = useAppDispatch();

  const handleEdit = () => {
    dispatch(setQuizPage(quizStep));
  };

  return (
    <Button
      onClick={handleEdit}
      color="edit"
      styled="withIcon"
      className={css.buttonEdit}
    >
      <FaPencil />
      Edit
    </Button>
  );
};

export { EditInfo };
