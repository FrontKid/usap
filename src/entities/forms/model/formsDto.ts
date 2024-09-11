/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';
import { FaFilePdf } from 'react-icons/fa';

interface IFormsDto {
  title: string;
  Icon: (props: any) => ReactNode;
}

const formsDto: IFormsDto[] = [
  {
    title: 'I-130',
    Icon: FaFilePdf,
  },
  {
    title: 'I-130a',
    Icon: FaFilePdf,
  },
  {
    title: 'I-131',
    Icon: FaFilePdf,
  },
  {
    title: 'I-485',
    Icon: FaFilePdf,
  },
  {
    title: 'I-765',
    Icon: FaFilePdf,
  },
  {
    title: 'I-864',
    Icon: FaFilePdf,
  },
  {
    title: 'G-1145',
    Icon: FaFilePdf,
  },
];

export { formsDto };
