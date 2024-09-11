/* eslint-disable max-len */

import { IImmigrationFormPreference } from '../types';

const immigrationFormPreference: IImmigrationFormPreference[] = [
  {
    id: 1,
    text: 'Work permit (Form I-765: This allows you to work while greencard application is pending)',
    name: 'immigrationPreference',
  },
  {
    id: 2,
    text: 'Travel permit (Advanced Parole: Form I-131-This allows you to travel while greencard application is pending)',
    name: 'immigrationPreference',
  },
  {
    id: 3,
    text: 'Text based updates on the status of your application (G-1145)',
    name: 'immigrationPreference',
  },
  {
    id: 4,
    text: 'All of the above (Recommended)',
    name: 'immigrationPreference',
  },
];

export { immigrationFormPreference };
