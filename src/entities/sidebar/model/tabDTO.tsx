import { RiHome3Line } from 'react-icons/ri';
import { MdOutlinePeople, MdLock } from 'react-icons/md';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { IoIosPeople } from 'react-icons/io';
import { BiSolidPlaneAlt } from 'react-icons/bi';
import { HiMiniShoppingBag } from 'react-icons/hi2';
import { PiBank } from 'react-icons/pi';
import { HiDocumentDuplicate } from 'react-icons/hi';

import { ISponsorImmigrantPair } from '@/shared/types';
import { ITabDTO } from '../types/ITabDTO';
import { ETabRoutes } from '../types/ETabRoutes';

const getPairNames = () => {
  const applicantNicknams: ISponsorImmigrantPair = JSON.parse(
    // prettier-ignore
    localStorage.getItem('sponsorImmigrantPair')
      ?? '{"immigrantName": "immigrantName", "sponsorName": "sponsorName"}',
  );

  return applicantNicknams;
};

const applicants = getPairNames();

const tabDTO: ITabDTO[] = [
  {
    id: 1,
    title: 'Home',
    slug: ETabRoutes.HOME,
    Icon: <RiHome3Line style={{ fontSize: '1.4rem' }} />,
    tabs: [],
  },
  {
    id: 2,
    title: 'Eligibility Quiz',
    slug: ETabRoutes.ELIGIBILITY_QUIZ,
    Icon: <IoShieldCheckmarkOutline style={{ fontSize: '1.4rem' }} />,
    tabs: [
      {
        id: 1,
        title: 'Eligibility Quiz',
        slug: ETabRoutes.ELIGIBILITY_QUIZ,
        isActive: quizStep => quizStep <= 18,
        quizStep: 0,
      },
    ],
  },
  {
    id: 3,
    title: 'Basic Personal Info',
    slug: ETabRoutes.BASIC_PERSONAL_INFO,
    Icon: <MdOutlinePeople style={{ fontSize: '1.4rem' }} />,
    tabs: [
      {
        id: 1,
        title: 'Petition Information',
        slug: 'petition-information',
        isActive: quizStep => quizStep <= 1,
        quizStep: 0,
        quizIds: ['15', '16', '17'],
      },
      {
        id: 2,
        title: 'Marital History and Co-Habitation',
        slug: 'marital-history-and-co-habitation',
        isActive: quizStep => quizStep === 2,
        quizStep: 2,
        quizIds: ['18', '19'],
      },
      {
        id: 3,
        title: 'Children',
        slug: 'children',
        isActive: quizStep => quizStep === 3,
        quizStep: 3,
        quizIds: ['20'],
      },
      {
        id: 4,
        title: 'Identity & Contact',
        slug: 'identity-and-contact',
        isActive: quizStep => quizStep >= 4 && quizStep <= 12,
        quizStep: 4,
        quizIds: ['21', '22', '23', '24', '25', '26', '27', '28', '29'],
      },
      {
        id: 5,
        title: 'Address',
        slug: 'address',
        isActive: quizStep => quizStep > 12 && quizStep <= 17,
        quizStep: 13,
        quizIds: ['30', '31'],
      },
      {
        id: 6,
        title: 'Summary',
        slug: 'summary',
        isActive: quizStep => quizStep === 18,
        quizStep: 18,
        quizIds: [],
      },
    ],
  },
  {
    id: 4,
    title: 'Family and Marriage',
    slug: ETabRoutes.FAMILY_AND_MARRIAGE,
    Icon: <IoIosPeople style={{ fontSize: '1.4rem' }} />,
    tabs: [
      {
        id: 1,
        title: 'Marriage & Children Details',
        slug: 'marriage-and-children-details',
        isActive: quizStep => quizStep <= 2,
        quizStep: 0,
        quizIds: ['34'],
      },
      {
        id: 2,
        title: `Marital History - ${applicants.immigrantName}`,
        slug: `parents-${applicants.immigrantName?.toLowerCase()}`,
        isActive: quizStep => quizStep >= 3 && quizStep <= 4,
        quizStep: 3,
        quizIds: ['37'],
      },
      {
        id: 3,
        title: `Parents - ${applicants.immigrantName}`,
        slug: `address-history-${applicants.immigrantName?.toLowerCase()}`,
        isActive: quizStep => quizStep >= 5 && quizStep <= 8,
        quizStep: 5,
        quizIds: ['38', '39', '40', '41'],
      },
      {
        id: 4,
        title: `Address History - ${applicants.immigrantName}`,
        slug: `address-history-${applicants.immigrantName?.toLowerCase()}`,
        isActive: quizStep => quizStep >= 9 && quizStep <= 11,
        quizStep: 9,
        quizIds: ['42', '43', '44'],
      },
      {
        id: 5,
        title: `Marital History - ${applicants.sponsorName}`,
        slug: `address-history-${applicants.sponsorName?.toLowerCase()}`,
        isActive: quizStep => quizStep >= 12 && quizStep <= 13,
        quizStep: 12,
        quizIds: ['46'],
      },
      {
        id: 6,
        title: `Parents - ${applicants.sponsorName}`,
        slug: `address-history-${applicants.sponsorName?.toLowerCase()}`,
        isActive: quizStep => quizStep >= 14 && quizStep <= 17,
        quizStep: 14,
        quizIds: ['47', '48', '49', '50'],
      },
      {
        id: 7,
        title: `Address History - ${applicants.sponsorName}`,
        slug: `address-history-${applicants.sponsorName?.toLowerCase()}`,
        isActive: quizStep => quizStep === 18,
        quizStep: 18,
        quizIds: ['51'],
      },
      {
        id: 8,
        title: 'Summary',
        slug: 'summary',
        isActive: quizStep => quizStep === 19,
        quizStep: 19,
      },
    ],
  },
  {
    id: 5,
    title: 'Immigration & Travel',
    slug: ETabRoutes.IMMIGRATION_AND_TRAVEL,
    Icon: <BiSolidPlaneAlt style={{ fontSize: '1.4rem' }} />,
    tabs: [
      {
        id: 1,
        title: `Sponsorship History - ${applicants.sponsorName}`,
        slug: `sponsorship-history-${applicants.sponsorName?.toLowerCase()}`,
        isActive: quizStep => quizStep <= 1,
        quizStep: 0,
        quizIds: ['52'],
      },
      {
        id: 2,
        title: 'Arrival Into U.S',
        slug: 'arrival-into-U.S',
        isActive: quizStep => quizStep >= 2 && quizStep <= 4,
        quizStep: 2,
        quizIds: ['53', '54', '55'],
      },
      {
        id: 3,
        title: 'Pending Petition Details',
        slug: 'pending-petition-details',
        isActive: quizStep => quizStep === 5,
        quizStep: 5,
        quizIds: ['56'],
      },
      {
        id: 4,
        title: 'Advance Parole',
        slug: 'advance-parole',
        isActive: quizStep => quizStep === 6,
        quizStep: 6,
        quizIds: ['57'],
      },
      {
        id: 5,
        title: `Citizenship details - ${applicants.sponsorName}`,
        slug: 'citizenship-details',
        isActive: quizStep => quizStep === 7,
        quizStep: 7,
        quizIds: ['82'],
      },
      {
        id: 6,
        title: `Place of Filing`,
        slug: 'place-filing',
        isActive: quizStep => quizStep === 8,
        quizStep: 8,
        quizIds: ['83'],
      },
      {
        id: 7,
        title: 'Summary',
        slug: 'summary',
        isActive: quizStep => quizStep === 9,
        quizStep: 9,
      },
    ],
  },
  {
    id: 6,
    title: 'Employment',
    slug: ETabRoutes.EMPLOYMENT,
    Icon: <HiMiniShoppingBag style={{ fontSize: '1.4rem' }} />,
    tabs: [
      {
        id: 1,
        title: `Employment History - ${applicants.immigrantName}`,
        slug: `employment-history-${applicants.immigrantName?.toLowerCase()}`,
        isActive: quizStep => quizStep <= 2,
        quizStep: 0,
        quizIds: ['59', '60'],
      },
      {
        id: 2,
        title: `Employment History - ${applicants.sponsorName}`,
        slug: `employment-history-${applicants.sponsorName}`,
        isActive: quizStep => quizStep >= 3 && quizStep <= 4,
        quizStep: 3,
        quizIds: ['61', '62'],
      },
      {
        id: 3,
        title: 'Summary',
        slug: 'summary',
        isActive: quizStep => quizStep === 5,
        quizStep: 5,
      },
    ],
  },
  {
    id: 7,
    title: 'Financials',
    slug: ETabRoutes.FINANCIALS,
    Icon: <PiBank style={{ fontSize: '1.4rem' }} />,
    tabs: [
      {
        id: 1,
        title: 'Taxes',
        slug: 'taxes',
        isActive: quizStep => quizStep <= 3,
        quizStep: 0,
        quizIds: ['63', '64', '65'],
      },
      {
        id: 2,
        title: `Income of ${applicants.immigrantName} and ${applicants.sponsorName}`,
        slug: `income-of-${applicants.immigrantName}-and-${applicants.sponsorName}`,
        isActive: quizStep => quizStep === 4,
        quizStep: 4,
        quizIds: ['66'],
      },
      {
        id: 3,
        title: `Assets of ${applicants.immigrantName} and ${applicants.sponsorName}`,
        slug: `assets-of-${applicants.immigrantName}-and-${applicants.sponsorName}`,
        isActive: quizStep => quizStep === 5,
        quizStep: 5,
        quizIds: ['67'],
      },
      {
        id: 4,
        title: 'Social Security No. & Assets',
        slug: 'social-security-no-and-assets',
        isActive: quizStep => quizStep === 6,
        quizStep: 6,
        quizIds: ['68'],
      },
      {
        id: 5,
        title: 'Summary',
        slug: 'summary',
        isActive: quizStep => quizStep === 7,
        quizStep: 7,
      },
    ],
  },
  {
    id: 8,
    title: 'Disclaimer',
    slug: ETabRoutes.DISCLAIMER,
    Icon: <MdLock style={{ fontSize: '1.4rem' }} />,
    tabs: [
      {
        id: 1,
        title: 'Organizations',
        slug: 'organizations',
        isActive: quizStep => quizStep <= 2,
        quizStep: 0,
      },
      {
        id: 2,
        title: 'Immigration Declarations',
        slug: 'immigration-declarations',
        isActive: quizStep => quizStep >= 3 && quizStep <= 4,
        quizStep: 3,
      },
      {
        id: 3,
        title: 'Conduct',
        slug: 'conduct',
        isActive: quizStep => quizStep >= 5 && quizStep <= 7,
        quizStep: 5,
      },
      {
        id: 4,
        title: 'Education',
        slug: 'education',
        isActive: quizStep => quizStep === 8,
        quizStep: 8,
      },
      {
        id: 5,
        title: 'Special Accommodations',
        slug: 'special-accommodations',
        isActive: quizStep => quizStep === 9,
        quizStep: 9,
      },
      {
        id: 6,
        title: 'Summary',
        slug: 'summary',
        isActive: quizStep => quizStep === 10,
        quizStep: 10,
      },
    ],
  },
  {
    id: 9,
    title: 'Miscellaneous',
    slug: ETabRoutes.MISCELLANEOUS,
    Icon: <HiDocumentDuplicate style={{ fontSize: '1.4rem' }} />,
    tabs: [
      {
        id: 1,
        title: `Application Assistance - ${applicants.immigrantName}`,
        slug: `application-assistance-${applicants.immigrantName?.toLowerCase()}`,
        isActive: quizStep => quizStep <= 1,
        quizStep: 0,
      },
      {
        id: 2,
        title: `Application Assistance - ${applicants.sponsorName}`,
        slug: `application-assistance-${applicants.sponsorName?.toLowerCase()}`,
        isActive: quizStep => quizStep === 2,
        quizStep: 2,
      },
      {
        id: 3,
        title: 'Summary',
        slug: 'summary',
        isActive: quizStep => quizStep === 3,
        quizStep: 3,
      },
    ],
  },
];

export { tabDTO };
