/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { Fragment, useEffect, useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import cn from 'classnames';
import * as Yup from 'yup';

import { Form, Formik } from 'formik';
import {
  employmentSelector,
  quizNavigationSelector,
  resetQuizStep,
  setEmploymentIncompleteQuizItems,
  setEmploymentQuiz,
  setUserAnswers,
  userAnswerSelector,
} from '@/entities/quiz';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
  BooleanMultiplyQuestion,
  DatePickerSelect,
  InfoCard,
  InputField,
} from '@/shared/ui';

import bag from '/public/assets/icons/Bag.svg';
import {
  getCountry,
  getQuiz,
  getStates,
  getUserAnswers,
  IQuestions,
  updateUserInfo,
} from '@/shared/firebase/services';
import {
  ECollectionNames,
  EQuestionsDataType,
  EQuestionsTypeId,
  ISponsorImmigrantPair,
} from '@/shared/types';
import {
  calculatePercentage,
  getAllAnswersCount,
  getCorrectAnswerToCountMetrics,
  getCurentUserAnswer,
  getIncompleteQuizAnswerIds,
  getInitialDateValue,
  getReplacedName,
  getValueForInput,
  storeAnswer,
  TUserChoice,
} from '@/shared/utils';

import css from './Employment.module.scss';
import { Summary } from '@/widgets/summary';
import { SelectField } from '@/shared/ui/SelectField';
import { tabDTO } from '@/entities/sidebar';

const validationZipCodeSchema = Yup.object({
  postalCode: Yup.string().matches(/^\d{5}$/, 'Must be exactly 5 digits'),
  postalCode0: Yup.string().matches(/^\d{5}$/, 'Must be exactly 5 digits'),
});

const Employment = () => {
  const dispatch = useAppDispatch();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [currentUserChoiseId, setCurrentUserChoiseId] = useState('');

  const { quizStep } = useAppSelector(quizNavigationSelector);
  const { employmentQuiz } = useAppSelector(employmentSelector);
  const [userData, setUserData] = useLocalStorage<TUser>('user');
  const { userAnswers } = useAppSelector(userAnswerSelector);

  const userAnswersArray = Object.values(userAnswers);

  const [applicantNicknams] = useLocalStorage<ISponsorImmigrantPair>(
    'sponsorImmigrantPair',
  );

  const initialNames: ISponsorImmigrantPair = {
    immigrantName: applicantNicknams?.immigrantName ?? 'immigrant',
    sponsorName: applicantNicknams?.sponsorName ?? 'sponsor',
  };

  // prettier-ignore
  const currentEmploymentStatus
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '59')?.answer,
    'currentEmployment',
  );

  // prettier-ignore
  const currentSponsorEmploymentStatus
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '61')?.answer,
    'currentSponsorEmployment',
  );

  // prettier-ignore
  const sponsorEmploymentStatus
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '61')?.answer,
    'employmentSponsorStatus',
  );

  // prettier-ignore
  const sponsorRetiredEmploymentStatus
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '61')?.answer,
    'employmentSponsorStatus',
  );

  // prettier-ignore
  const sponsorStudentEmploymentStatus
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '61')?.answer,
    'employmentSponsorStatus',
  );

  // prettier-ignore
  const isImmigrantCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'country',
  ) === 'United States of America';

  // prettier-ignore
  const isImmigrantCountryAdditionalWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'country0',
  ) === 'United States of America';

  // prettier-ignore
  const isUnemployedImmigrantCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'unemployedCountry0',
  ) === 'United States of America';

  // prettier-ignore
  const isRetiredImmigrantCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'retiredCountry0',
  ) === 'United States of America';

  // prettier-ignore
  const isStudentImmigrantCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'studentCountry',
  ) === 'United States of America';

  // prettier-ignore
  const isStudentAdditionImmigrantCountryWorkUSA
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '60')?.answer,
      'studentCountry0',
    ) === 'United States of America';

  // prettier-ignore
  const isImmigrantCountryWorkOutsideUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'countryOutside',
  ) === 'United States of America';

  // prettier-ignore
  const isSponsorUnemployedAdditionCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'sponsorUnemployedCountry0',
  ) === 'United States of America';

  // prettier-ignore
  const isSponsorWorkingCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'sponsorWorkingCountry',
  ) === 'United States of America';

  // prettier-ignore
  const isSponsorUnemployedCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'sponsorUnemployedCountry',
  ) === 'United States of America';

  // prettier-ignore
  const isSponsorRetiredCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'sponsorRetiredCountry',
  ) === 'United States of America';

  // prettier-ignore
  const isSponsorAdditionWorkingCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'sponsorWorkingCountry0',
  ) === 'United States of America';

  // prettier-ignore
  const isSponsorRetiredAdditionCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'sponsorRetiredCountry0',
  ) === 'United States of America';

  // prettier-ignore
  const isSponsorStudentImmigrantCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'sponsorStudentCountry',
  ) === 'United States of America';

  // prettier-ignore
  const isSponsorStudentAdditionCountryWorkUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'sponsorStudentCountry0',
  ) === 'United States of America';

  // prettier-ignore
  const isAddImmigrantEmployment
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'addEmployment',
  ) === 'Yes';

  // prettier-ignore
  const isAddSponsorEmployment
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'addSponsorWorkingEmployment',
  ) === 'Yes';

  // prettier-ignore
  const isAddSponsorUnemployedEmployment
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'addSponsorUnemployedLast5Years',
  ) === 'Yes';

  // prettier-ignore
  const isAddSponsorRetiredEmployment
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'addSponsorRetiredEmploymentLast5Years',
  ) === 'Yes';

  // prettier-ignore
  const isAddSponsorStudentAdditionEmployment
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '62')?.answer,
    'sponsorStudentAddMoreLast5Years',
  ) === 'Yes';

  // prettier-ignore
  const isAddUnemployedImmigrantEmployment
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'unemployedAddMoreLast5Years',
  ) === 'Yes';

  // prettier-ignore
  const isAddRetiredImmigrantEmployment
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'retiredAddMoreLast5Years',
  ) === 'Yes';

  // prettier-ignore
  const isAddStudentImmigrantEmployment
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'studentAddMoreLast5Years',
  ) === 'Yes';

  // prettier-ignore
  const isImmigrantCurrentJob
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'isCurrentJob1',
  ) === 'Yes';

  // prettier-ignore
  const isItCurrentJobOfImmigrant
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'isCurrentImmigrantJob',
  ) === 'Yes';

  // prettier-ignore
  const immigrantEverEmployedOutsideUSA
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'everEmployedOutside',
  ) === 'Yes';

  // prettier-ignore
  const immigrantEnteredRecentNonUSEmployment
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '60')?.answer,
    'enteredRecentNonUSEmployment',
  );

  // prettier-ignore
  const immigrantEmploymentStatus
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '59')?.answer,
    'employmentStatus',
  );

  const handleCheckboxAnswer = async (userChoice: TUserChoice) => {
    setCurrentUserChoiseId(userChoice.id);

    await storeAnswer(
      userAnswers,
      userChoice,
      userData?.user ?? null,
      EQuestionsTypeId.EMPLOYMENT,
      dispatch,
      setUserAnswers,
      'multipleAnswer',
      EQuestionsDataType.DATA,
    );

    const dataAnswers = await getUserAnswers(
      EQuestionsTypeId.EMPLOYMENT,
      userData?.user.id ?? '',
    );

    // prettier-ignore
    const [isAnswerRequredIds, updateForAnswerCount]
        = getCorrectAnswerToCountMetrics(employmentQuiz.data, dataAnswers);

    if (isAnswerRequredIds.includes(userChoice.id)) {
      updateUserInfo(
        userData?.user.id ?? '',
        {
          testsCompletedInfo: {
            ...userData?.user.testsCompletedInfo,
            employment: calculatePercentage(
              getAllAnswersCount(updateForAnswerCount, employmentQuiz.data),
              employmentQuiz.TOTAL_FIELDS,
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
          EQuestionsTypeId.EMPLOYMENT,
        )) as IQuestions[];

        dispatch(setEmploymentQuiz(quizData));
      } catch (error) {
        // console.log(error)
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const dataAnswers = await getUserAnswers(
          EQuestionsTypeId.EMPLOYMENT,
          userData?.user.id ?? '',
        );

        const incompleteQuizAnswerIds: string[] = getIncompleteQuizAnswerIds(
          Object.values(dataAnswers),
          employmentQuiz.data,
        );

        dispatch(setUserAnswers(dataAnswers));

        dispatch(setEmploymentIncompleteQuizItems(incompleteQuizAnswerIds));
      } catch (error) {
        // console.log(error)
      }
    })();
  }, [
    dispatch,
    userAnswersArray.length,
    currentUserChoiseId,
    userData?.user.id,
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

  return (
    <>
      {quizStep === 0 && (
        <InfoCard icon={bag}>
          <h2>Coming up next are Employment information and history details</h2>
          <p>
            Now we get into the Employment Information section. This is where
            you&apos;ll provide details about your professional journey. From
            indicating your current status, clarifying self-employment aspects,
            to detailing out addresses and roles - every piece of information
            helps. Additionally, if you&apos;ve switched jobs in the past 5
            years, there&apos;s an option to add that history. Please ensure
            accuracy in your entries to streamline our process and serve you
            better.
          </p>
        </InfoCard>
      )}

      {quizStep === 1 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              employmentQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.containerDown}>
            <BooleanMultiplyQuestion
              className={cn(css.buttonWrapper)}
              title="What describes your current employment situation best?"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={employmentQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              hasAdditionalOption
              hasSecondAdditionalOption
              answerPositive="currentEmployment: Working (Employed/Self-employed/Intern)"
              answerNegative="currentEmployment: Unemployed"
              answerAddition="currentEmployment: Retired"
              secondAnswerAddition="currentEmployment: Student"
            />

            {!currentEmploymentStatus.includes('Working') &&
              currentEmploymentStatus !== '' && (
                <BooleanMultiplyQuestion
                  className={cn(css.buttonWrapper)}
                  title="Select what applies to you"
                  quizStep={quizStep - 1}
                  answers={userAnswersArray}
                  quizData={employmentQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  hasAdditionalOption
                  answerPositive="employmentStatus: I have never been employed since I turned 18"
                  answerNegative="employmentStatus: I have had a job since I turned 18 but not in the last 5 years"
                  answerAddition="employmentStatus: I have had a job in the last 5 years"
                />
              )}
          </div>
        </div>
      )}

      {quizStep === 2 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              employmentQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          {currentEmploymentStatus.includes('Working') && (
            <>
              <BooleanMultiplyQuestion
                className={cn(css.buttonWrapper, css.isSelfEmploymentButtons)}
                title="Is this self-employment?"
                quizStep={quizStep - 1}
                answers={userAnswersArray}
                quizData={employmentQuiz.data}
                handleCheckboxAnswer={handleCheckboxAnswer}
                answerNegative="IsSelfEmployment: No"
                answerPositive="IsSelfEmployment: Yes"
              />

              <BooleanMultiplyQuestion
                className={cn(
                  css.buttonWrapper,
                  css.employmentDetailsCurrentJob,
                )}
                title="Is this your current job?"
                quizStep={quizStep - 1}
                answers={userAnswersArray}
                quizData={employmentQuiz.data}
                handleCheckboxAnswer={handleCheckboxAnswer}
                answerPositive={`isCurrentImmigrantJob: Yes`}
                answerNegative={`isCurrentImmigrantJob: No`}
              />

              <div>
                <Formik
                  enableReinitialize
                  validationSchema={validationZipCodeSchema}
                  initialValues={{
                    employerName: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'employerName',
                    ),
                    streetName: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'streetName',
                    ),
                    AptSteFlrN: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'AptSteFlrN',
                    ),
                    cityOrTown: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'cityOrTown',
                    ),
                    province: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'province',
                    ),
                    postalCode: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'postalCode',
                    ),
                    zipCode: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'zipCode',
                    ),
                    occupation: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'occupation',
                    ),
                  }}
                  validateOnChange={false}
                  onSubmit={() => {}}
                >
                  {({ handleBlur, submitForm, validateForm }) => (
                    <Form className={css.form}>
                      <InputField
                        label="Name of Employer?"
                        className={css.firstName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `employerName: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="employerName"
                      />

                      <InputField
                        label="Street Number and Name"
                        className={css.middleName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `streetName: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="streetName"
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
                          question={employmentQuiz.data[quizStep - 1]}
                          defaultValue={getValueForInput(
                            getCurentUserAnswer(
                              quizStep - 1,
                              userAnswersArray,
                              employmentQuiz.data,
                            ),
                            'Apt/Ste/Flr',
                          )}
                        />
                      </div>

                      <InputField
                        label="Apt/Ste/Flr number"
                        className={css.lastName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `AptSteFlrN: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="AptSteFlrN"
                      />

                      <div>
                        <span>Country</span>

                        <SelectField
                          list={countries}
                          showDefaultOption
                          defaultOption=""
                          onChange={e =>
                            handleCheckboxAnswer({
                              id: e.id,
                              answer: `country: ${e.answer}`,
                            })
                          }
                          question={employmentQuiz.data[quizStep - 1]}
                          defaultValue={getValueForInput(
                            getCurentUserAnswer(
                              quizStep - 1,
                              userAnswersArray,
                              employmentQuiz.data,
                            ),
                            'country',
                          )}
                        />
                      </div>

                      {isImmigrantCountryWorkUSA && (
                        <div>
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
                              question={employmentQuiz.data[quizStep - 1]}
                              defaultValue={getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                'states',
                              )}
                            />
                          </div>
                          <InputField
                            label="ZIP Code"
                            className={css.lastName}
                            onBlur={async e => {
                              const errors = await validateForm();

                              if (!Object.keys(errors).length) {
                                handleBlur(e);
                                handleCheckboxAnswer({
                                  id: employmentQuiz.data[quizStep - 1]?.id,
                                  answer: `zipCode: ${e.target.value}`,
                                });
                                submitForm();
                              }
                            }}
                            name="zipCode"
                          />
                        </div>
                      )}

                      {!isImmigrantCountryWorkUSA && (
                        <div>
                          <InputField
                            label="Province"
                            className={css.lastName}
                            onBlur={e => {
                              handleBlur(e);
                              handleCheckboxAnswer({
                                id: employmentQuiz.data[quizStep - 1]?.id,
                                answer: `province: ${e.target.value}`,
                              });
                              submitForm();
                            }}
                            name="province"
                          />

                          <InputField
                            label="Postal Code"
                            className={css.lastName}
                            onBlur={async e => {
                              const errors = await validateForm();

                              if (!Object.keys(errors).length) {
                                handleBlur(e);
                                handleCheckboxAnswer({
                                  id: employmentQuiz.data[quizStep - 1]?.id,
                                  answer: `postalCode: ${e.target.value}`,
                                });
                                submitForm();
                              }
                            }}
                            name="postalCode"
                          />
                        </div>
                      )}

                      <InputField
                        label="Your Occupation"
                        className={css.lastName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `occupation: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="occupation"
                      />

                      <DatePickerSelect
                        title="Dates of Employment (From)"
                        initialDate={getInitialDateValue(
                          userAnswersArray,
                          '60',
                          'employmentDatesFrom',
                        )}
                        onClick={date => {
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `employmentDatesFrom: ${date}`,
                          });
                        }}
                      />

                      <DatePickerSelect
                        title="Dates of Employment (To)"
                        isDisabled={!!isItCurrentJobOfImmigrant}
                        value={
                          isItCurrentJobOfImmigrant ? 'PRESENT' : undefined
                        }
                        initialDate={getInitialDateValue(
                          userAnswersArray,
                          '60',
                          'employmentDatesTo',
                        )}
                        onClick={date => {
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `employmentDatesTo: ${date}`,
                          });
                        }}
                      />
                    </Form>
                  )}
                </Formik>

                {Array.from({ length: 1 }, (_, i) => i + 1).map((el, i) => (
                  <Fragment key={`${i + el}`}>
                    <h3 className={cn(css.title, css.employmentDetailsAddMore)}>
                      {`Employment Details ${i + 2} - ${initialNames.immigrantName}`}
                    </h3>

                    <BooleanMultiplyQuestion
                      className={cn(css.buttonWrapper)}
                      title="Add more employment history from past 5 years?"
                      quizStep={quizStep - 1}
                      answers={userAnswersArray}
                      quizData={employmentQuiz.data}
                      handleCheckboxAnswer={handleCheckboxAnswer}
                      answerNegative="addEmployment: No"
                      answerPositive="addEmployment: Yes"
                    />

                    {isAddImmigrantEmployment && (
                      <>
                        <BooleanMultiplyQuestion
                          className={cn(
                            css.buttonWrapper,
                            css.employmentDetailsCurrentJob,
                          )}
                          title="Is this your current job?"
                          quizStep={quizStep - 1}
                          answers={userAnswersArray}
                          quizData={employmentQuiz.data}
                          handleCheckboxAnswer={handleCheckboxAnswer}
                          answerPositive={`isCurrentJob${i + 1}: Yes`}
                          answerNegative={`isCurrentJob${i + 1}: No`}
                        />

                        <Formik
                          enableReinitialize
                          initialValues={{
                            [`employerName${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `employerName${i}`,
                            ),
                            [`streetName${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `streetName${i}`,
                            ),
                            [`AptSteFlrN${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `AptSteFlrN${i}`,
                            ),
                            [`cityOrTown${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `cityOrTown${i}`,
                            ),
                            [`province${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `province${i}`,
                            ),
                            [`postalCode${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `postalCode${i}`,
                            ),
                            [`zipCode${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `zipCode${i}`,
                            ),
                            [`occupation${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `occupation${i}`,
                            ),
                          }}
                          validationSchema={validationZipCodeSchema}
                          validateOnChange={false}
                          onSubmit={() => {}}
                        >
                          {({ handleBlur, submitForm, validateForm }) => (
                            <Form className={css.form}>
                              <InputField
                                label="Name of Employer?"
                                className={css.firstName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `employerName${i}: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name={`employerName${i}`}
                              />

                              <InputField
                                label="Street Number and Name"
                                placeholder="Eg: Microsoft or Self-Employed"
                                className={css.middleName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `streetName${i}: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name={`streetName${i}`}
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
                                      answer: `Apt/Ste/Flr${i}: ${e.answer}`,
                                    })
                                  }
                                  question={employmentQuiz.data[quizStep - 1]}
                                  defaultValue={getValueForInput(
                                    getCurentUserAnswer(
                                      quizStep - 1,
                                      userAnswersArray,
                                      employmentQuiz.data,
                                    ),
                                    `Apt/Ste/Flr${i}`,
                                  )}
                                />
                              </div>

                              <InputField
                                label="Apt/Ste/Flr number"
                                className={css.lastName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `AptSteFlrN${i}: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name={`AptSteFlrN${i}`}
                              />

                              <div>
                                <span>Country</span>

                                <SelectField
                                  list={countries}
                                  showDefaultOption
                                  defaultOption=""
                                  onChange={e =>
                                    handleCheckboxAnswer({
                                      id: e.id,
                                      answer: `country${i}: ${e.answer}`,
                                    })
                                  }
                                  question={employmentQuiz.data[quizStep - 1]}
                                  defaultValue={getValueForInput(
                                    getCurentUserAnswer(
                                      quizStep - 1,
                                      userAnswersArray,
                                      employmentQuiz.data,
                                    ),
                                    `country${i}`,
                                  )}
                                />
                              </div>

                              {isImmigrantCountryAdditionalWorkUSA && (
                                <div>
                                  <div>
                                    <span>State</span>

                                    <SelectField
                                      list={states}
                                      showDefaultOption
                                      defaultOption=""
                                      onChange={e =>
                                        handleCheckboxAnswer({
                                          id: e.id,
                                          answer: `states${i}: ${e.answer}`,
                                        })
                                      }
                                      question={
                                        employmentQuiz.data[quizStep - 1]
                                      }
                                      defaultValue={getValueForInput(
                                        getCurentUserAnswer(
                                          quizStep - 1,
                                          userAnswersArray,
                                          employmentQuiz.data,
                                        ),
                                        `states${i}`,
                                      )}
                                    />
                                  </div>
                                  <InputField
                                    label="ZIP Code"
                                    className={css.lastName}
                                    onBlur={async e => {
                                      const errors = await validateForm();

                                      if (!Object.keys(errors).length) {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `zipCode${i}: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }
                                    }}
                                    name={`zipCode${i}`}
                                  />
                                </div>
                              )}

                              {!isImmigrantCountryAdditionalWorkUSA && (
                                <div>
                                  <InputField
                                    label="Province"
                                    className={css.lastName}
                                    onBlur={e => {
                                      handleBlur(e);
                                      handleCheckboxAnswer({
                                        id: employmentQuiz.data[quizStep - 1]
                                          ?.id,
                                        answer: `province${i}: ${e.target.value}`,
                                      });
                                      submitForm();
                                    }}
                                    name={`province${i}`}
                                  />

                                  <InputField
                                    label="Postal Code"
                                    className={css.lastName}
                                    onBlur={async e => {
                                      const errors = await validateForm();

                                      if (!Object.keys(errors).length) {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `postalCode${i}: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }
                                    }}
                                    name={`postalCode${i}`}
                                  />
                                </div>
                              )}

                              <InputField
                                label="Your Occupation"
                                className={css.lastName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `occupation${i}: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name={`occupation${i}`}
                              />

                              <DatePickerSelect
                                title="Dates of Employment (From)"
                                initialDate={getInitialDateValue(
                                  userAnswersArray,
                                  '60',
                                  `employmentAdditionDatesFrom${i}`,
                                )}
                                onClick={date => {
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `employmentAdditionDatesFrom${i}: ${date}`,
                                  });
                                }}
                              />

                              <DatePickerSelect
                                title="Dates of Employment (To)"
                                isDisabled={isImmigrantCurrentJob}
                                value={
                                  isImmigrantCurrentJob ? 'PRESENT' : undefined
                                }
                                initialDate={getInitialDateValue(
                                  userAnswersArray,
                                  '60',
                                  `employmentAdditionDatesTo${i}`,
                                )}
                                onClick={date => {
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `employmentAdditionDatesTo${i}: ${date}`,
                                  });
                                }}
                              />
                            </Form>
                          )}
                        </Formik>
                      </>
                    )}
                  </Fragment>
                ))}

                <h3 className={cn(css.title, css.employmentDetailsWorkOutside)}>
                  {`Employment outside USA - ${initialNames.immigrantName}`}
                </h3>

                <div>
                  <BooleanMultiplyQuestion
                    className={cn(css.buttonWrapper)}
                    title="Were you ever employed outside the USA?"
                    quizStep={quizStep - 1}
                    answers={userAnswersArray}
                    quizData={employmentQuiz.data}
                    handleCheckboxAnswer={handleCheckboxAnswer}
                    answerNegative="everEmployedOutside: No"
                    answerPositive="everEmployedOutside: Yes"
                  />

                  {immigrantEverEmployedOutsideUSA && (
                    <>
                      <BooleanMultiplyQuestion
                        className={cn(
                          css.buttonWrapper,
                          css.employmentDetailsButtonWrapper,
                        )}
                        title="Have you entered the information about your most recent non-US employment already in the above section?"
                        quizStep={quizStep - 1}
                        answers={userAnswersArray}
                        quizData={employmentQuiz.data}
                        handleCheckboxAnswer={handleCheckboxAnswer}
                        answerNegative="enteredRecentNonUSEmployment: No"
                        answerPositive="enteredRecentNonUSEmployment: Yes"
                      />

                      {immigrantEnteredRecentNonUSEmployment === 'No' && (
                        <Formik
                          enableReinitialize
                          initialValues={{
                            employerNameOutside: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'employerNameOutside',
                            ),
                            streetNameOutside: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'streetNameOutside',
                            ),
                            AptSteFlrNOutside: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'AptSteFlrNOutside',
                            ),
                            cityOrTownOutside: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'cityOrTownOutside',
                            ),
                            provinceOutside: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'provinceOutside',
                            ),
                            postalCodeOutside: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'postalCodeOutside',
                            ),
                            zipCodeOutside: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'zipCodeOutside',
                            ),
                            occupationOutside: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'occupationOutside',
                            ),
                          }}
                          validate={() => {}}
                          validationSchema={validationZipCodeSchema}
                          validateOnBlur={false}
                          validateOnChange={false}
                          onSubmit={() => {}}
                        >
                          {({ handleBlur, submitForm, validateForm }) => (
                            <Form className={css.form}>
                              <InputField
                                label="Name of Employer?"
                                className={css.firstName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `employerNameOutside: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name="employerNameOutside"
                              />

                              <InputField
                                label="Street Number and Name"
                                className={css.middleName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `streetNameOutside: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name="streetNameOutside"
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
                                      answer: `Apt/Ste/FlrOutside: ${e.answer}`,
                                    })
                                  }
                                  question={employmentQuiz.data[quizStep - 1]}
                                  defaultValue={getValueForInput(
                                    getCurentUserAnswer(
                                      quizStep - 1,
                                      userAnswersArray,
                                      employmentQuiz.data,
                                    ),
                                    'Apt/Ste/FlrOutside',
                                  )}
                                />
                              </div>

                              <InputField
                                label="Apt/Ste/Flr number"
                                className={css.lastName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `AptSteFlrNOutside: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name="AptSteFlrNOutside"
                              />

                              <div>
                                <span>Country</span>

                                <SelectField
                                  list={countries}
                                  showDefaultOption
                                  defaultOption=""
                                  onChange={e =>
                                    handleCheckboxAnswer({
                                      id: e.id,
                                      answer: `countryOutside: ${e.answer}`,
                                    })
                                  }
                                  question={employmentQuiz.data[quizStep - 1]}
                                  defaultValue={getValueForInput(
                                    getCurentUserAnswer(
                                      quizStep - 1,
                                      userAnswersArray,
                                      employmentQuiz.data,
                                    ),
                                    'countryOutside',
                                  )}
                                />
                              </div>

                              {isImmigrantCountryWorkOutsideUSA && (
                                <div>
                                  <div>
                                    <span>State</span>

                                    <SelectField
                                      list={states}
                                      showDefaultOption
                                      defaultOption=""
                                      onChange={e =>
                                        handleCheckboxAnswer({
                                          id: e.id,
                                          answer: `statesOutside: ${e.answer}`,
                                        })
                                      }
                                      question={
                                        employmentQuiz.data[quizStep - 1]
                                      }
                                      defaultValue={getValueForInput(
                                        getCurentUserAnswer(
                                          quizStep - 1,
                                          userAnswersArray,
                                          employmentQuiz.data,
                                        ),
                                        'statesOutside',
                                      )}
                                    />
                                  </div>

                                  <InputField
                                    label="ZIP Code"
                                    className={css.lastName}
                                    onBlur={async e => {
                                      const errors = await validateForm();

                                      if (!Object.keys(errors).length) {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `zipCodeOutside: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }
                                    }}
                                    name="zipCodeOutside"
                                  />
                                </div>
                              )}
                              {!isImmigrantCountryWorkOutsideUSA && (
                                <div>
                                  <InputField
                                    label="Province"
                                    className={css.lastName}
                                    onBlur={e => {
                                      handleBlur(e);
                                      handleCheckboxAnswer({
                                        id: employmentQuiz.data[quizStep - 1]
                                          ?.id,
                                        answer: `provinceOutside: ${e.target.value}`,
                                      });
                                      submitForm();
                                    }}
                                    name="provinceOutside"
                                  />

                                  <InputField
                                    label="Postal Code"
                                    className={css.lastName}
                                    onBlur={async e => {
                                      const errors = await validateForm();

                                      if (!Object.keys(errors).length) {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `postalCodeOutside: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }
                                    }}
                                    name="postalCodeOutside"
                                  />
                                </div>
                              )}

                              <InputField
                                label="Your Occupation"
                                className={css.lastName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `occupationOutside: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name="occupationOutside"
                              />

                              <DatePickerSelect
                                title="Dates of Employment (From)"
                                initialDate={getInitialDateValue(
                                  userAnswersArray,
                                  '60',
                                  'employmentDatesFromOutside',
                                )}
                                onClick={date => {
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `employmentDatesFromOutside: ${date}`,
                                  });
                                }}
                              />

                              <DatePickerSelect
                                title="Dates of Employment (To)"
                                initialDate={getInitialDateValue(
                                  userAnswersArray,
                                  '60',
                                  'employmentDatesToOutside',
                                )}
                                onClick={date => {
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `employmentDatesToOutside: ${date}`,
                                  });
                                }}
                              />
                            </Form>
                          )}
                        </Formik>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {currentEmploymentStatus === 'Unemployed' && (
            <>
              <Formik
                enableReinitialize
                initialValues={{
                  employerNameUnemployed: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'employerNameUnemployed',
                  ),
                }}
                validate={() => {}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={() => {}}
              >
                {({ handleBlur, submitForm }) => (
                  <Form className={css.containerDown}>
                    <InputField
                      label="Name of Employer?"
                      disabled
                      placeholder="Unemployed"
                      className={css.firstName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `employerNameUnemployed: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="employerNameUnemployed"
                    />

                    <DatePickerSelect
                      title="Since when you have you been unemployed/retired/atending school?"
                      initialDate={getInitialDateValue(
                        userAnswersArray,
                        '60',
                        'sinceWhenUnemployed',
                      )}
                      onClick={date => {
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `sinceWhenUnemployed: ${date}`,
                        });
                      }}
                    />
                  </Form>
                )}
              </Formik>

              {immigrantEmploymentStatus ===
                'I have had a job in the last 5 years' && (
                <>
                  {Array.from({ length: 1 }, (_, i) => i + 1).map((el, i) => (
                    <Fragment key={`${i + el}`}>
                      <h3
                        className={cn(css.title, css.employmentDetailsAddMore)}
                      >
                        {`Employment Details ${i + 2} - ${initialNames.immigrantName}`}
                      </h3>

                      <BooleanMultiplyQuestion
                        className={cn(
                          css.buttonWrapper,
                          css.unemployedAddMoreLast5YearsButtons,
                        )}
                        title="Add more employment history from past 5 years?"
                        quizStep={quizStep - 1}
                        answers={userAnswersArray}
                        quizData={employmentQuiz.data}
                        handleCheckboxAnswer={handleCheckboxAnswer}
                        answerNegative="unemployedAddMoreLast5Years: No"
                        answerPositive="unemployedAddMoreLast5Years: Yes"
                      />

                      {isAddUnemployedImmigrantEmployment && (
                        <>
                          <Formik
                            enableReinitialize
                            initialValues={{
                              [`unemployedEmployerName${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `unemployedEmployerName${i}`,
                              ),
                              [`unemployedStreetName${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `unemployedStreetName${i}`,
                              ),
                              [`unemployedAptSteFlrN${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `unemployedAptSteFlrN${i}`,
                              ),
                              [`unemployedCityOrTown${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `unemployedCityOrTown${i}`,
                              ),
                              [`unemployedProvince${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `unemployedProvince${i}`,
                              ),
                              [`postalCode${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `unemployedPostalCode${i}`,
                              ),
                              [`unemployedOccupation${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `unemployedOccupation${i}`,
                              ),
                            }}
                            validationSchema={validationZipCodeSchema}
                            validateOnChange={false}
                            onSubmit={() => {}}
                          >
                            {({ handleBlur, submitForm, validateForm }) => (
                              <Form className={css.form}>
                                <InputField
                                  label="Name of Employer?"
                                  className={css.firstName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `unemployedEmployerName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`unemployedEmployerName${i}`}
                                />

                                <InputField
                                  label="Street Number and Name"
                                  placeholder="Eg: Microsoft or Self-Employed"
                                  className={css.middleName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `unemployedStreetName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`unemployedStreetName${i}`}
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
                                        answer: `unemployedApt/Ste/Flr${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `unemployedApt/Ste/Flr${i}`,
                                    )}
                                  />
                                </div>

                                <InputField
                                  label="Apt/Ste/Flr number"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `unemployedAptSteFlrN${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`unemployedAptSteFlrN${i}`}
                                />

                                <div>
                                  <span>Country</span>

                                  <SelectField
                                    list={countries}
                                    showDefaultOption
                                    defaultOption=""
                                    onChange={e =>
                                      handleCheckboxAnswer({
                                        id: e.id,
                                        answer: `unemployedCountry${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `unemployedCountry${i}`,
                                    )}
                                  />
                                </div>

                                {isUnemployedImmigrantCountryWorkUSA && (
                                  <div>
                                    <div>
                                      <span>State</span>

                                      <SelectField
                                        list={states}
                                        showDefaultOption
                                        defaultOption=""
                                        onChange={e =>
                                          handleCheckboxAnswer({
                                            id: e.id,
                                            answer: `unemployedStates${i}: ${e.answer}`,
                                          })
                                        }
                                        question={
                                          employmentQuiz.data[quizStep - 1]
                                        }
                                        defaultValue={getValueForInput(
                                          getCurentUserAnswer(
                                            quizStep - 1,
                                            userAnswersArray,
                                            employmentQuiz.data,
                                          ),
                                          `unemployedStates${i}`,
                                        )}
                                      />
                                    </div>

                                    <InputField
                                      label="ZIP Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        const errors = await validateForm();

                                        if (!Object.keys(errors).length) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `unemployedPostalCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`postalCode${i}`}
                                    />
                                  </div>
                                )}

                                {!isUnemployedImmigrantCountryWorkUSA && (
                                  <div>
                                    <InputField
                                      label="Province"
                                      className={css.lastName}
                                      onBlur={e => {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `unemployedProvince${i}: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }}
                                      name={`unemployedProvince${i}`}
                                    />

                                    <InputField
                                      label="Postal Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        const errors = await validateForm();

                                        if (!Object.keys(errors).length) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `unemployedPostalCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`postalCode${i}`}
                                    />
                                  </div>
                                )}

                                <InputField
                                  label="Your Occupation"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `unemployedOccupation${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`unemployedOccupation${i}`}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (From)"
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '60',
                                    `unemployedEmploymentDatesFrom${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `unemployedEmploymentDatesFrom${i}: ${date}`,
                                    });
                                  }}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (To)"
                                  isDisabled={isImmigrantCurrentJob}
                                  value={
                                    isImmigrantCurrentJob
                                      ? 'PRESENT'
                                      : undefined
                                  }
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '60',
                                    `unemployedEmploymentDatesTo${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `unemployedEmploymentDatesTo${i}: ${date}`,
                                    });
                                  }}
                                />
                              </Form>
                            )}
                          </Formik>
                        </>
                      )}
                    </Fragment>
                  ))}
                </>
              )}
            </>
          )}

          {currentEmploymentStatus === 'Retired' && (
            <div>
              <div className={css.containerDown}>
                <DatePickerSelect
                  title="Since when you have you been unemployed/retired/atending school?"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '60',
                    'retiredUnemployedOrRetiredOrAttendingSince',
                  )}
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: employmentQuiz.data[quizStep - 1]?.id,
                      answer: `retiredUnemployedOrRetiredOrAttendingSince: ${date}`,
                    });
                  }}
                />
              </div>

              {immigrantEmploymentStatus ===
                'I have had a job in the last 5 years' && (
                <>
                  {Array.from({ length: 1 }, (_, i) => i + 1).map((el, i) => (
                    <Fragment key={`${i + el}`}>
                      <h3
                        className={cn(css.title, css.employmentDetailsAddMore)}
                      >
                        {`Employment Details ${i + 2} - ${initialNames.immigrantName}`}
                      </h3>

                      <BooleanMultiplyQuestion
                        className={cn(
                          css.buttonWrapper,
                          css.unemployedAddMoreLast5YearsButtons,
                        )}
                        title="Add more employment history from past 5 years?"
                        quizStep={quizStep - 1}
                        answers={userAnswersArray}
                        quizData={employmentQuiz.data}
                        handleCheckboxAnswer={handleCheckboxAnswer}
                        answerNegative="retiredAddMoreLast5Years: No"
                        answerPositive="retiredAddMoreLast5Years: Yes"
                      />

                      {isAddRetiredImmigrantEmployment && (
                        <>
                          <Formik
                            enableReinitialize
                            initialValues={{
                              [`retiredEmployerName${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `retiredEmployerName${i}`,
                              ),
                              [`retiredStreetName${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `retiredStreetName${i}`,
                              ),
                              [`retiredAptSteFlrN${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `retiredAptSteFlrN${i}`,
                              ),
                              [`retiredCityOrTown${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `retiredCityOrTown${i}`,
                              ),
                              [`retiredProvince${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `retiredProvince${i}`,
                              ),
                              [`postalCode${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `retiredPostalCode${i}`,
                              ),
                              [`retiredOccupation${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `retiredOccupation${i}`,
                              ),
                            }}
                            validationSchema={validationZipCodeSchema}
                            validateOnChange={false}
                            onSubmit={() => {}}
                          >
                            {({ handleBlur, submitForm, validateForm }) => (
                              <Form className={css.form}>
                                <InputField
                                  label="Name of Employer?"
                                  className={css.firstName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `retiredEmployerName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`retiredEmployerName${i}`}
                                />

                                <InputField
                                  label="Street Number and Name"
                                  placeholder="Eg: Microsoft or Self-Employed"
                                  className={css.middleName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `retiredStreetName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`retiredStreetName${i}`}
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
                                        answer: `retiredApt/Ste/Flr${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `retiredApt/Ste/Flr${i}`,
                                    )}
                                  />
                                </div>

                                <InputField
                                  label="Apt/Ste/Flr number"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `retiredAptSteFlrN${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`retiredAptSteFlrN${i}`}
                                />

                                <div>
                                  <span>Country</span>

                                  <SelectField
                                    list={countries}
                                    showDefaultOption
                                    defaultOption=""
                                    onChange={e =>
                                      handleCheckboxAnswer({
                                        id: e.id,
                                        answer: `retiredCountry${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `retiredCountry${i}`,
                                    )}
                                  />
                                </div>

                                {isRetiredImmigrantCountryWorkUSA && (
                                  <div>
                                    <div>
                                      <span>State</span>

                                      <SelectField
                                        list={states}
                                        showDefaultOption
                                        defaultOption=""
                                        onChange={e =>
                                          handleCheckboxAnswer({
                                            id: e.id,
                                            answer: `retiredStates${i}: ${e.answer}`,
                                          })
                                        }
                                        question={
                                          employmentQuiz.data[quizStep - 1]
                                        }
                                        defaultValue={getValueForInput(
                                          getCurentUserAnswer(
                                            quizStep - 1,
                                            userAnswersArray,
                                            employmentQuiz.data,
                                          ),
                                          `retiredStates${i}`,
                                        )}
                                      />
                                    </div>

                                    <InputField
                                      label="ZIP Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        const errors = validateForm();

                                        if (!Object.keys(errors).length) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `retiredPostalCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`postalCode${i}`}
                                    />
                                  </div>
                                )}

                                {!isRetiredImmigrantCountryWorkUSA && (
                                  <div>
                                    <InputField
                                      label="Province"
                                      className={css.lastName}
                                      onBlur={e => {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `retiredProvince${i}: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }}
                                      name={`retiredProvince${i}`}
                                    />

                                    <InputField
                                      label="Postal Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        const errors = await validateForm();

                                        if (!Object.keys(errors).length) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `retiredPostalCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`postalCode${i}`}
                                    />
                                  </div>
                                )}

                                <InputField
                                  label="Your Occupation"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `retiredOccupation${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`retiredOccupation${i}`}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (From)"
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '60',
                                    `retiredEmploymentDatesFrom${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `retiredEmploymentDatesFrom${i}: ${date}`,
                                    });
                                  }}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (To)"
                                  isDisabled={isImmigrantCurrentJob}
                                  value={
                                    isImmigrantCurrentJob
                                      ? 'PRESENT'
                                      : undefined
                                  }
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '60',
                                    `retiredEmploymentDatesTo${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `retiredEmploymentDatesTo${i}: ${date}`,
                                    });
                                  }}
                                />
                              </Form>
                            )}
                          </Formik>
                        </>
                      )}
                    </Fragment>
                  ))}
                </>
              )}
            </div>
          )}

          {currentEmploymentStatus === 'Student' && (
            <div>
              <Formik
                enableReinitialize
                initialValues={{
                  studentUniversityName: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'studentUniversityName',
                  ),
                  studentStreetName: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'studentStreetName',
                  ),
                  studentAptSteFlrN: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'studentAptSteFlrN',
                  ),
                  studentCityOrTown: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'studentCityOrTown',
                  ),
                  studentProvince: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'studentProvince',
                  ),
                  postalCode: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'studentPostalCode',
                  ),
                  studentCcupation: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'studentCcupation',
                  ),
                }}
                validationSchema={validationZipCodeSchema}
                validateOnChange={false}
                onSubmit={() => {}}
              >
                {({ handleBlur, submitForm, validateForm }) => (
                  <Form className={css.form}>
                    <InputField
                      label="Name of University"
                      className={css.firstName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `studentUniversityName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="studentUniversityName"
                    />

                    <InputField
                      label="Street Number and Name"
                      className={css.middleName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `studentStreetName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="studentStreetName"
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
                            answer: `studentApt/Ste/Flr: ${e.answer}`,
                          })
                        }
                        question={employmentQuiz.data[quizStep - 1]}
                        defaultValue={getValueForInput(
                          getCurentUserAnswer(
                            quizStep - 1,
                            userAnswersArray,
                            employmentQuiz.data,
                          ),
                          'studentApt/Ste/Flr',
                        )}
                      />
                    </div>

                    <InputField
                      label="Apt/Ste/Flr number"
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `studentAptSteFlrN: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="studentAptSteFlrN"
                    />

                    <div>
                      <span>Country</span>

                      <SelectField
                        list={countries}
                        showDefaultOption
                        defaultOption=""
                        onChange={e =>
                          handleCheckboxAnswer({
                            id: e.id,
                            answer: `studentCountry: ${e.answer}`,
                          })
                        }
                        question={employmentQuiz.data[quizStep - 1]}
                        defaultValue={getValueForInput(
                          getCurentUserAnswer(
                            quizStep - 1,
                            userAnswersArray,
                            employmentQuiz.data,
                          ),
                          'studentCountry',
                        )}
                      />
                    </div>

                    {isStudentImmigrantCountryWorkUSA && (
                      <div>
                        <div>
                          <span>State</span>

                          <SelectField
                            list={states}
                            showDefaultOption
                            defaultOption=""
                            onChange={e =>
                              handleCheckboxAnswer({
                                id: e.id,
                                answer: `studentStates: ${e.answer}`,
                              })
                            }
                            question={employmentQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'studentStates',
                            )}
                          />
                        </div>
                        <InputField
                          label="ZIP Code"
                          className={css.lastName}
                          onBlur={async e => {
                            const errors = await validateForm();

                            if (!Object.keys(errors).length) {
                              handleBlur(e);
                              handleCheckboxAnswer({
                                id: employmentQuiz.data[quizStep - 1]?.id,
                                answer: `studentPostalCode: ${e.target.value}`,
                              });
                              submitForm();
                            }
                          }}
                          name="postalCode"
                        />
                      </div>
                    )}

                    {!isStudentImmigrantCountryWorkUSA && (
                      <div>
                        <InputField
                          label="Province"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `studentProvince: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="studentProvince"
                        />

                        <InputField
                          label="Postal Code"
                          className={css.lastName}
                          onBlur={async e => {
                            const errors = validateForm();

                            if (!Object.keys(errors).length) {
                              handleBlur(e);
                              handleCheckboxAnswer({
                                id: employmentQuiz.data[quizStep - 1]?.id,
                                answer: `studentPostalCode: ${e.target.value}`,
                              });
                              submitForm();
                            }
                          }}
                          name="postalCode"
                        />
                      </div>
                    )}

                    <InputField
                      label="Your Occupation"
                      disabled
                      value="STUDENT"
                      placeholder="STUDENT"
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `studentOccupation: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="studentOccupation"
                    />

                    <DatePickerSelect
                      title="Since when you have you been unemployed/retired/atending school?"
                      initialDate={getInitialDateValue(
                        userAnswersArray,
                        '60',
                        'studentOrRetiredOrAttendingSince',
                      )}
                      onClick={date => {
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `studentOrRetiredOrAttendingSince: ${date}`,
                        });
                      }}
                    />
                  </Form>
                )}
              </Formik>

              {immigrantEmploymentStatus ===
                'I have had a job in the last 5 years' && (
                <>
                  {Array.from({ length: 1 }, (_, i) => i + 1).map((el, i) => (
                    <Fragment key={`${i + el}`}>
                      <h3
                        className={cn(css.title, css.employmentDetailsAddMore)}
                      >
                        {`Employment Details ${i + 2} - ${initialNames.immigrantName}`}
                      </h3>

                      <BooleanMultiplyQuestion
                        className={cn(
                          css.buttonWrapper,
                          css.unemployedAddMoreLast5YearsButtons,
                        )}
                        title="Add more employment history from past 5 years?"
                        quizStep={quizStep - 1}
                        answers={userAnswersArray}
                        quizData={employmentQuiz.data}
                        handleCheckboxAnswer={handleCheckboxAnswer}
                        answerNegative="studentAddMoreLast5Years: No"
                        answerPositive="studentAddMoreLast5Years: Yes"
                      />

                      {isAddStudentImmigrantEmployment && (
                        <>
                          <Formik
                            enableReinitialize
                            initialValues={{
                              [`studentEmployerName${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `studentEmployerName${i}`,
                              ),
                              [`studentStreetName${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `studentStreetName${i}`,
                              ),
                              [`studentAptSteFlrN${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `studentAptSteFlrN${i}`,
                              ),
                              [`studentCityOrTown${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `studentCityOrTown${i}`,
                              ),
                              [`studentProvince${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `studentProvince${i}`,
                              ),
                              [`postalCode${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `studentPostalCode${i}`,
                              ),
                              [`studentOccupation${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `studentOccupation${i}`,
                              ),
                            }}
                            validationSchema={validationZipCodeSchema}
                            validateOnChange={false}
                            onSubmit={() => {}}
                          >
                            {({ handleBlur, submitForm, validateForm }) => (
                              <Form className={css.form}>
                                <InputField
                                  label="Name of Employer?"
                                  className={css.firstName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `studentEmployerName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`studentEmployerName${i}`}
                                />

                                <InputField
                                  label="Street Number and Name"
                                  placeholder="Eg: Microsoft or Self-Employed"
                                  className={css.middleName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `studentStreetName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`studentStreetName${i}`}
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
                                        answer: `studentApt/Ste/Flr${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `studentApt/Ste/Flr${i}`,
                                    )}
                                  />
                                </div>

                                <InputField
                                  label="Apt/Ste/Flr number"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `studentAptSteFlrN${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`studentAptSteFlrN${i}`}
                                />

                                <div>
                                  <span>Country</span>

                                  <SelectField
                                    list={countries}
                                    showDefaultOption
                                    defaultOption=""
                                    onChange={e =>
                                      handleCheckboxAnswer({
                                        id: e.id,
                                        answer: `studentCountry${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `studentCountry${i}`,
                                    )}
                                  />
                                </div>

                                {isStudentAdditionImmigrantCountryWorkUSA && (
                                  <div>
                                    <div>
                                      <span>State</span>

                                      <SelectField
                                        list={states}
                                        showDefaultOption
                                        defaultOption=""
                                        onChange={e =>
                                          handleCheckboxAnswer({
                                            id: e.id,
                                            answer: `studentStates${i}: ${e.answer}`,
                                          })
                                        }
                                        question={
                                          employmentQuiz.data[quizStep - 1]
                                        }
                                        defaultValue={getValueForInput(
                                          getCurentUserAnswer(
                                            quizStep - 1,
                                            userAnswersArray,
                                            employmentQuiz.data,
                                          ),
                                          `studentStates${i}`,
                                        )}
                                      />
                                    </div>

                                    <InputField
                                      label="ZIP Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        const errors = await validateForm();

                                        if (!Object.keys(errors).length) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `studentPostalCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`postalCode${i}`}
                                    />
                                  </div>
                                )}

                                {!isStudentAdditionImmigrantCountryWorkUSA && (
                                  <div>
                                    <InputField
                                      label="Province"
                                      className={css.lastName}
                                      onBlur={e => {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `studentProvince${i}: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }}
                                      name={`studentProvince${i}`}
                                    />

                                    <InputField
                                      label="Postal Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        const errors = await validateForm();

                                        if (!Object.keys(errors).length) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `studentPostalCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`postalCode${i}`}
                                    />
                                  </div>
                                )}

                                <InputField
                                  label="Your Occupation"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `studentOccupation${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`studentOccupation${i}`}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (From)"
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '60',
                                    `studentEmploymentDatesFrom${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `studentEmploymentDatesFrom${i}: ${date}`,
                                    });
                                  }}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (To)"
                                  isDisabled={isImmigrantCurrentJob}
                                  value={
                                    isImmigrantCurrentJob
                                      ? 'PRESENT'
                                      : undefined
                                  }
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '60',
                                    `studentEmploymentDatesTo${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `studentEmploymentDatesTo${i}: ${date}`,
                                    });
                                  }}
                                />
                              </Form>
                            )}
                          </Formik>
                        </>
                      )}
                    </Fragment>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {quizStep === 3 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              employmentQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.containerDown}>
            <BooleanMultiplyQuestion
              className={cn(css.buttonWrapper)}
              title="What describes your current employment situation best?"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={employmentQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              hasAdditionalOption
              hasSecondAdditionalOption
              answerPositive="currentSponsorEmployment: Working (Employed/Self-employed/Intern)"
              answerNegative="currentSponsorEmployment: Unemployed"
              answerAddition="currentSponsorEmployment: Retired"
              secondAnswerAddition="currentSponsorEmployment: Student"
            />

            {!currentSponsorEmploymentStatus.includes('Working') &&
              currentSponsorEmploymentStatus !== '' && (
                <BooleanMultiplyQuestion
                  className={cn(css.buttonWrapper)}
                  title="Select what applies to you"
                  quizStep={quizStep - 1}
                  answers={userAnswersArray}
                  quizData={employmentQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  hasAdditionalOption
                  answerPositive="employmentSponsorStatus: I have never been employed since I turned 18"
                  answerNegative="employmentSponsorStatus: I have had a job since I turned 18 but not in the last 5 years"
                  answerAddition="employmentSponsorStatus: I have had a job in the last 5 years"
                />
              )}
          </div>
        </div>
      )}

      {quizStep === 4 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              `${employmentQuiz.data[quizStep - 1]?.question}`,
              initialNames,
            )}
          </h2>

          {currentSponsorEmploymentStatus.includes('Working') && (
            <>
              <BooleanMultiplyQuestion
                className={cn(
                  css.buttonWrapper,
                  css.isSponsorSelfEmploymentButtons,
                )}
                title="Is this self-employment?"
                quizStep={quizStep - 1}
                answers={userAnswersArray}
                quizData={employmentQuiz.data}
                handleCheckboxAnswer={handleCheckboxAnswer}
                answerNegative="IsSelfSponsorEmployment: No"
                answerPositive="IsSelfSponsorEmployment: Yes"
              />
              <div>
                <Formik
                  enableReinitialize
                  initialValues={{
                    sponsorWorkingEmployerName: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'sponsorWorkingEmployerName',
                    ),
                    sponsorWorkingStreetName: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'sponsorWorkingStreetName',
                    ),
                    sponsorWorkingAptSteFlrN: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'sponsorWorkingAptSteFlrN',
                    ),
                    sponsorWorkingCityOrTown: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'sponsorWorkingCityOrTown',
                    ),
                    sponsorWorkingProvince: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'sponsorWorkingProvince',
                    ),
                    sponsorWorkingPostalCode: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'sponsorWorkingPostalCode',
                    ),
                    sponsorWorkingZipCode: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'sponsorWorkingZipCode',
                    ),
                    sponsorWorkingOccupation: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        employmentQuiz.data,
                      ),
                      'sponsorWorkingOccupation',
                    ),
                  }}
                  validationSchema={validationZipCodeSchema}
                  validateOnChange={false}
                  onSubmit={() => {}}
                >
                  {({ handleBlur, submitForm, validateForm }) => (
                    <Form className={css.form}>
                      <InputField
                        label="Name of Employer?"
                        className={css.firstName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `sponsorWorkingEmployerName: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="sponsorWorkingEmployerName"
                      />

                      <InputField
                        label="Street Number and Name"
                        className={css.middleName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `sponsorWorkingStreetName: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="sponsorWorkingStreetName"
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
                              answer: `sponsorWorkingApt/Ste/Flr: ${e.answer}`,
                            })
                          }
                          question={employmentQuiz.data[quizStep - 1]}
                          defaultValue={getValueForInput(
                            getCurentUserAnswer(
                              quizStep - 1,
                              userAnswersArray,
                              employmentQuiz.data,
                            ),
                            'sponsorWorkingApt/Ste/Flr',
                          )}
                        />
                      </div>

                      <InputField
                        label="Apt/Ste/Flr number"
                        className={css.lastName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `sponsorWorkingAptSteFlrN: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="sponsorWorkingAptSteFlrN"
                      />

                      <div>
                        <span>Country</span>

                        <SelectField
                          list={countries}
                          showDefaultOption
                          defaultOption=""
                          onChange={e =>
                            handleCheckboxAnswer({
                              id: e.id,
                              answer: `sponsorWorkingCountry: ${e.answer}`,
                            })
                          }
                          question={employmentQuiz.data[quizStep - 1]}
                          defaultValue={getValueForInput(
                            getCurentUserAnswer(
                              quizStep - 1,
                              userAnswersArray,
                              employmentQuiz.data,
                            ),
                            'sponsorWorkingCountry',
                          )}
                        />
                      </div>

                      {isSponsorWorkingCountryWorkUSA && (
                        <div>
                          <div>
                            <span>State</span>

                            <SelectField
                              list={states}
                              showDefaultOption
                              defaultOption=""
                              onChange={e =>
                                handleCheckboxAnswer({
                                  id: e.id,
                                  answer: `sponsorWorkingStates: ${e.answer}`,
                                })
                              }
                              question={employmentQuiz.data[quizStep - 1]}
                              defaultValue={getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                'sponsorWorkingStates',
                              )}
                            />
                          </div>

                          <InputField
                            label="ZIP Code"
                            className={css.lastName}
                            onBlur={async e => {
                              const errors = await validateForm();

                              if (!Object.keys(errors).length) {
                                handleBlur(e);
                                handleCheckboxAnswer({
                                  id: employmentQuiz.data[quizStep - 1]?.id,
                                  answer: `sponsorWorkingZipCode: ${e.target.value}`,
                                });
                                submitForm();
                              }
                            }}
                            name="sponsorWorkingZipCode"
                          />
                        </div>
                      )}

                      {!isSponsorWorkingCountryWorkUSA && (
                        <div>
                          <InputField
                            label="Province"
                            className={css.lastName}
                            onBlur={e => {
                              handleBlur(e);
                              handleCheckboxAnswer({
                                id: employmentQuiz.data[quizStep - 1]?.id,
                                answer: `sponsorWorkingProvince: ${e.target.value}`,
                              });
                              submitForm();
                            }}
                            name="sponsorWorkingProvince"
                          />

                          <InputField
                            label="Postal Code"
                            className={css.lastName}
                            onBlur={async e => {
                              const errors = await validateForm();

                              if (!Object.keys(errors).length) {
                                handleBlur(e);
                                handleCheckboxAnswer({
                                  id: employmentQuiz.data[quizStep - 1]?.id,
                                  answer: `sponsorWorkingPostalCode: ${e.target.value}`,
                                });
                                submitForm();
                              }
                            }}
                            name="sponsorWorkingPostalCode"
                          />
                        </div>
                      )}

                      <InputField
                        label="Your Occupation"
                        className={css.lastName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `sponsorWorkingOccupation: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="sponsorWorkingOccupation"
                      />

                      <DatePickerSelect
                        title="Dates of Employment (From)"
                        initialDate={getInitialDateValue(
                          userAnswersArray,
                          '62',
                          'sponsorWorkingEmploymentDatesFrom',
                        )}
                        onClick={date => {
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `sponsorWorkingEmploymentDatesFrom: ${date}`,
                          });
                        }}
                      />

                      <DatePickerSelect
                        title="Dates of Employment (To)"
                        isDisabled
                        value="PRESENT"
                        initialDate={getInitialDateValue(
                          userAnswersArray,
                          '62',
                          'sponsorWorkingEmploymentDatesTo',
                        )}
                        onClick={date => {
                          handleCheckboxAnswer({
                            id: employmentQuiz.data[quizStep - 1]?.id,
                            answer: `sponsorWorkingEmploymentDatesTo: ${date}`,
                          });
                        }}
                      />
                    </Form>
                  )}
                </Formik>

                {Array.from({ length: 1 }, (_, i) => i + 1).map((el, i) => (
                  <Fragment key={`${i + el}`}>
                    <h3 className={cn(css.title, css.employmentDetailsAddMore)}>
                      {`Employment Details ${i + 2} - ${initialNames.sponsorName}`}
                    </h3>

                    <BooleanMultiplyQuestion
                      className={cn(css.buttonWrapper)}
                      title="Add more employment history from past 5 years?"
                      quizStep={quizStep - 1}
                      answers={userAnswersArray}
                      quizData={employmentQuiz.data}
                      handleCheckboxAnswer={handleCheckboxAnswer}
                      answerNegative="addSponsorWorkingEmployment: No"
                      answerPositive="addSponsorWorkingEmployment: Yes"
                    />

                    {isAddSponsorEmployment && (
                      <>
                        <BooleanMultiplyQuestion
                          className={cn(
                            css.buttonWrapper,
                            css.employmentDetailsCurrentJob,
                          )}
                          title="Is this your current job?"
                          quizStep={quizStep - 1}
                          answers={userAnswersArray}
                          quizData={employmentQuiz.data}
                          handleCheckboxAnswer={handleCheckboxAnswer}
                          answerPositive={`isSponsorWorkingCurrentJob${i + 1}: Yes`}
                          answerNegative={`isSponsorWorkingCurrentJob${i + 1}: No`}
                        />

                        <Formik
                          enableReinitialize
                          initialValues={{
                            [`sponsorWorkingEmployerName${i}`]:
                              getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `sponsorWorkingEmployerName${i}`,
                              ),
                            [`sponsorWorkingStreetName${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `sponsorWorkingStreetName${i}`,
                            ),
                            [`sponsorWorkingAptSteFlrN${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `sponsorWorkingAptSteFlrN${i}`,
                            ),
                            [`sponsorWorkingCityOrTown${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `sponsorWorkingCityOrTown${i}`,
                            ),
                            [`sponsorWorkingProvince${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `sponsorWorkingProvince${i}`,
                            ),
                            [`sponsorWorkingZipCode${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `sponsorWorkingZipCode${i}`,
                            ),
                            [`sponsorWorkingPostalCode${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `sponsorWorkingPostalCode${i}`,
                            ),
                            [`sponsorWorkingOccupation${i}`]: getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              `sponsorWorkingOccupation${i}`,
                            ),
                          }}
                          validationSchema={validationZipCodeSchema}
                          validateOnChange={false}
                          onSubmit={() => {}}
                        >
                          {({ handleBlur, submitForm, validateForm }) => (
                            <Form className={css.form}>
                              <InputField
                                label="Name of Employer?"
                                className={css.firstName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `sponsorWorkingEmployerName${i}: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name={`sponsorWorkingEmployerName${i}`}
                              />

                              <InputField
                                label="Street Number and Name"
                                placeholder="Eg: Microsoft or Self-Employed"
                                className={css.middleName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `sponsorWorkingStreetName${i}: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name={`sponsorWorkingStreetName${i}`}
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
                                      answer: `sponsorWorkingApt/Ste/Flr${i}: ${e.answer}`,
                                    })
                                  }
                                  question={employmentQuiz.data[quizStep - 1]}
                                  defaultValue={getValueForInput(
                                    getCurentUserAnswer(
                                      quizStep - 1,
                                      userAnswersArray,
                                      employmentQuiz.data,
                                    ),
                                    `sponsorWorkingApt/Ste/Flr${i}`,
                                  )}
                                />
                              </div>

                              <InputField
                                label="Apt/Ste/Flr number"
                                className={css.lastName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `sponsorWorkingAptSteFlrN${i}: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name={`sponsorWorkingAptSteFlrN${i}`}
                              />

                              <div>
                                <span>Country</span>

                                <SelectField
                                  list={countries}
                                  showDefaultOption
                                  defaultOption=""
                                  onChange={e =>
                                    handleCheckboxAnswer({
                                      id: e.id,
                                      answer: `sponsorWorkingCountry${i}: ${e.answer}`,
                                    })
                                  }
                                  question={employmentQuiz.data[quizStep - 1]}
                                  defaultValue={getValueForInput(
                                    getCurentUserAnswer(
                                      quizStep - 1,
                                      userAnswersArray,
                                      employmentQuiz.data,
                                    ),
                                    `sponsorWorkingCountry${i}`,
                                  )}
                                />
                              </div>

                              {isSponsorAdditionWorkingCountryWorkUSA && (
                                <div>
                                  <div>
                                    <span>State</span>

                                    <SelectField
                                      list={states}
                                      showDefaultOption
                                      defaultOption=""
                                      onChange={e =>
                                        handleCheckboxAnswer({
                                          id: e.id,
                                          answer: `sponsorWorkingStates${i}: ${e.answer}`,
                                        })
                                      }
                                      question={
                                        employmentQuiz.data[quizStep - 1]
                                      }
                                      defaultValue={getValueForInput(
                                        getCurentUserAnswer(
                                          quizStep - 1,
                                          userAnswersArray,
                                          employmentQuiz.data,
                                        ),
                                        `sponsorWorkingStates${i}`,
                                      )}
                                    />
                                  </div>
                                  <InputField
                                    label="ZIP Code"
                                    className={css.lastName}
                                    onBlur={async e => {
                                      const errors = await validateForm();

                                      if (!Object.keys(errors).length) {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `sponsorWorkingZipCode${i}: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }
                                    }}
                                    name={`sponsorWorkingZipCode${i}`}
                                  />
                                </div>
                              )}

                              {!isSponsorAdditionWorkingCountryWorkUSA && (
                                <div>
                                  <InputField
                                    label="Province"
                                    className={css.lastName}
                                    onBlur={e => {
                                      handleBlur(e);
                                      handleCheckboxAnswer({
                                        id: employmentQuiz.data[quizStep - 1]
                                          ?.id,
                                        answer: `sponsorWorkingProvince${i}: ${e.target.value}`,
                                      });
                                      submitForm();
                                    }}
                                    name={`sponsorWorkingProvince${i}`}
                                  />

                                  <InputField
                                    label="Postal Code"
                                    className={css.lastName}
                                    onBlur={async e => {
                                      const errors = await validateForm();

                                      if (!Object.keys(errors).length) {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `sponsorWorkingPostalCode${i}: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }
                                    }}
                                    name={`sponsorWorkingPostalCode${i}`}
                                  />
                                </div>
                              )}

                              <InputField
                                label="Your Occupation"
                                className={css.lastName}
                                onBlur={e => {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `sponsorWorkingOccupation${i}: ${e.target.value}`,
                                  });
                                  submitForm();
                                }}
                                name={`sponsorWorkingOccupation${i}`}
                              />

                              <DatePickerSelect
                                title="Dates of Employment (From)"
                                initialDate={getInitialDateValue(
                                  userAnswersArray,
                                  '62',
                                  `sponsorWorkingEmploymentDatesFrom${i}`,
                                )}
                                onClick={date => {
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `sponsorWorkingEmploymentDatesFrom${i}: ${date}`,
                                  });
                                }}
                              />

                              <DatePickerSelect
                                title="Dates of Employment (To)"
                                isDisabled={isImmigrantCurrentJob}
                                value={
                                  isImmigrantCurrentJob ? 'PRESENT' : undefined
                                }
                                initialDate={getInitialDateValue(
                                  userAnswersArray,
                                  '62',
                                  `sponsorWorkingEmploymentDatesTo${i}`,
                                )}
                                onClick={date => {
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `sponsorWorkingEmploymentDatesTo${i}: ${date}`,
                                  });
                                }}
                              />
                            </Form>
                          )}
                        </Formik>
                      </>
                    )}
                  </Fragment>
                ))}
              </div>
            </>
          )}

          {currentSponsorEmploymentStatus === 'Unemployed' && (
            <>
              <Formik
                enableReinitialize
                initialValues={{
                  sponsorUnemployedEmployerName: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'sponsorUnemployedEmployerName',
                  ),
                }}
                validate={() => {}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={() => {}}
              >
                {({ handleBlur, submitForm }) => (
                  <Form className={css.containerDown}>
                    <InputField
                      label="Name of Employer?"
                      disabled
                      placeholder="Unemployed"
                      className={css.firstName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `sponsorUnemployedEmployerName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="sponsorUnemployedEmployerName"
                    />

                    <DatePickerSelect
                      title="Since when you have you been unemployed/retired/atending school?"
                      initialDate={getInitialDateValue(
                        userAnswersArray,
                        '62',
                        'sponsorUnemployedSinceWhen',
                      )}
                      onClick={date => {
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `sponsorUnemployedSinceWhen: ${date}`,
                        });
                      }}
                    />
                  </Form>
                )}
              </Formik>

              {sponsorEmploymentStatus ===
                'I have had a job in the last 5 years' && (
                <>
                  <Formik
                    enableReinitialize
                    initialValues={{
                      sponsorUnemployedEmployerName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorUnemployedEmployerName',
                      ),
                      sponsorUnemployedStreetName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorUnemployedStreetName',
                      ),
                      sponsorUnemployedAptSteFlrN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorUnemployedAptSteFlrN',
                      ),
                      sponsorUnemployedCityOrTown: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorUnemployedCityOrTown',
                      ),
                      sponsorUnemployedProvince: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorUnemployedProvince',
                      ),
                      postalCodeSponsorUnemployed: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'postalCodeSponsorUnemployed',
                      ),
                      zipCodeSponsorUnemployed: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'zipCodeSponsorUnemployed',
                      ),
                      sponsorUnemployedOccupation: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorUnemployedOccupation',
                      ),
                    }}
                    validationSchema={validationZipCodeSchema}
                    validateOnChange={false}
                    onSubmit={() => {}}
                  >
                    {({ handleBlur, submitForm, validateForm }) => (
                      <Form
                        className={cn(css.form, css.employmentDetailsAddMore)}
                      >
                        <InputField
                          label="Name of Employer?"
                          className={css.firstName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorUnemployedEmployerName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="sponsorUnemployedEmployerName"
                        />

                        <InputField
                          label="Street Number and Name"
                          className={css.middleName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorUnemployedStreetName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="sponsorUnemployedStreetName"
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
                                answer: `sponsorUnemployedApt/Ste/Flr: ${e.answer}`,
                              })
                            }
                            question={employmentQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'sponsorUnemployedApt/Ste/Flr',
                            )}
                          />
                        </div>

                        <InputField
                          label="Apt/Ste/Flr number"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorUnemployedAptSteFlrN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="sponsorUnemployedAptSteFlrN"
                        />

                        <div>
                          <span>Country</span>

                          <SelectField
                            list={countries}
                            showDefaultOption
                            defaultOption=""
                            onChange={e =>
                              handleCheckboxAnswer({
                                id: e.id,
                                answer: `sponsorUnemployedCountry: ${e.answer}`,
                              })
                            }
                            question={employmentQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'sponsorUnemployedCountry',
                            )}
                          />
                        </div>

                        {isSponsorUnemployedCountryWorkUSA && (
                          <div>
                            <div>
                              <span>State</span>

                              <SelectField
                                list={states}
                                showDefaultOption
                                defaultOption=""
                                onChange={e =>
                                  handleCheckboxAnswer({
                                    id: e.id,
                                    answer: `sponsorUnemployedStates: ${e.answer}`,
                                  })
                                }
                                question={employmentQuiz.data[quizStep - 1]}
                                defaultValue={getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  'sponsorUnemployedStates',
                                )}
                              />
                            </div>
                            <InputField
                              label="ZIP Code"
                              className={css.lastName}
                              onBlur={async e => {
                                const errors = await validateForm();

                                if (!Object.keys(errors).length) {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `zipCodeSponsorUnemployed: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="zipCodeSponsorUnemployed"
                            />
                          </div>
                        )}

                        {!isSponsorUnemployedCountryWorkUSA && (
                          <div>
                            <InputField
                              label="Province"
                              className={css.lastName}
                              onBlur={e => {
                                handleBlur(e);
                                handleCheckboxAnswer({
                                  id: employmentQuiz.data[quizStep - 1]?.id,
                                  answer: `sponsorUnemployedProvince: ${e.target.value}`,
                                });
                                submitForm();
                              }}
                              name="sponsorUnemployedProvince"
                            />

                            <InputField
                              label="Postal Code"
                              className={css.lastName}
                              onBlur={async e => {
                                const errors = await validateForm();

                                if (!Object.keys(errors).length) {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `postalCodeSponsorUnemployed: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="postalCodeSponsorUnemployed"
                            />
                          </div>
                        )}

                        <InputField
                          label="Your Occupation"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorUnemployedOccupation: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="sponsorUnemployedOccupation"
                        />

                        <DatePickerSelect
                          title="Dates of Employment (From)"
                          initialDate={getInitialDateValue(
                            userAnswersArray,
                            '62',
                            'sponsorUnemployedEmploymentDatesFrom',
                          )}
                          onClick={date => {
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorUnemployedEmploymentDatesFrom: ${date}`,
                            });
                          }}
                        />

                        <DatePickerSelect
                          title="Dates of Employment (To)"
                          initialDate={getInitialDateValue(
                            userAnswersArray,
                            '62',
                            'sponsorUnemployedEmploymentDatesTo',
                          )}
                          onClick={date => {
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorUnemployedEmploymentDatesTo: ${date}`,
                            });
                          }}
                        />
                      </Form>
                    )}
                  </Formik>

                  {Array.from({ length: 1 }, (_, i) => i + 1).map((el, i) => (
                    <Fragment key={`${i + el}`}>
                      <h3
                        className={cn(css.title, css.employmentDetailsAddMore)}
                      >
                        {`Employment Details ${i + 2} - ${initialNames.immigrantName}`}
                      </h3>

                      <BooleanMultiplyQuestion
                        className={cn(
                          css.buttonWrapper,
                          css.addMoreSponsorUnemployedLast5YearsButtons,
                        )}
                        title="Add more employment history from past 5 years?"
                        quizStep={quizStep - 1}
                        answers={userAnswersArray}
                        quizData={employmentQuiz.data}
                        handleCheckboxAnswer={handleCheckboxAnswer}
                        answerNegative="addSponsorUnemployedLast5Years: No"
                        answerPositive="addSponsorUnemployedLast5Years: Yes"
                      />

                      {isAddSponsorUnemployedEmployment && (
                        <>
                          <Formik
                            enableReinitialize
                            initialValues={{
                              [`sponsorUnemployedEmployerName${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorUnemployedEmployerName${i}`,
                                ),
                              [`sponsorUnemployedStreetName${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorUnemployedStreetName${i}`,
                                ),
                              [`sponsorUnemployedAptSteFlrN${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorUnemployedAptSteFlrN${i}`,
                                ),
                              [`sponsorUnemployedCityOrTown${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorUnemployedCityOrTown${i}`,
                                ),
                              [`sponsorUnemployedProvince${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorUnemployedProvince${i}`,
                                ),
                              [`sponsorUnemployedPostalCode${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorUnemployedPostalCode${i}`,
                                ),
                              [`sponsorUnemployedZipCode${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorUnemployedZipCode${i}`,
                                ),
                              [`sponsorUnemployedOccupation${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorUnemployedOccupation${i}`,
                                ),
                            }}
                            validationSchema={validationZipCodeSchema}
                            validateOnChange={false}
                            onSubmit={() => {}}
                          >
                            {({ handleBlur, submitForm, validateForm }) => (
                              <Form className={css.form}>
                                <InputField
                                  label="Name of Employer?"
                                  className={css.firstName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorUnemployedEmployerName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorUnemployedEmployerName${i}`}
                                />

                                <InputField
                                  label="Street Number and Name"
                                  placeholder="Eg: Microsoft or Self-Employed"
                                  className={css.middleName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorUnemployedStreetName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorUnemployedStreetName${i}`}
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
                                        answer: `sponsorUnemployedApt/Ste/Flr${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `sponsorUnemployedApt/Ste/Flr${i}`,
                                    )}
                                  />
                                </div>

                                <InputField
                                  label="Apt/Ste/Flr number"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorUnemployedAptSteFlrN${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorUnemployedAptSteFlrN${i}`}
                                />

                                <div>
                                  <span>Country</span>

                                  <SelectField
                                    list={countries}
                                    showDefaultOption
                                    defaultOption=""
                                    onChange={e =>
                                      handleCheckboxAnswer({
                                        id: e.id,
                                        answer: `sponsorUnemployedCountry${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `sponsorUnemployedCountry${i}`,
                                    )}
                                  />
                                </div>

                                {isSponsorUnemployedAdditionCountryWorkUSA && (
                                  <div>
                                    <div>
                                      <span>State</span>

                                      <SelectField
                                        list={states}
                                        showDefaultOption
                                        defaultOption=""
                                        onChange={e =>
                                          handleCheckboxAnswer({
                                            id: e.id,
                                            answer: `sponsorUnemployedStates${i}: ${e.answer}`,
                                          })
                                        }
                                        question={
                                          employmentQuiz.data[quizStep - 1]
                                        }
                                        defaultValue={getValueForInput(
                                          getCurentUserAnswer(
                                            quizStep - 1,
                                            userAnswersArray,
                                            employmentQuiz.data,
                                          ),
                                          `sponsorUnemployedStates${i}`,
                                        )}
                                      />
                                    </div>
                                    <InputField
                                      label="ZIP Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        const error = await validateForm();

                                        if (!Object.keys(error).length) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `sponsorUnemployedZipCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`sponsorUnemployedZipCode${i}`}
                                    />
                                  </div>
                                )}

                                {!isSponsorUnemployedAdditionCountryWorkUSA && (
                                  <div>
                                    <InputField
                                      label="Province"
                                      className={css.lastName}
                                      onBlur={e => {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `sponsorUnemployedProvince${i}: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }}
                                      name={`sponsorUnemployedProvince${i}`}
                                    />

                                    <InputField
                                      label="Postal Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        if (
                                          !Object.keys(await validateForm())
                                            .length
                                        ) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `sponsorUnemployedPostalCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`sponsorUnemployedPostalCode${i}`}
                                    />
                                  </div>
                                )}

                                <InputField
                                  label="Your Occupation"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorUnemployedOccupation${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorUnemployedOccupation${i}`}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (From)"
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '62',
                                    `sponsorUnemployedEmploymentDatesFrom${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorUnemployedEmploymentDatesFrom${i}: ${date}`,
                                    });
                                  }}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (To)"
                                  isDisabled={isImmigrantCurrentJob}
                                  value={
                                    isImmigrantCurrentJob
                                      ? 'PRESENT'
                                      : undefined
                                  }
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '62',
                                    `sponsorUnemployedEmploymentDatesTo${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorUnemployedEmploymentDatesTo${i}: ${date}`,
                                    });
                                  }}
                                />
                              </Form>
                            )}
                          </Formik>
                        </>
                      )}
                    </Fragment>
                  ))}
                </>
              )}
            </>
          )}

          {currentSponsorEmploymentStatus === 'Retired' && (
            <div>
              <div className={css.containerDown}>
                <DatePickerSelect
                  title="Since when you have you been unemployed/retired/atending school?"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '62',
                    'retiredSinceWhen',
                  )}
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: employmentQuiz.data[quizStep - 1]?.id,
                      answer: `retiredSinceWhen: ${date}`,
                    });
                  }}
                />
              </div>

              {sponsorRetiredEmploymentStatus ===
                'I have had a job in the last 5 years' && (
                <>
                  <Formik
                    enableReinitialize
                    initialValues={{
                      sponsorRetiredEmployerName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorRetiredEmployerName',
                      ),
                      sponsorRetiredStreetName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorRetiredStreetName',
                      ),
                      sponsorRetiredAptSteFlrN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorRetiredAptSteFlrN',
                      ),
                      sponsorRetiredCityOrTown: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorRetiredCityOrTown',
                      ),
                      sponsorRetiredProvince: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorRetiredProvince',
                      ),
                      sponsorRetiredPostalCode: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorRetiredPostalCode',
                      ),
                      sponsorRetiredZipCode: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorRetiredZipCode',
                      ),
                      sponsorRetiredOccupation: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          employmentQuiz.data,
                        ),
                        'sponsorRetiredOccupation',
                      ),
                    }}
                    validationSchema={validationZipCodeSchema}
                    validateOnChange={false}
                    onSubmit={() => {}}
                  >
                    {({ handleBlur, submitForm, validateForm }) => (
                      <Form
                        className={cn(css.form, css.employmentDetailsAddMore)}
                      >
                        <InputField
                          label="Name of Employer?"
                          className={css.firstName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorRetiredEmployerName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="sponsorRetiredEmployerName"
                        />

                        <InputField
                          label="Street Number and Name"
                          className={css.middleName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorRetiredStreetName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="sponsorRetiredStreetName"
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
                                answer: `sponsorRetiredApt/Ste/Flr: ${e.answer}`,
                              })
                            }
                            question={employmentQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'sponsorRetiredApt/Ste/Flr',
                            )}
                          />
                        </div>

                        <InputField
                          label="Apt/Ste/Flr number"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorRetiredAptSteFlrN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="sponsorRetiredAptSteFlrN"
                        />

                        <div>
                          <span>Country</span>

                          <SelectField
                            list={countries}
                            showDefaultOption
                            defaultOption=""
                            onChange={e =>
                              handleCheckboxAnswer({
                                id: e.id,
                                answer: `sponsorRetiredCountry: ${e.answer}`,
                              })
                            }
                            question={employmentQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'sponsorRetiredCountry',
                            )}
                          />
                        </div>

                        {isSponsorRetiredCountryWorkUSA && (
                          <div>
                            <div>
                              <span>State</span>

                              <SelectField
                                list={states}
                                showDefaultOption
                                defaultOption=""
                                onChange={e =>
                                  handleCheckboxAnswer({
                                    id: e.id,
                                    answer: `sponsorRetiredStates: ${e.answer}`,
                                  })
                                }
                                question={employmentQuiz.data[quizStep - 1]}
                                defaultValue={getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  'sponsorRetiredStates',
                                )}
                              />
                            </div>
                            <InputField
                              label="ZIP Code"
                              className={css.lastName}
                              onBlur={async e => {
                                if (!Object.keys(await validateForm()).length) {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `sponsorRetiredZipCode: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="sponsorRetiredZipCode"
                            />
                          </div>
                        )}

                        {!isSponsorRetiredCountryWorkUSA && (
                          <div>
                            <InputField
                              label="Province"
                              className={css.lastName}
                              onBlur={e => {
                                handleBlur(e);
                                handleCheckboxAnswer({
                                  id: employmentQuiz.data[quizStep - 1]?.id,
                                  answer: `sponsorRetiredProvince: ${e.target.value}`,
                                });
                                submitForm();
                              }}
                              name="sponsorRetiredProvince"
                            />

                            <InputField
                              label="Postal Code"
                              className={css.lastName}
                              onBlur={async e => {
                                if (!Object.keys(await validateForm()).length) {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: employmentQuiz.data[quizStep - 1]?.id,
                                    answer: `sponsorRetiredPostalCode: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="sponsorRetiredPostalCode"
                            />
                          </div>
                        )}

                        <InputField
                          label="Your Occupation"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorRetiredOccupation: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="sponsorRetiredOccupation"
                        />

                        <DatePickerSelect
                          title="Dates of Employment (From)"
                          initialDate={getInitialDateValue(
                            userAnswersArray,
                            '62',
                            'sponsorRetiredEmploymentDatesFrom',
                          )}
                          onClick={date => {
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorRetiredEmploymentDatesFrom: ${date}`,
                            });
                          }}
                        />

                        <DatePickerSelect
                          title="Dates of Employment (To)"
                          initialDate={getInitialDateValue(
                            userAnswersArray,
                            '62',
                            'sponsorRetiredEmploymentDatesTo',
                          )}
                          onClick={date => {
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorRetiredEmploymentDatesTo: ${date}`,
                            });
                          }}
                        />
                      </Form>
                    )}
                  </Formik>

                  {Array.from({ length: 1 }, (_, i) => i + 1).map((el, i) => (
                    <Fragment key={`${i + el}`}>
                      <h3
                        className={cn(css.title, css.employmentDetailsAddMore)}
                      >
                        {`Employment Details ${i + 2} - ${initialNames.immigrantName}`}
                      </h3>

                      <BooleanMultiplyQuestion
                        className={cn(
                          css.buttonWrapper,
                          css.addSponsorRetiredEmploymentLast5Years,
                        )}
                        title="Add more employment history from past 5 years?"
                        quizStep={quizStep - 1}
                        answers={userAnswersArray}
                        quizData={employmentQuiz.data}
                        handleCheckboxAnswer={handleCheckboxAnswer}
                        answerNegative="addSponsorRetiredEmploymentLast5Years: No"
                        answerPositive="addSponsorRetiredEmploymentLast5Years: Yes"
                      />

                      {isAddSponsorRetiredEmployment && (
                        <>
                          <Formik
                            enableReinitialize
                            initialValues={{
                              [`sponsorRetiredEmployerName${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorRetiredEmployerName${i}`,
                                ),
                              [`sponsorRetiredStreetName${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorRetiredStreetName${i}`,
                                ),
                              [`sponsorRetiredAptSteFlrN${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorRetiredAptSteFlrN${i}`,
                                ),
                              [`sponsorRetiredCityOrTown${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorRetiredCityOrTown${i}`,
                                ),
                              [`sponsorRetiredProvince${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `sponsorRetiredProvince${i}`,
                              ),
                              [`sponsorRetiredPostalCode${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorRetiredPostalCode${i}`,
                                ),
                              [`sponsorRetiredZipCode${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `sponsorRetiredZipCode${i}`,
                              ),
                              [`sponsorRetiredOccupation${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorRetiredOccupation${i}`,
                                ),
                            }}
                            validationSchema={validationZipCodeSchema}
                            validateOnChange={false}
                            onSubmit={() => {}}
                          >
                            {({ handleBlur, submitForm, validateForm }) => (
                              <Form className={css.form}>
                                <InputField
                                  label="Name of Employer?"
                                  className={css.firstName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorRetiredEmployerName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorRetiredEmployerName${i}`}
                                />

                                <InputField
                                  label="Street Number and Name"
                                  placeholder="Eg: Microsoft or Self-Employed"
                                  className={css.middleName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorRetiredStreetName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorRetiredStreetName${i}`}
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
                                        answer: `sponsorRetiredApt/Ste/Flr${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `sponsorRetiredApt/Ste/Flr${i}`,
                                    )}
                                  />
                                </div>

                                <InputField
                                  label="Apt/Ste/Flr number"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorRetiredAptSteFlrN${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorRetiredAptSteFlrN${i}`}
                                />

                                <div>
                                  <span>Country</span>

                                  <SelectField
                                    list={countries}
                                    showDefaultOption
                                    defaultOption=""
                                    onChange={e =>
                                      handleCheckboxAnswer({
                                        id: e.id,
                                        answer: `sponsorRetiredCountry${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `sponsorRetiredCountry${i}`,
                                    )}
                                  />
                                </div>

                                {isSponsorRetiredAdditionCountryWorkUSA && (
                                  <div>
                                    <div>
                                      <span>State</span>

                                      <SelectField
                                        list={states}
                                        showDefaultOption
                                        defaultOption=""
                                        onChange={e =>
                                          handleCheckboxAnswer({
                                            id: e.id,
                                            answer: `sponsorRetiredStates${i}: ${e.answer}`,
                                          })
                                        }
                                        question={
                                          employmentQuiz.data[quizStep - 1]
                                        }
                                        defaultValue={getValueForInput(
                                          getCurentUserAnswer(
                                            quizStep - 1,
                                            userAnswersArray,
                                            employmentQuiz.data,
                                          ),
                                          `sponsorRetiredStates${i}`,
                                        )}
                                      />
                                    </div>
                                    <InputField
                                      label="ZIP Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        if (
                                          !Object.keys(await validateForm())
                                            .length
                                        ) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `sponsorRetiredZipCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`sponsorRetiredZipCode${i}`}
                                    />
                                  </div>
                                )}

                                {!isSponsorRetiredAdditionCountryWorkUSA && (
                                  <div>
                                    <InputField
                                      label="Province"
                                      className={css.lastName}
                                      onBlur={e => {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `sponsorRetiredProvince${i}: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }}
                                      name={`sponsorRetiredProvince${i}`}
                                    />

                                    <InputField
                                      label="Postal Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        if (
                                          !Object.keys(await validateForm())
                                            .length
                                        ) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `sponsorRetiredPostalCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`sponsorRetiredPostalCode${i}`}
                                    />
                                  </div>
                                )}

                                <InputField
                                  label="Your Occupation"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorRetiredOccupation${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorRetiredOccupation${i}`}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (From)"
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '62',
                                    `sponsorRetiredEmploymentDatesFrom${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorRetiredEmploymentDatesFrom${i}: ${date}`,
                                    });
                                  }}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (To)"
                                  isDisabled={isImmigrantCurrentJob}
                                  value={
                                    isImmigrantCurrentJob
                                      ? 'PRESENT'
                                      : undefined
                                  }
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '62',
                                    `sponsorRetiredEmploymentDatesTo${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorRetiredEmploymentDatesTo${i}: ${date}`,
                                    });
                                  }}
                                />
                              </Form>
                            )}
                          </Formik>
                        </>
                      )}
                    </Fragment>
                  ))}
                </>
              )}
            </div>
          )}

          {currentSponsorEmploymentStatus === 'Student' && (
            <div>
              <Formik
                enableReinitialize
                initialValues={{
                  sponsorStudentUniversityName: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'sponsorStudentUniversityName',
                  ),
                  sponsorStudentStreetName: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'sponsorStudentStreetName',
                  ),
                  sponsorStudentAptSteFlrN: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'sponsorStudentAptSteFlrN',
                  ),
                  sponsorStudentCityOrTown: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'sponsorStudentCityOrTown',
                  ),
                  sponsorStudentProvince: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'sponsorStudentProvince',
                  ),
                  sponsorStudentPostalCode: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'sponsorStudentPostalCode',
                  ),
                  sponsorStudentZipCode: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'sponsorStudentZipCode',
                  ),
                  sponsorStudentCcupation: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      employmentQuiz.data,
                    ),
                    'sponsorStudentCcupation',
                  ),
                }}
                validationSchema={validationZipCodeSchema}
                validateOnChange={false}
                onSubmit={() => {}}
              >
                {({ handleBlur, submitForm, validateForm }) => (
                  <Form className={css.form}>
                    <InputField
                      label="Name of University"
                      className={css.firstName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `sponsorStudentUniversityName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="sponsorStudentUniversityName"
                    />

                    <InputField
                      label="Street Number and Name"
                      className={css.middleName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `sponsorStudentStreetName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="sponsorStudentStreetName"
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
                            answer: `sponsorStudentApt/Ste/Flr: ${e.answer}`,
                          })
                        }
                        question={employmentQuiz.data[quizStep - 1]}
                        defaultValue={getValueForInput(
                          getCurentUserAnswer(
                            quizStep - 1,
                            userAnswersArray,
                            employmentQuiz.data,
                          ),
                          'sponsorStudentApt/Ste/Flr',
                        )}
                      />
                    </div>

                    <InputField
                      label="Apt/Ste/Flr number"
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `sponsorStudentAptSteFlrN: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="sponsorStudentAptSteFlrN"
                    />

                    <div>
                      <span>Country</span>

                      <SelectField
                        list={countries}
                        showDefaultOption
                        defaultOption=""
                        onChange={e =>
                          handleCheckboxAnswer({
                            id: e.id,
                            answer: `sponsorStudentCountry: ${e.answer}`,
                          })
                        }
                        question={employmentQuiz.data[quizStep - 1]}
                        defaultValue={getValueForInput(
                          getCurentUserAnswer(
                            quizStep - 1,
                            userAnswersArray,
                            employmentQuiz.data,
                          ),
                          'sponsorStudentCountry',
                        )}
                      />
                    </div>

                    {isSponsorStudentImmigrantCountryWorkUSA && (
                      <div>
                        <div>
                          <span>State</span>

                          <SelectField
                            list={states}
                            showDefaultOption
                            defaultOption=""
                            onChange={e =>
                              handleCheckboxAnswer({
                                id: e.id,
                                answer: `sponsorStudentStates: ${e.answer}`,
                              })
                            }
                            question={employmentQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                employmentQuiz.data,
                              ),
                              'sponsorStudentStates',
                            )}
                          />
                        </div>
                        <InputField
                          label="ZIP Code"
                          className={css.lastName}
                          onBlur={async e => {
                            if (!Object.keys(await validateForm()).length) {
                              handleBlur(e);
                              handleCheckboxAnswer({
                                id: employmentQuiz.data[quizStep - 1]?.id,
                                answer: `sponsorStudentZipCode: ${e.target.value}`,
                              });
                              submitForm();
                            }
                          }}
                          name="sponsorStudentZipCode"
                        />
                      </div>
                    )}

                    {!isSponsorStudentImmigrantCountryWorkUSA && (
                      <div>
                        <InputField
                          label="Province"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: employmentQuiz.data[quizStep - 1]?.id,
                              answer: `sponsorStudentProvince: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="sponsorStudentProvince"
                        />

                        <InputField
                          label="Postal Code"
                          className={css.lastName}
                          onBlur={async e => {
                            if (!Object.keys(await validateForm()).length) {
                              handleBlur(e);
                              handleCheckboxAnswer({
                                id: employmentQuiz.data[quizStep - 1]?.id,
                                answer: `sponsorStudentPostalCode: ${e.target.value}`,
                              });
                              submitForm();
                            }
                          }}
                          name="sponsorStudentPostalCode"
                        />
                      </div>
                    )}

                    <InputField
                      label="Your Occupation"
                      disabled
                      value="STUDENT"
                      placeholder="STUDENT"
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `sponsorStudentOccupation: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="sponsorStudentOccupation"
                    />

                    <DatePickerSelect
                      title="Since when you have you been unemployed/retired/atending school?"
                      initialDate={getInitialDateValue(
                        userAnswersArray,
                        '62',
                        'sponsorStudentOrRetiredOrAttendingSince',
                      )}
                      onClick={date => {
                        handleCheckboxAnswer({
                          id: employmentQuiz.data[quizStep - 1]?.id,
                          answer: `sponsorStudentOrRetiredOrAttendingSince: ${date}`,
                        });
                      }}
                    />
                  </Form>
                )}
              </Formik>

              {sponsorStudentEmploymentStatus ===
                'I have had a job in the last 5 years' && (
                <>
                  {Array.from({ length: 1 }, (_, i) => i + 1).map((el, i) => (
                    <Fragment key={`${i + el}`}>
                      <h3
                        className={cn(css.title, css.employmentDetailsAddMore)}
                      >
                        {`Employment Details ${i + 2} - ${initialNames.immigrantName}`}
                      </h3>

                      <BooleanMultiplyQuestion
                        className={cn(
                          css.buttonWrapper,
                          css.unemployedAddMoreLast5YearsButtons,
                        )}
                        title="Add more employment history from past 5 years?"
                        quizStep={quizStep - 1}
                        answers={userAnswersArray}
                        quizData={employmentQuiz.data}
                        handleCheckboxAnswer={handleCheckboxAnswer}
                        answerNegative="sponsorStudentAddMoreLast5Years: No"
                        answerPositive="sponsorStudentAddMoreLast5Years: Yes"
                      />

                      {isAddSponsorStudentAdditionEmployment && (
                        <>
                          <Formik
                            enableReinitialize
                            initialValues={{
                              [`sponsorStudentEmployerName${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorStudentEmployerName${i}`,
                                ),
                              [`sponsorStudentStreetName${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorStudentStreetName${i}`,
                                ),
                              [`sponsorStudentAptSteFlrN${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorStudentAptSteFlrN${i}`,
                                ),
                              [`sponsorStudentCityOrTown${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorStudentCityOrTown${i}`,
                                ),
                              [`sponsorStudentProvince${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `sponsorStudentProvince${i}`,
                              ),
                              [`sponsorStudentPostalCode${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorStudentPostalCode${i}`,
                                ),
                              [`sponsorStudentZipCode${i}`]: getValueForInput(
                                getCurentUserAnswer(
                                  quizStep - 1,
                                  userAnswersArray,
                                  employmentQuiz.data,
                                ),
                                `sponsorStudentZipCode${i}`,
                              ),
                              [`sponsorStudentOccupation${i}`]:
                                getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    employmentQuiz.data,
                                  ),
                                  `sponsorStudentOccupation${i}`,
                                ),
                            }}
                            validationSchema={validationZipCodeSchema}
                            validateOnChange={false}
                            onSubmit={() => {}}
                          >
                            {({ handleBlur, submitForm, validateForm }) => (
                              <Form className={css.form}>
                                <InputField
                                  label="Name of Employer?"
                                  className={css.firstName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorStudentEmployerName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorStudentEmployerName${i}`}
                                />

                                <InputField
                                  label="Street Number and Name"
                                  placeholder="Eg: Microsoft or Self-Employed"
                                  className={css.middleName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorStudentStreetName${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorStudentStreetName${i}`}
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
                                        answer: `sponsorStudentApt/Ste/Flr${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `sponsorStudentApt/Ste/Flr${i}`,
                                    )}
                                  />
                                </div>

                                <InputField
                                  label="Apt/Ste/Flr number"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorStudentAptSteFlrN${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorStudentAptSteFlrN${i}`}
                                />

                                <div>
                                  <span>Country</span>

                                  <SelectField
                                    list={countries}
                                    showDefaultOption
                                    defaultOption=""
                                    onChange={e =>
                                      handleCheckboxAnswer({
                                        id: e.id,
                                        answer: `sponsorStudentCountry${i}: ${e.answer}`,
                                      })
                                    }
                                    question={employmentQuiz.data[quizStep - 1]}
                                    defaultValue={getValueForInput(
                                      getCurentUserAnswer(
                                        quizStep - 1,
                                        userAnswersArray,
                                        employmentQuiz.data,
                                      ),
                                      `sponsorStudentCountry${i}`,
                                    )}
                                  />
                                </div>

                                {isSponsorStudentAdditionCountryWorkUSA && (
                                  <div>
                                    <div>
                                      <span>State</span>

                                      <SelectField
                                        list={states}
                                        showDefaultOption
                                        defaultOption=""
                                        onChange={e =>
                                          handleCheckboxAnswer({
                                            id: e.id,
                                            answer: `sponsorStudentStates${i}: ${e.answer}`,
                                          })
                                        }
                                        question={
                                          employmentQuiz.data[quizStep - 1]
                                        }
                                        defaultValue={getValueForInput(
                                          getCurentUserAnswer(
                                            quizStep - 1,
                                            userAnswersArray,
                                            employmentQuiz.data,
                                          ),
                                          `sponsorStudentStates${i}`,
                                        )}
                                      />
                                    </div>

                                    <InputField
                                      label="ZIP Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        if (
                                          !Object.keys(await validateForm)
                                            .length
                                        ) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `sponsorStudentZipCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`sponsorStudentZipCode${i}`}
                                    />
                                  </div>
                                )}

                                {!isSponsorStudentAdditionCountryWorkUSA && (
                                  <div>
                                    <InputField
                                      label="Province"
                                      className={css.lastName}
                                      onBlur={e => {
                                        handleBlur(e);
                                        handleCheckboxAnswer({
                                          id: employmentQuiz.data[quizStep - 1]
                                            ?.id,
                                          answer: `sponsorStudentProvince${i}: ${e.target.value}`,
                                        });
                                        submitForm();
                                      }}
                                      name={`sponsorStudentProvince${i}`}
                                    />

                                    <InputField
                                      label="Postal Code"
                                      className={css.lastName}
                                      onBlur={async e => {
                                        if (
                                          !Object.keys(await validateForm())
                                            .length
                                        ) {
                                          handleBlur(e);
                                          handleCheckboxAnswer({
                                            id: employmentQuiz.data[
                                              quizStep - 1
                                            ]?.id,
                                            answer: `sponsorStudentPostalCode${i}: ${e.target.value}`,
                                          });
                                          submitForm();
                                        }
                                      }}
                                      name={`sponsorStudentPostalCode${i}`}
                                    />
                                  </div>
                                )}

                                <InputField
                                  label="Your Occupation"
                                  className={css.lastName}
                                  onBlur={e => {
                                    handleBlur(e);
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorStudentOccupation${i}: ${e.target.value}`,
                                    });
                                    submitForm();
                                  }}
                                  name={`sponsorStudentOccupation${i}`}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (From)"
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '62',
                                    `sponsorStudentEmploymentDatesFrom${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorStudentEmploymentDatesFrom${i}: ${date}`,
                                    });
                                  }}
                                />

                                <DatePickerSelect
                                  title="Dates of Employment (To)"
                                  initialDate={getInitialDateValue(
                                    userAnswersArray,
                                    '62',
                                    `sponsorStudentEmploymentDatesTo${i}`,
                                  )}
                                  onClick={date => {
                                    handleCheckboxAnswer({
                                      id: employmentQuiz.data[quizStep - 1]?.id,
                                      answer: `sponsorStudentEmploymentDatesTo${i}: ${date}`,
                                    });
                                  }}
                                />
                              </Form>
                            )}
                          </Formik>
                        </>
                      )}
                    </Fragment>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {quizStep === 5 && (
        <Summary
          list={tabDTO[5].tabs}
          incompleteQuizItems={employmentQuiz.employmentIncompleteQuizItems}
        />
      )}
    </>
  );
};

export { Employment };
