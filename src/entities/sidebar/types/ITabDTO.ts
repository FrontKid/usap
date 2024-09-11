import { ReactNode } from 'react';
import { ETabRoutes } from './ETabRoutes';

type TTabs = {
  id: number;
  title: string;
  slug: string;
  isActive: (quizStep: number) => boolean;
  quizStep: number;
  quizIds?: string[];
};

interface ITabDTO {
  id: number;
  title: string;
  Icon: ReactNode;
  slug: ETabRoutes;
  tabs: TTabs[];
}

export { type TTabs };
export { type ITabDTO };
