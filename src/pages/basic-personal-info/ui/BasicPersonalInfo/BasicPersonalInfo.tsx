/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */

import { useEffect, useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import cn from 'classnames';

import {
  addIncompleteQuizItems,
  basicPersonalInfoSelector,
  quizNavigationSelector,
  resetQuizStep,
  setBasicPersonalInfo,
  setUserAnswers,
  userAnswerSelector,
} from '@/entities/quiz';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
  BooleanMultiplyQuestion,
  BooleanQuestion,
  Button,
  DatePickerSelect,
  IncorrectAnswer,
  InfoCard,
  InputField,
} from '@/shared/ui';

import family from '/assets/icons/Family.svg';
import {
  IQuestions,
  getCountry,
  getQuiz,
  getStates,
  getUserAnswers,
  updateUserInfo,
} from '@/shared/firebase/services';
import {
  ECollectionNames,
  EQuestionsDataType,
  EQuestionsTypeId,
  ISponsorImmigrantPair,
} from '@/shared/types';
import {
  TUserChoice,
  calculatePercentage,
  getAllAnswersCount,
  getCorrectAnswerToCountMetrics,
  getCurentUserAnswer,
  getIncompleteQuizAnswerIds,
  getInitialDateValue,
  getReplacedName,
  getValueForInput,
  storeAnswer,
} from '@/shared/utils';

import { CheckboxGroup } from '@/widgets/checkbox-group';
import { Summary } from '@/widgets/summary';

import {
  immigrationFormPreference,
  maritalHistoryDTO,
  raceDTO,
} from '@/entities/multi-select';

import { SelectField } from '@/shared/ui/SelectField';

import { hasLiveTogetherQuestionRender } from '../../utils/hasLiveTogetherQuestionRender';
import { isEADQuestionRender } from '../../utils/isEADQuestionRender';

import css from './BasicPersonalInfo.module.scss';
import { tabDTO } from '@/entities/sidebar';

const validationContactsSchema = Yup.object().shape({
  daytimeTelephone: Yup.string()
    .max(10, 'The maximum allowed number is 10')
    .matches(
      /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      'Invalid phone number format',
    ),
  mobileTelephone: Yup.string()
    .max(10, 'The maximum allowed number is 10')
    .matches(
      /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      'Invalid phone number format',
    ),
  emailAddress: Yup.string().email('Email must be valid'),
});

const validationWeightSchema = Yup.object().shape({
  weightPounds: Yup.number()
    .typeError('Weight must be a number')
    .positive('Weight must be a positive number')
    .max(500, 'Weight cannot exceed 500 pounds'), // Установите свой максимум, если нужно
});

const validationZipCodeSchema = Yup.object({
  ZIPCode: Yup.string().matches(/^\d{5}$/, 'Must be exactly 5 digits'),
});

const BasicPersonalInfo = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [currentUserChoiseId, setCurrentUserChoiseId] = useState('');

  const dispatch = useAppDispatch();
  // prettier-ignore
  const { basicPersonalData, TOTAL_FIELDS, incompleteQuizItems }
    = useAppSelector(basicPersonalInfoSelector);
  const { quizStep, isAnswerIncorrect } = useAppSelector(
    quizNavigationSelector,
  );

  const { userAnswers } = useAppSelector(userAnswerSelector);

  // prettier-ignore
  const [applicantNicknams]
    = useLocalStorage<ISponsorImmigrantPair>('sponsorImmigrantPair');
  const [userData, setUserData] = useLocalStorage<TUser>('user');
  const [, setChildCount] = useLocalStorage<string>('childCount');

  const userAnswersArray = Object.values(userAnswers);

  const initialNames: ISponsorImmigrantPair = {
    immigrantName: applicantNicknams?.immigrantName ?? 'immigrant',
    sponsorName: applicantNicknams?.sponsorName ?? 'sponsor',
  };

  const countOfNames = getValueForInput(
    userAnswersArray.find(el => el.questionId === '25')?.answer,
    'otherNamesCount',
  );

  // prettier-ignore
  const isCitizenMoreThan1
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '22')?.answer,
        'areYouCitizenMoreThan1',
      ) === 'Yes';

  // prettier-ignore
  const hasImmigrantOtherName
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '25')?.answer,
        'otherNames',
      ) === 'Yes';

  // prettier-ignore
  const hasSponsorOtherName
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '29')?.answer,
        'otherNames',
      ) === 'Yes';

  // prettier-ignore
  const hasSponsorOtherNameLength
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '29')?.answer,
        'otherNamesCount',
      );

  // prettier-ignore
  const isSponsorArmed
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '29')?.answer,
      'armedForces',
    ) === 'Yes';

  // prettier-ignore
  const isImmigrantAndSponsorAddressUSA
    = true;

  // getValueForInput(
  //   userAnswersArray.find(el => el.questionId === '29')?.answer,
  //   'armedForces',
  // ) === 'Yes'

  const handleUserAnswer = async (userChoice: TUserChoice) => {
    const CHILDREN_COUNT_ID = '20';

    if (userChoice.id === CHILDREN_COUNT_ID) {
      setChildCount(userChoice.answer);
    }

    await storeAnswer(
      userAnswers,
      userChoice,
      userData?.user ?? null,
      EQuestionsTypeId.BASIC_PERSONAL_INFO,
      dispatch,
      setUserAnswers,
    );

    const dataAnswers = await getUserAnswers(
      EQuestionsTypeId.BASIC_PERSONAL_INFO,
      userData?.user.id ?? '',
    );

    // prettier-ignore
    const [isAnswerRequredIds, updateForAnswerCount]
      = getCorrectAnswerToCountMetrics(basicPersonalData, dataAnswers);

    if (isAnswerRequredIds.includes(userChoice.id)) {
      updateUserInfo(
        userData?.user.id ?? '',
        {
          testsCompletedInfo: {
            ...userData?.user.testsCompletedInfo,
            basicPersonalInfo: calculatePercentage(
              getAllAnswersCount(updateForAnswerCount, basicPersonalData),
              TOTAL_FIELDS,
            ),
          },
        },
        setUserData,
      );
    }
  };

  const handleCheckboxAnswer = async (userChoice: TUserChoice) => {
    const questionsWithDataType = [
      '21',
      '22',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '81',
    ];

    setCurrentUserChoiseId(userChoice.id);

    await storeAnswer(
      userAnswers,
      userChoice,
      userData?.user ?? null,
      EQuestionsTypeId.BASIC_PERSONAL_INFO,
      dispatch,
      setUserAnswers,
      'multipleAnswer',
      questionsWithDataType.includes(userChoice.id)
        ? EQuestionsDataType.DATA
        : '',
    );

    const dataAnswers = await getUserAnswers(
      EQuestionsTypeId.BASIC_PERSONAL_INFO,
      userData?.user.id ?? '',
    );

    // prettier-ignore
    const [isAnswerRequredIds, updateForAnswerCount]
      = getCorrectAnswerToCountMetrics(basicPersonalData, dataAnswers);

    if (isAnswerRequredIds.includes(userChoice.id)) {
      updateUserInfo(
        userData?.user.id ?? '',
        {
          testsCompletedInfo: {
            ...userData?.user.testsCompletedInfo,
            basicPersonalInfo: calculatePercentage(
              getAllAnswersCount(updateForAnswerCount, basicPersonalData),
              TOTAL_FIELDS,
            ),
          },
        },
        setUserData,
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const quizData = (await getQuiz(
          ECollectionNames.QUESTIONS,
          EQuestionsTypeId.BASIC_PERSONAL_INFO,
        )) as IQuestions[];

        dispatch(setBasicPersonalInfo(quizData));
      } catch (error) {
        // console.log(error)
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const dataAnswers = await getUserAnswers(
          EQuestionsTypeId.BASIC_PERSONAL_INFO,
          userData?.user.id ?? '',
        );

        const incompleteQuizAnswerIds: string[] = getIncompleteQuizAnswerIds(
          Object.values(dataAnswers),
          basicPersonalData,
        );

        dispatch(setUserAnswers(dataAnswers));

        dispatch(addIncompleteQuizItems(incompleteQuizAnswerIds));
      } catch (error) {
        // console.log(error)
      }
    })();
  }, [
    dispatch,
    userData?.user.id,
    userAnswersArray.length,
    currentUserChoiseId,
  ]);

  useEffect(() => {
    (async () => {
      try {
        setCountries(await getCountry());
        setStates(await getStates());
      } catch (error) {
        // console.log(error)
      }
    })();
  }, []);

  useEffect(() => {
    dispatch(resetQuizStep());
  }, [dispatch]);

  if (isAnswerIncorrect) {
    return <IncorrectAnswer />;
  }

  return (
    <>
      {quizStep === 0 && (
        <InfoCard icon={family}>
          <h2>Let us start with some basic personal information of you both</h2>
          <p>
            We&apos;re diving deeper to gather all the essential information
            about you and your spouse. From previous immigration forms to
            biographical details, each piece is vital. This ensures that the
            information on the application forms is thorough. Make sure you
            provide us with accurate details, and let us do the heavy lifting
            for you.
          </p>
        </InfoCard>
      )}

      {quizStep === 1 && (
        <div className="quizWrapper">
          <div className={css.immigrationFormsWrapper}>
            <h2 className={css.title}>Immigration forms to be filed</h2>

            <BooleanQuestion
              currentUserAnswer={getCurentUserAnswer(
                quizStep - 1,
                userAnswersArray,
                basicPersonalData,
              )}
              data={basicPersonalData[quizStep - 1]}
              initialNames={initialNames}
              onClick={handleUserAnswer}
            />
          </div>

          <div className={css.immigrationPreferenceWrapper}>
            <h2 className={css.secondQuestion}>
              {basicPersonalData[quizStep]?.question}
            </h2>

            <CheckboxGroup
              checkedItems={getCurentUserAnswer(
                quizStep,
                userAnswersArray,
                basicPersonalData,
              )}
              questionId={basicPersonalData[quizStep]?.id}
              onClick={handleCheckboxAnswer}
              className={css.immigrationPreference}
              checkBoxDTO={immigrationFormPreference}
            />
          </div>

          {isEADQuestionRender(userAnswers, '16') && (
            <BooleanQuestion
              currentUserAnswer={getCurentUserAnswer(
                quizStep + 1,
                userAnswersArray,
                basicPersonalData,
              )}
              data={basicPersonalData[quizStep + 1]}
              initialNames={initialNames}
              onClick={handleUserAnswer}
            />
          )}
        </div>
      )}

      {quizStep === 2 && (
        <div className="quizWrapper">
          <div>
            <h2 className={css.title}>Marital History and Co-Habitation</h2>

            <h4 className={css.subTitle}>
              {getReplacedName(
                basicPersonalData[quizStep + 1]?.question,
                initialNames,
              )}
            </h4>

            <CheckboxGroup
              checkedItems={getCurentUserAnswer(
                quizStep + 1,
                userAnswersArray,
                basicPersonalData,
              )}
              questionId={basicPersonalData[quizStep + 1]?.id}
              onClick={handleCheckboxAnswer}
              className={css.maritalHistoryDTO}
              checkBoxDTO={maritalHistoryDTO}
            />
          </div>

          {hasLiveTogetherQuestionRender(userAnswers, '18') && (
            <BooleanQuestion
              currentUserAnswer={getCurentUserAnswer(
                quizStep + 2,
                userAnswersArray,
                basicPersonalData,
              )}
              data={basicPersonalData[quizStep + 2]}
              initialNames={initialNames}
              onClick={handleUserAnswer}
            />
          )}
        </div>
      )}

      {quizStep === 3 && (
        <div className="quizWrapper">
          <h2 className={css.title}>Tell us about your children</h2>

          <h4 className={css.subTitle}>
            {getReplacedName(
              basicPersonalData[quizStep + 2]?.question,
              initialNames,
            )}
          </h4>
          <SelectField
            className={css.childAgeSelect}
            list={['none', '1', '2', '3', '4', '5', '6', '7', '8', '9']}
            onChange={handleUserAnswer}
            question={basicPersonalData[quizStep + 2]}
            showDefaultOption
            defaultOption=""
            defaultValue={getCurentUserAnswer(
              quizStep + 2,
              userAnswersArray,
              basicPersonalData,
            )}
          />
        </div>
      )}

      {quizStep === 4 && (
        <div className="quizWrapper">
          <h4 className={css.title}>
            {getReplacedName(
              basicPersonalData[quizStep + 2]?.question,
              initialNames,
            )}
          </h4>

          <div className={css.contentWraper}>
            <Formik
              enableReinitialize
              initialValues={{
                [`${initialNames.immigrantName}FirstName`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'firstName',
                ),
                [`${initialNames.immigrantName}MiddleName`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'middleName',
                ),
                [`${initialNames.immigrantName}LastName`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'lastName',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={css.form}>
                  <InputField
                    label="First Name"
                    className={css.firstName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `firstName: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.immigrantName}FirstName`}
                  />
                  <InputField
                    label="Middle Name"
                    className={css.middleName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `middleName: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.immigrantName}MiddleName`}
                  />
                  <InputField
                    label="Last Name"
                    className={css.lastName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `lastName: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.immigrantName}LastName`}
                  />
                  <DatePickerSelect
                    title="Date of Birth (mm/dd/yyyy)"
                    initialDate={getInitialDateValue(
                      userAnswersArray,
                      '21',
                      'birthDate',
                    )}
                    onClick={date => {
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `birthDate: ${date}`,
                      });
                    }}
                  />
                </Form>
              )}
            </Formik>

            <BooleanMultiplyQuestion
              title="Sex"
              className={css.buttonWrapper}
              quizStep={quizStep + 2}
              answers={userAnswersArray}
              quizData={basicPersonalData}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="sex: Male"
              answerPositive="sex: Female"
            />

            <Formik
              enableReinitialize
              initialValues={{
                [`${initialNames.immigrantName}BirthCity`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'birthCity',
                ),
                [`${initialNames.immigrantName}StateBirth`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'stateBirth',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={css.form}>
                  <InputField
                    label="City or Town of Birth"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `birthCity: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.immigrantName}BirthCity`}
                  />

                  <InputField
                    label="State or Province of Birth"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `stateBirth: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.immigrantName}StateBirth`}
                  />
                  <div>
                    <span>Country of Birth</span>

                    <SelectField
                      list={countries}
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `countryBirth: ${e.answer}`,
                        })
                      }
                      question={basicPersonalData[quizStep + 2]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep + 2,
                          userAnswersArray,
                          basicPersonalData,
                        ),
                        'countryBirth',
                      )}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {quizStep === 5 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {getReplacedName(
              basicPersonalData[quizStep + 2]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={cn(css.buttonWrapper, css.quiz5Buttons)}
            title="Are you a citizen of more than 1 country?"
            quizStep={quizStep + 2}
            answers={userAnswersArray}
            quizData={basicPersonalData}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative="areYouCitizenMoreThan1: No"
            answerPositive="areYouCitizenMoreThan1: Yes"
          />

          <h4 className={cn(css.subTitle, css.nationalitiTitle)}>
            Enter the name of the country whose passport you used for your last
            entry into the USA in the &quot;Country of Citizenship-
            Primary&quot; box below
          </h4>

          <div className={css.nationalitySelect}>
            <span>Country of Citizenship - Primary</span>

            <SelectField
              showDefaultOption
              defaultOption=""
              list={countries}
              onChange={e =>
                handleCheckboxAnswer({
                  id: e.id,
                  answer: `countryBirthFirst: ${e.answer}`,
                })
              }
              question={basicPersonalData[quizStep + 2]}
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'countryBirthFirst',
              )}
            />
          </div>

          {isCitizenMoreThan1 && (
            <div className={css.nationalitySelect}>
              <span>Country of Citizenship - Secondary</span>

              <SelectField
                showDefaultOption
                defaultOption=""
                list={countries}
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `countryBirthSecondary: ${e.answer}`,
                  })
                }
                question={basicPersonalData[quizStep + 2]}
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'countryBirthSecondary',
                )}
              />
            </div>
          )}
        </div>
      )}

      {quizStep === 6 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {getReplacedName(
              basicPersonalData[quizStep + 2]?.question,
              initialNames,
            )}
          </h2>

          <BooleanQuestion
            currentUserAnswer={getCurentUserAnswer(
              quizStep + 2,
              userAnswersArray,
              basicPersonalData,
            )}
            data={basicPersonalData[quizStep + 2]}
            initialNames={initialNames}
            onClick={handleUserAnswer}
            positiveValue="Hispanic or Latino"
            negativeValue="NOT Hispanic or Latino"
            label="Ethnicity"
          />
        </div>
      )}

      {quizStep === 7 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {getReplacedName(
              basicPersonalData[quizStep + 2]?.question,
              initialNames,
            )}
          </h2>

          <CheckboxGroup
            checkedItems={getCurentUserAnswer(
              quizStep + 2,
              userAnswersArray,
              basicPersonalData,
            )}
            questionId={basicPersonalData[quizStep + 2]?.id}
            onClick={handleCheckboxAnswer}
            className={css.raceDTO}
            checkBoxDTO={raceDTO}
          />
        </div>
      )}

      {quizStep === 8 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {getReplacedName(
              basicPersonalData[quizStep + 2]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={cn(css.buttonWrapper, css.otherNames)}
            title="Have you ever used any other names?"
            quizStep={quizStep + 2}
            answers={userAnswersArray}
            quizData={basicPersonalData}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative="otherNames: No"
            answerPositive="otherNames: Yes"
          />

          {hasImmigrantOtherName && (
            <div className={css.otherNamesCount}>
              <span>How many other names have you used?</span>
              <SelectField
                list={['1', '2', '3']}
                className={css.otherNamesSelect}
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `otherNamesCount: ${e.answer}`,
                  })
                }
                question={basicPersonalData[quizStep + 2]}
                showDefaultOption
                defaultOption="Choose correct one"
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'otherNamesCount',
                )}
              />
            </div>
          )}
        </div>
      )}

      {quizStep === 9 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {getReplacedName(
              basicPersonalData[quizStep + 2]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            initialValues={{
              [`${initialNames.immigrantName}FamilyName1`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'familyName1',
              ),
              [`${initialNames.immigrantName}GivenName1`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'givenName1',
              ),
              [`${initialNames.immigrantName}MiddleName1`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'middleName1',
              ),
              [`${initialNames.immigrantName}FamilyName2`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'familyName2',
              ),
              [`${initialNames.immigrantName}GivenName2`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'givenName2',
              ),
              [`${initialNames.immigrantName}MiddleName2`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'middleName2',
              ),
              [`${initialNames.immigrantName}FamilyName3`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'familyName3',
              ),
              [`${initialNames.immigrantName}GivenName3`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'givenName3',
              ),
              [`${initialNames.immigrantName}MiddleName3`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'middleName3',
              ),
            }}
            validate={() => {}}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {({ handleBlur, submitForm }) => (
              <Form className={css.otherNamesFields}>
                {Array.from({ length: +countOfNames }, (_, i) => i).map(
                  (el, i) => (
                    <div key={`${el + i}`}>
                      <span className={css.subTitle}>
                        {`Other names used - ${i + 1}`}
                      </span>

                      <div>
                        <InputField
                          label="Family Name (Last Name)"
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: basicPersonalData[quizStep + 2]?.id,
                              answer: `familyName${i + 1}: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name={`${initialNames.immigrantName}FamilyName${i + 1}`}
                        />
                        <InputField
                          label="Given Name (First Name)"
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: basicPersonalData[quizStep + 2]?.id,
                              answer: `givenName${i + 1}: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name={`${initialNames.immigrantName}GivenName${i + 1}`}
                        />
                        <InputField
                          label="Middle Name"
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: basicPersonalData[quizStep + 2]?.id,
                              answer: `middleName${i + 1}: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name={`${initialNames.immigrantName}MiddleName${i + 1}`}
                        />
                      </div>
                    </div>
                  ),
                )}
              </Form>
            )}
          </Formik>
        </div>
      )}

      {quizStep === 10 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {getReplacedName(
              basicPersonalData[quizStep + 2]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.biographicNContact}>
            <div>
              <span>Height - ft</span>
              <SelectField
                showDefaultOption
                defaultOption="Choose correct one"
                list={['2', '3', '4', '5', '6', '7', '8']}
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `heightFt: ${e.answer}`,
                  })
                }
                question={basicPersonalData[quizStep + 2]}
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'heightFt',
                )}
              />
            </div>

            <div>
              <span>Height - Inches</span>

              <SelectField
                showDefaultOption
                defaultOption="Choose correct one"
                list={[
                  '0',
                  '1',
                  '2',
                  '3',
                  '4',
                  '5',
                  '6',
                  '7',
                  '8',
                  '9',
                  '10',
                  '11',
                ]}
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `heightInch: ${e.answer}`,
                  })
                }
                question={basicPersonalData[quizStep + 2]}
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'heightInch',
                )}
              />
            </div>

            <Formik
              initialValues={{
                weightPounds: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'weightPounds',
                ),
              }}
              validationSchema={validationWeightSchema}
              enableReinitialize
              validateOnBlur
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm, validateForm }) => (
                <Form className={css.form}>
                  <InputField
                    label="Weight - Pounds"
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2]?.id,
                          answer: `weightPounds: ${e.target.value}`,
                        });

                        handleBlur(e);
                        submitForm();
                      }
                    }}
                    name="weightPounds"
                  />
                </Form>
              )}
            </Formik>

            <div>
              <span>Eye Color</span>

              <SelectField
                showDefaultOption
                defaultOption="Choose correct one"
                list={[
                  'Black',
                  'Blue',
                  'Brown',
                  'Gray',
                  'Green',
                  'Hazel',
                  'Maroon',
                  'Pink',
                  'Unknown/Other',
                ]}
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `eyeColor: ${e.answer}`,
                  })
                }
                question={basicPersonalData[quizStep + 2]}
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'eyeColor',
                )}
              />
            </div>
            <div>
              <span>Hair Color</span>
              <SelectField
                showDefaultOption
                defaultOption="Choose correct one"
                list={[
                  'Bald(NoHair)',
                  'Black',
                  'Blond',
                  'Brown',
                  'Gray',
                  'Red',
                  'Sandy',
                  'White',
                  'Unknown/Other',
                ]}
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `hairColor: ${e.answer}`,
                  })
                }
                question={basicPersonalData[quizStep + 2]}
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'hairColor',
                )}
              />
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                daytimeTelephone: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'daytimeTelephone',
                ),
                mobileTelephone: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'mobileTelephone',
                ),
                emailAddress: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'emailAddress',
                ),
              }}
              validationSchema={validationContactsSchema}
              validateOnBlur
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm, validateForm }) => (
                <Form className={css.form}>
                  <InputField
                    label="Daytime telephone number"
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2]?.id,
                          answer: `daytimeTelephone: ${e.target.value}`,
                        });
                        submitForm();
                      }
                    }}
                    name="daytimeTelephone"
                  />
                  <InputField
                    label="Mobile telephone number (if any)"
                    placeholder="Leave blank if not applicable"
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2]?.id,
                          answer: `mobileTelephone: ${e.target.value}`,
                        });
                        submitForm();
                      }
                    }}
                    name="mobileTelephone"
                  />

                  <InputField
                    label="Email address (if any)"
                    isCapitalize={false}
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2]?.id,
                          answer: `emailAddress: ${e.target.value}`,
                        });
                        submitForm();
                      }
                    }}
                    name="emailAddress"
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {quizStep === 11 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {getReplacedName(
              basicPersonalData[quizStep + 2]?.question,
              initialNames,
            )}
          </h2>
          <div className={css.contentWraper}>
            <Formik
              enableReinitialize
              initialValues={{
                [`${initialNames.sponsorName}FirstName`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'firstName',
                ),
                [`${initialNames.sponsorName}MiddleName`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'middleName',
                ),
                [`${initialNames.sponsorName}LastName`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'lastName',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={cn(css.form, css.sponsorBiographicForm)}>
                  <InputField
                    label="First Name"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `firstName: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.sponsorName}FirstName`}
                  />
                  <InputField
                    label="Middle Name"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `middleName: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.sponsorName}MiddleName`}
                  />
                  <InputField
                    label="Last Name"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `lastName: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.sponsorName}LastName`}
                  />
                  <DatePickerSelect
                    title="Date of Birth (mm/dd/yyyy)"
                    initialDate={getInitialDateValue(
                      userAnswersArray,
                      '28',
                      'birthDate',
                    )}
                    onClick={date => {
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `birthDate: ${date}`,
                      });
                    }}
                  />
                </Form>
              )}
            </Formik>
            <BooleanMultiplyQuestion
              title="Sex"
              className={cn(
                css.buttonWrapper,
                css.sponsorBiographicButtonsWrapper,
              )}
              quizStep={quizStep + 2}
              answers={userAnswersArray}
              quizData={basicPersonalData}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerPositive="sex: Female"
              answerNegative="sex: Male"
            />

            <Formik
              enableReinitialize
              initialValues={{
                [`${initialNames.sponsorName}BirthCity`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'birthCity',
                ),
                [`${initialNames.sponsorName}StateBirth`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'stateBirth',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={css.form}>
                  <InputField
                    label="City or Town of Birth"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `birthCity: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.sponsorName}BirthCity`}
                  />
                  <InputField
                    label="State or Province of Birth"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `stateBirth: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.sponsorName}StateBirth`}
                  />

                  <div>
                    <span>Country of Birth</span>

                    <SelectField
                      list={countries}
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `countryBirth: ${e.answer}`,
                        })
                      }
                      question={basicPersonalData[quizStep + 2]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep + 2,
                          userAnswersArray,
                          basicPersonalData,
                        ),
                        'countryBirth',
                      )}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {quizStep === 12 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {getReplacedName(
              basicPersonalData[quizStep + 2]?.question,
              initialNames,
            )}
          </h2>
          <div
            className={cn(
              css.biographicNContact,
              css.biographicNContactSponsor,
            )}
          >
            <div>
              <span>Height - ft</span>
              <SelectField
                showDefaultOption
                defaultOption="Choose correct one"
                list={['2', '3', '4', '5', '6', '7', '8']}
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `heightFt: ${e.answer}`,
                  })
                }
                question={basicPersonalData[quizStep + 2]}
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'heightFt',
                )}
              />
            </div>
            <div>
              <span>Height - Inches</span>

              <SelectField
                showDefaultOption
                defaultOption="Choose correct one"
                list={[
                  '0',
                  '1',
                  '2',
                  '3',
                  '4',
                  '5',
                  '6',
                  '7',
                  '8',
                  '9',
                  '10',
                  '11',
                ]}
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `heightInch: ${e.answer}`,
                  })
                }
                question={basicPersonalData[quizStep + 2]}
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'heightInch',
                )}
              />
            </div>

            <Formik
              initialValues={{
                weightPounds: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'weightPounds',
                ),
              }}
              validationSchema={validationWeightSchema}
              enableReinitialize
              validateOnBlur
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm, validateForm }) => (
                <Form className={css.form}>
                  <InputField
                    label="Weight - Pounds"
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2]?.id,
                          answer: `weightPounds: ${e.target.value}`,
                        });

                        handleBlur(e);
                        submitForm();
                      }
                    }}
                    name="weightPounds"
                  />
                </Form>
              )}
            </Formik>
            <div>
              <span>Eye Color</span>

              <SelectField
                showDefaultOption
                defaultOption="Choose correct one"
                list={[
                  'Black',
                  'Blue',
                  'Brown',
                  'Gray',
                  'Green',
                  'Hazel',
                  'Maroon',
                  'Pink',
                  'Unknown/Other',
                ]}
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `eyeColor: ${e.answer}`,
                  })
                }
                question={basicPersonalData[quizStep + 2]}
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'eyeColor',
                )}
              />
            </div>
            <div>
              <span>Hair Color</span>
              <SelectField
                showDefaultOption
                defaultOption="Choose correct one"
                list={[
                  'Bald(NoHair)',
                  'Black',
                  'Blond',
                  'Brown',
                  'Gray',
                  'Red',
                  'Sandy',
                  'White',
                  'Unknown/Other',
                ]}
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `hairColor: ${e.answer}`,
                  })
                }
                question={basicPersonalData[quizStep + 2]}
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'hairColor',
                )}
              />
            </div>
          </div>
          <div className={css.sponsorBiographicWrapper}>
            <Formik
              enableReinitialize
              validationSchema={validationContactsSchema}
              initialValues={{
                daytimeTelephone: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'daytimeTelephone',
                ),
                mobileTelephone: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'mobileTelephone',
                ),
                emailAddress: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'emailAddress',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm, validateForm }) => (
                <Form className={cn(css.form, css.sponsorBiographicNContact)}>
                  <InputField
                    label="Daytime telephone number"
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2]?.id,
                          answer: `daytimeTelephone: ${e.target.value}`,
                        });
                        submitForm();
                      }
                    }}
                    name="daytimeTelephone"
                  />
                  <InputField
                    label="Mobile telephone number (if any)"
                    placeholder="Leave blank if not applicable"
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2]?.id,
                          answer: `mobileTelephone: ${e.target.value}`,
                        });
                        submitForm();
                      }
                    }}
                    name="mobileTelephone"
                  />

                  <InputField
                    label="Email address (if any)"
                    isCapitalize={false}
                    placeholder="Leave blank if not applicable"
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2]?.id,
                          answer: `emailAddress: ${e.target.value}`,
                        });
                        submitForm();
                      }
                    }}
                    name="emailAddress"
                  />
                </Form>
              )}
            </Formik>

            <h2
              style={{ marginBottom: '30px' }}
              className={css.subTitle}
            >{`What is ${initialNames.sponsorName}'s ethnicity?`}</h2>

            <BooleanMultiplyQuestion
              className={cn(css.buttonWrapper, css.sponsorEtnicity)}
              title="Ethnicity"
              quizStep={quizStep + 2}
              answers={userAnswersArray}
              quizData={basicPersonalData}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="ethnicity: NOT Hispanic or Latino"
              answerPositive="ethnicity: Hispanic or Latino"
            />

            <h2
              style={{ marginBottom: '30px' }}
              className={css.subTitle}
            >{`What is ${initialNames.sponsorName}'s race?`}</h2>

            <CheckboxGroup
              checkedItems={getCurentUserAnswer(
                quizStep + 2,
                userAnswersArray,
                basicPersonalData,
              )}
              questionId={basicPersonalData[quizStep + 2]?.id}
              onClick={handleCheckboxAnswer}
              className={cn(css.raceDTO, css.sponsorRace)}
              checkBoxDTO={raceDTO}
            />

            <BooleanMultiplyQuestion
              className={cn(
                css.buttonWrapper,
                css.otherNames,
                css.otherNamesSponsor,
              )}
              title="Have you ever used any other names?"
              quizStep={quizStep + 2}
              answers={userAnswersArray}
              quizData={basicPersonalData}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="otherNames: No"
              answerPositive="otherNames: Yes"
            />

            {hasSponsorOtherName && (
              <div
                className={cn(css.otherNamesCount, css.sponsorOtherNamesCount)}
              >
                <span>How many other names have you used?</span>
                <SelectField
                  list={['1', '2', '3']}
                  className={css.otherNamesSelect}
                  onChange={e =>
                    handleCheckboxAnswer({
                      id: e.id,
                      answer: `otherNamesCount: ${e.answer}`,
                    })
                  }
                  question={basicPersonalData[quizStep + 2]}
                  showDefaultOption
                  defaultOption="Choose correct one"
                  defaultValue={getValueForInput(
                    getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ),
                    'otherNamesCount',
                  )}
                />
              </div>
            )}

            {+hasSponsorOtherNameLength > 0 && hasSponsorOtherName && (
              <Formik
                enableReinitialize
                initialValues={{
                  familyName1: getValueForInput(
                    getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ),
                    'familyName1',
                  ),
                  givenName1: getValueForInput(
                    getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ),
                    'givenName1',
                  ),
                  middleName1: getValueForInput(
                    getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ),
                    'middleName1',
                  ),
                  familyName2: getValueForInput(
                    getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ),
                    'familyName2',
                  ),
                  givenName2: getValueForInput(
                    getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ),
                    'givenName2',
                  ),
                  middleName2: getValueForInput(
                    getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ),
                    'middleName2',
                  ),
                  familyName3: getValueForInput(
                    getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ),
                    'familyName3',
                  ),
                  givenName3: getValueForInput(
                    getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ),
                    'givenName3',
                  ),
                  middleName3: getValueForInput(
                    getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ),
                    'middleName3',
                  ),
                }}
                validate={() => {}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={() => {}}
              >
                {({ handleBlur, submitForm }) => (
                  <Form
                    className={cn(
                      css.otherNamesFields,
                      css.sponsorOtherNamesFields,
                    )}
                  >
                    {Array.from(
                      { length: +hasSponsorOtherNameLength },
                      (_, i) => i,
                    ).map((el, i) => (
                      <div key={`${el + i}`}>
                        <span className={css.subTitle}>
                          {`Other names used - ${i + 1}`}
                        </span>

                        <div>
                          <InputField
                            label="Family Name (Last Name)"
                            onBlur={e => {
                              handleBlur(e);
                              handleCheckboxAnswer({
                                id: basicPersonalData[quizStep + 2]?.id,
                                answer: `familyName${i + 1}: ${e.target.value}`,
                              });
                              submitForm();
                            }}
                            name={`familyName${i + 1}`}
                          />
                          <InputField
                            label="Given Name (First Name)"
                            onBlur={e => {
                              handleBlur(e);
                              handleCheckboxAnswer({
                                id: basicPersonalData[quizStep + 2]?.id,
                                answer: `givenName${i + 1}: ${e.target.value}`,
                              });
                              submitForm();
                            }}
                            name={`givenName${i + 1}`}
                          />
                          <InputField
                            label="Middle Name"
                            onBlur={e => {
                              handleBlur(e);
                              handleCheckboxAnswer({
                                id: basicPersonalData[quizStep + 2]?.id,
                                answer: `middleName${i + 1}: ${e.target.value}`,
                              });
                              submitForm();
                            }}
                            name={`middleName${i + 1}`}
                          />
                        </div>
                      </div>
                    ))}
                  </Form>
                )}
              </Formik>
            )}

            <h4 className={cn(css.subTitle, css.sponsorSubtitle)}>
              {`${initialNames.sponsorName}'s Armed Forces Status`}
            </h4>

            <div className={cn(css.buttonWrapper, css.sponsorButtonWrapper)}>
              <span>
                Current member of the U.S. armed forces or U.S. Coast Guard?
              </span>

              <div>
                <Button
                  isActive={
                    !getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ).includes('armedForces: Yes')
                  }
                  onClick={() =>
                    handleCheckboxAnswer({
                      id: basicPersonalData[quizStep + 2]?.id,
                      answer: 'armedForces: Yes',
                    })
                  }
                  className={css.button}
                >
                  Yes
                </Button>

                <Button
                  isActive={
                    !getCurentUserAnswer(
                      quizStep + 2,
                      userAnswersArray,
                      basicPersonalData,
                    ).includes('armedForces: No')
                  }
                  onClick={() =>
                    handleCheckboxAnswer({
                      id: basicPersonalData[quizStep + 2]?.id,
                      answer: 'armedForces: No',
                    })
                  }
                  className={css.button}
                >
                  No
                </Button>
              </div>
            </div>

            {isSponsorArmed && (
              <h4 className={css.subTitle}>
                {`Thank you for your service ${initialNames.sponsorName}!`}
              </h4>
            )}
          </div>
        </div>
      )}

      {quizStep === 13 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {`${initialNames.immigrantName}'s Mailing Address`}
          </h2>

          <BooleanMultiplyQuestion
            title={`Does ${initialNames.immigrantName} have a mailing address that's DIFFERENT from ${initialNames.immigrantName}'s
            current physical address?`}
            className={cn(css.buttonWrapper, css.mailingAddress)}
            quizStep={quizStep + 2}
            answers={userAnswersArray}
            quizData={basicPersonalData}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative="haveMailing: No"
            answerPositive="haveMailing: Yes"
          />
        </div>
      )}

      {quizStep === 14 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {`${initialNames.immigrantName}'s Mailing Address`}
          </h2>

          <div className={css.contentWraper}>
            <Formik
              enableReinitialize
              initialValues={{
                careName: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'careName',
                ),
                street: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'street',
                ),
                'apt/Ste/FlrNum': getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'apt/Ste/FlrNum',
                ),
                state: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'state',
                ),
                cityOrTown: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'cityOrTown',
                ),
                ZIPCode: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'ZIPCode',
                ),
              }}
              validationSchema={validationZipCodeSchema}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm, validateForm }) => (
                <Form className={css.form}>
                  <InputField
                    label="In Care Of Name (if any)"
                    placeholder="Leave blank if not applicable"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `careName: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="careName"
                  />

                  <InputField
                    label="Street Number and Name"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `street: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="street"
                  />

                  <div>
                    <span>Apt/Ste/Flr</span>

                    <SelectField
                      showDefaultOption
                      defaultOption=""
                      list={['Apt', 'Ste', 'Flr']}
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `Apt/Ste/Flr: ${e.answer}`,
                        })
                      }
                      question={basicPersonalData[quizStep + 2]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep + 2,
                          userAnswersArray,
                          basicPersonalData,
                        ),
                        'Apt/Ste/Flr',
                      )}
                    />
                  </div>
                  <InputField
                    label="Apt/Ste/Flr Number"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `apt/Ste/FlrNum: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="apt/Ste/FlrNum"
                  />

                  <InputField
                    label="City or Town"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `cityOrTown: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="cityOrTown"
                  />

                  <div>
                    <span>State</span>
                    <SelectField
                      list={states}
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `states: ${e.answer}`,
                        })
                      }
                      question={basicPersonalData[quizStep + 2]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep + 2,
                          userAnswersArray,
                          basicPersonalData,
                        ),
                        'states',
                      )}
                    />
                  </div>

                  <InputField
                    label="ZIP Code"
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2]?.id,
                          answer: `ZIPCode: ${e.target.value}`,
                        });
                        submitForm();
                      }
                    }}
                    name="ZIPCode"
                  />

                  <div>
                    <span>Country (Must be USA)</span>

                    <SelectField
                      list={[countries[0]]}
                      showDefaultOption
                      disabled
                      defaultOption="United States of America"
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `states: ${e.answer}`,
                        })
                      }
                      question={basicPersonalData[quizStep + 2]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep + 2,
                          userAnswersArray,
                          basicPersonalData,
                        ),
                        'states',
                      )}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {quizStep === 15 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {`${initialNames.sponsorName}'s Mailing Address`}
          </h2>

          <BooleanMultiplyQuestion
            className={cn(css.buttonWrapper, css.mailingAddress)}
            title={`Does ${initialNames.sponsorName} have a mailing address that's DIFFERENT from ${initialNames.sponsorName}'s
            current physical address?`}
            quizStep={quizStep + 2}
            answers={userAnswersArray}
            quizData={basicPersonalData}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative="haveMailing: No"
            answerPositive="haveMailing: Yes"
          />
        </div>
      )}

      {quizStep === 16 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {`${initialNames.sponsorName}'s Mailing Address`}
          </h2>
          <div className={css.contentWraper}>
            <Formik
              enableReinitialize
              validationSchema={validationZipCodeSchema}
              initialValues={{
                [`${initialNames.sponsorName}CareName`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'careName',
                ),
                [`${initialNames.sponsorName}Street`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'street',
                ),
                [`${initialNames.sponsorName}Apt/Ste/FlrNum`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'apt/Ste/FlrNum',
                ),
                cityOrTown: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'cityOrTown',
                ),
                [`${initialNames.sponsorName}State`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'state',
                ),
                ZIPCode: getValueForInput(
                  getCurentUserAnswer(
                    quizStep + 2,
                    userAnswersArray,
                    basicPersonalData,
                  ),
                  'ZIPCode',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm, validateForm }) => (
                <Form className={css.form}>
                  <InputField
                    label="In Care Of Name (if any)"
                    placeholder="Leave blank if not applicable"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2].id,
                        answer: `careName: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.sponsorName}CareName`}
                  />
                  <InputField
                    label="Street Number and Name"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2].id,
                        answer: `street: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.sponsorName}Street`}
                  />
                  <div>
                    <span>Apt/Ste/Flr</span>

                    <SelectField
                      list={['Apt', 'Ste', 'Flr']}
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `Apt/Ste/Flr: ${e.answer}`,
                        })
                      }
                      question={basicPersonalData[quizStep + 2]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep + 2,
                          userAnswersArray,
                          basicPersonalData,
                        ),
                        'Apt/Ste/Flr',
                      )}
                    />
                  </div>

                  <InputField
                    label="Apt/Ste/Flr Number"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2].id,
                        answer: `apt/Ste/FlrNum: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name={`${initialNames.sponsorName}Apt/Ste/FlrNum`}
                  />
                  <InputField
                    label="City or Town"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: basicPersonalData[quizStep + 2]?.id,
                        answer: `cityOrTown: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="cityOrTown"
                  />

                  <div>
                    <span>State</span>
                    <SelectField
                      list={states}
                      showDefaultOption
                      defaultOption=" "
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `states: ${e.answer}`,
                        })
                      }
                      question={basicPersonalData[quizStep + 2]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep + 2,
                          userAnswersArray,
                          basicPersonalData,
                        ),
                        'states',
                      )}
                    />
                  </div>

                  <InputField
                    label="ZIP Code"
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2].id,
                          answer: `ZIPCode: ${e.target.value}`,
                        });
                        submitForm();
                      }
                    }}
                    name="ZIPCode"
                  />

                  <div>
                    <span>Country (Must be USA)</span>

                    <SelectField
                      list={[countries[0]]}
                      showDefaultOption
                      disabled
                      defaultOption="United States of America"
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `states: ${e.answer}`,
                        })
                      }
                      question={basicPersonalData[quizStep + 2]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep + 2,
                          userAnswersArray,
                          basicPersonalData,
                        ),
                        'states',
                      )}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {quizStep === 17 && (
        <div>
          <h2 className={css.title}>
            {`Address where ${initialNames.immigrantName} and ${initialNames.sponsorName} last lived together?`}
          </h2>

          <BooleanMultiplyQuestion
            title={'Do you currently live here together?'}
            className={cn(css.buttonWrapper, css.liveTogetherButtons)}
            quizStep={quizStep + 2}
            answers={userAnswersArray}
            quizData={basicPersonalData}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative="haveMailing: No"
            answerPositive="haveMailing: Yes"
          />

          <Formik
            enableReinitialize
            validationSchema={validationZipCodeSchema}
            initialValues={{
              streetNumber: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'streetNumber',
              ),
              'apt/Ste/FlrN': getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'apt/Ste/FlrN',
              ),
              city: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'city',
              ),
              province: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'province',
              ),
              postalCode: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'postalCode',
              ),
              zipCode: getValueForInput(
                getCurentUserAnswer(
                  quizStep + 2,
                  userAnswersArray,
                  basicPersonalData,
                ),
                'zipCode',
              ),
            }}
            validate={() => {}}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {({ handleBlur, submitForm, validateForm }) => (
              <Form className={css.form}>
                <InputField
                  label="Street Number and Name"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: basicPersonalData[quizStep + 2]?.id,
                      answer: `streetNumber: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="streetNumber"
                />

                <div>
                  <span>Apt/Ste/Flr</span>

                  <SelectField
                    showDefaultOption
                    defaultOption=""
                    list={['Apt', 'Ste', 'Flr']}
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `apt/Ste/Flr: ${e.answer}`,
                      })
                    }
                    question={basicPersonalData[quizStep + 2]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep + 2,
                        userAnswersArray,
                        basicPersonalData,
                      ),
                      'apt/Ste/Flr',
                    )}
                  />
                </div>

                <InputField
                  label="Apt/Ste/Flr Number"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: basicPersonalData[quizStep + 2]?.id,
                      answer: `apt/Ste/FlrN: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="apt/Ste/FlrN"
                />

                <InputField
                  label="City or town"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: basicPersonalData[quizStep + 2]?.id,
                      answer: `city: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="city"
                />

                <div>
                  <span>Country</span>

                  <SelectField
                    showDefaultOption
                    defaultOption=""
                    list={countries}
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `country: ${e.answer}`,
                      })
                    }
                    question={basicPersonalData[quizStep + 2]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep + 2,
                        userAnswersArray,
                        basicPersonalData,
                      ),
                      'country',
                    )}
                  />
                </div>

                {isImmigrantAndSponsorAddressUSA ? (
                  <>
                    <div>
                      <span>State</span>

                      <SelectField
                        showDefaultOption
                        defaultOption=""
                        list={states}
                        onChange={e =>
                          handleCheckboxAnswer({
                            id: e.id,
                            answer: `state: ${e.answer}`,
                          })
                        }
                        question={basicPersonalData[quizStep + 2]}
                        defaultValue={getValueForInput(
                          getCurentUserAnswer(
                            quizStep + 2,
                            userAnswersArray,
                            basicPersonalData,
                          ),
                          'state',
                        )}
                      />
                    </div>

                    <InputField
                      label="ZIP Code"
                      onBlur={async e => {
                        const error = await validateForm();

                        if (!Object.keys(error).length) {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: basicPersonalData[quizStep + 2]?.id,
                            answer: `zipCode: ${e.target.value}`,
                          });
                          submitForm();
                        }
                      }}
                      name="zipCode"
                    />
                  </>
                ) : (
                  <>
                    <InputField
                      label="Province"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: basicPersonalData[quizStep + 2]?.id,
                          answer: `province: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="province"
                    />
                    <InputField
                      label="Postal Code"
                      onBlur={async e => {
                        const errors = await validateForm();

                        if (!Object.keys(errors).length) {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: basicPersonalData[quizStep + 2]?.id,
                            answer: `postalCode: ${e.target.value}`,
                          });
                          submitForm();
                        }
                      }}
                      name="postalCode"
                    />
                  </>
                )}

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: basicPersonalData[quizStep + 2]?.id,
                      answer: `dateFrom: ${date}`,
                    });
                  }}
                  title="Date of Residence - From"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '81',
                    'dateFrom',
                  )}
                />

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: basicPersonalData[quizStep + 2]?.id,
                      answer: `dateTo: ${date}`,
                    });
                  }}
                  title="Date of Residence - To"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '81',
                    'dateTo',
                  )}
                />
              </Form>
            )}
          </Formik>
        </div>
      )}

      {quizStep === 18 && (
        <div className="quizWrapper">
          <Summary
            list={tabDTO[2].tabs}
            incompleteQuizItems={incompleteQuizItems}
          />
        </div>
      )}
    </>
  );
};

export { BasicPersonalInfo };
