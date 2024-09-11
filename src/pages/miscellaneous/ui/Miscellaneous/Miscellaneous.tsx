/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { useEffect, useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Form, Formik } from 'formik';
import cn from 'classnames';
import * as Yup from 'yup';

import {
  miscellaneousQuizSelector,
  quizNavigationSelector,
  resetQuizStep,
  setMiscellaneousIncompleteQuizItems,
  setMiscellaneousQuiz,
  setUserAnswers,
  userAnswerSelector,
} from '@/entities/quiz';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
  calculatePercentage,
  getAllAnswersCount,
  getCorrectAnswerToCountMetrics,
  getCurentUserAnswer,
  getIncompleteQuizAnswerIds,
  getReplacedName,
  getValueForInput,
  storeAnswer,
  TUserChoice,
} from '@/shared/utils';
import {
  ECollectionNames,
  EQuestionsDataType,
  EQuestionsTypeId,
  ISponsorImmigrantPair,
} from '@/shared/types';
import {
  getCountry,
  getQuiz,
  getStates,
  getUserAnswers,
  IQuestions,
  updateUserInfo,
} from '@/shared/firebase/services';
import { BooleanMultiplyQuestion, InfoCard, InputField } from '@/shared/ui';

import heandphones from '/public/assets/icons/Headphone.svg';

import css from './Miscellaneous.module.scss';
import { SelectField } from '@/shared/ui/SelectField';
import { Summary } from '@/widgets/summary';
import { tabDTO } from '@/entities/sidebar';

const validationZipCodeSchema = Yup.object({
  postalCode: Yup.string().matches(/^\d{5}$/, 'Must be exactly 5 digits'),
  postalCode0: Yup.string().matches(/^\d{5}$/, 'Must be exactly 5 digits'),
});

const Miscellaneous = () => {
  const dispatch = useAppDispatch();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [currentUserChoiseId, setCurrentUserChoiseId] = useState('');

  const { quizStep } = useAppSelector(quizNavigationSelector);
  const { userAnswers } = useAppSelector(userAnswerSelector);
  const { miscellaneousQuiz } = useAppSelector(miscellaneousQuizSelector);

  const userAnswersArray = Object.values(userAnswers);

  const [userData, setUserData] = useLocalStorage<TUser>('user');

  const [applicantNicknams] = useLocalStorage<ISponsorImmigrantPair>(
    'sponsorImmigrantPair',
  );

  const initialNames: ISponsorImmigrantPair = {
    immigrantName: applicantNicknams?.immigrantName ?? 'immigrant',
    sponsorName: applicantNicknams?.sponsorName ?? 'sponsor',
  };

  // prettier-ignore
  const useInterpreterOrPreparer
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '69')?.answer,
      'useInterpreterOrPreparer',
    );

  // prettier-ignore
  const useSponsorInterpreterOrPreparer
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '70')?.answer,
      'useSponsorInterpreterOrPreparer',
    );

  const interpreterCountry = getValueForInput(
    userAnswersArray.find(el => el.questionId === '69')?.answer,
    'interpreterCountry',
  );

  const preparerCountry = getValueForInput(
    userAnswersArray.find(el => el.questionId === '69')?.answer,
    'preparerCountry',
  );

  const interpreterSponsorCountry = getValueForInput(
    userAnswersArray.find(el => el.questionId === '70')?.answer,
    'interpreterSponsorCountry',
  );

  const preparerSponsorCountry = getValueForInput(
    userAnswersArray.find(el => el.questionId === '70')?.answer,
    'preparerSponsorCountry',
  );

  const handleCheckboxAnswer = async (userChoice: TUserChoice) => {
    setCurrentUserChoiseId(userChoice.id);

    await storeAnswer(
      userAnswers,
      userChoice,
      userData?.user ?? null,
      EQuestionsTypeId.MISCELLANEOUS,
      dispatch,
      setUserAnswers,
      'multipleAnswer',
      EQuestionsDataType.DATA,
    );

    const dataAnswers = await getUserAnswers(
      EQuestionsTypeId.MISCELLANEOUS,
      userData?.user.id ?? '',
    );

    // prettier-ignore
    const [isAnswerRequredIds, updateForAnswerCount]
      = getCorrectAnswerToCountMetrics(miscellaneousQuiz.data, dataAnswers);

    if (isAnswerRequredIds.includes(userChoice.id)) {
      updateUserInfo(
        userData?.user.id ?? '',
        {
          testsCompletedInfo: {
            ...userData?.user.testsCompletedInfo,
            miscellaneous: calculatePercentage(
              getAllAnswersCount(updateForAnswerCount, miscellaneousQuiz.data),
              miscellaneousQuiz.TOTAL_FIELDS,
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
          EQuestionsTypeId.MISCELLANEOUS,
        )) as IQuestions[];

        dispatch(setMiscellaneousQuiz(quizData));
      } catch (error) {
        // console.log(error)
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const dataAnswers = await getUserAnswers(
          EQuestionsTypeId.MISCELLANEOUS,
          userData?.user.id ?? '',
        );

        const incompleteQuizAnswerIds: string[] = getIncompleteQuizAnswerIds(
          Object.values(dataAnswers),
          miscellaneousQuiz.data,
        );

        dispatch(setUserAnswers(dataAnswers));

        dispatch(setMiscellaneousIncompleteQuizItems(incompleteQuizAnswerIds));
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
        <InfoCard icon={heandphones}>
          <h2>Interpreter And Preparer Information For This Application </h2>
          <p>
            This section inquires about any assistance you might have received,
            be it from an interpreter or a preparer, and details about them.
            These answers will be used to populate the declarations and
            certifications section in your forms.
          </p>
        </InfoCard>
      )}

      {quizStep === 1 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              miscellaneousQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.containerDown}>
            <BooleanMultiplyQuestion
              className={css.smallContainer}
              title="I can read and understand English, and I have read and understand every question and instruction on this petition and my answer to every question"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={miscellaneousQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="readNUnderstandEnglish: No"
              answerPositive="readNUnderstandEnglish: Yes"
            />

            <BooleanMultiplyQuestion
              className={css.smallContainer}
              title="Did you use an interpreter or preparer? (Greenbroad is not your interpreter or preparer)"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={miscellaneousQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              hasAdditionalOption
              hasSecondAdditionalOption
              answerNegative="useInterpreterOrPreparer: Interpreter"
              answerPositive="useInterpreterOrPreparer: No"
              answerAddition="useInterpreterOrPreparer: Preparer"
              secondAnswerAddition="useInterpreterOrPreparer: Both"
            />
          </div>

          <div>
            {
              // prettier-ignore
              (useInterpreterOrPreparer === 'Interpreter'
              || useInterpreterOrPreparer === 'Both') && (
                <div>

                  <h3 className={cn(css.title, css.interpreterTitle)}>Interpreter Details</h3>
                  <Formik
                    enableReinitialize
                    initialValues={{
                      interpreterLastName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterLastName',
                      ),
                      interpreterFirstName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterFirstName',
                      ),
                      interpreterBusinessName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterBusinessName',
                      ),
                      interpreterStreetN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterStreetN',
                      ),
                      interpreterAptSteFlrN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterAptSteFlrN',
                      ),
                      interpreterCity: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterCity',
                      ),
                      interpreterPostalCode: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterPostalCode',
                      ),
                      interpreterZipCode: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterZipCode',
                      ),
                      interpreterProvince: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterProvince',
                      ),
                      interpreterDaytimeTelephoneN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterDaytimeTelephoneN',
                      ),
                      interpreterMobileTelephoneN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterMobileTelephoneN',
                      ),
                      interpreterEmailAddress: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterEmailAddress',
                      ),
                      interpreterLanguageTranslated: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterLanguageTranslated',
                      ),
                    }}
                    validationSchema={validationZipCodeSchema}
                    validateOnChange={false}
                    onSubmit={() => {}}
                  >
                    {({ handleBlur, submitForm, validateForm }) => (
                      <Form className={css.form}>
                        <InputField
                          label="Interpreter's Family Name (Last Name)"
                          className={css.middleName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterLastName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterLastName"
                        />

                        <InputField
                          label="Interpreter's Given Name (First Name)"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterFirstName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterFirstName"
                        />

                        <InputField
                          label="Interpreter's Business or Organization Name (if any)"
                          placeholder="Leave blank if not applicable"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterBusinessName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterBusinessName"
                        />

                        <InputField
                          label="Street Number and Name"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterStreetN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterStreetN"
                        />

                        <div>
                          <span>Apt/Ste/Flr</span>

                          <SelectField
                            list={[
                              'Apt', 'Ste', 'Flr',
                            ]}
                            showDefaultOption
                            defaultOption=""
                            onChange={e =>
                              handleCheckboxAnswer({
                                id: e.id,
                                answer: `interpreterAptSteFlr: ${e.answer}`,
                              })}
                            question={miscellaneousQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                miscellaneousQuiz.data,
                              ),
                              'interpreterAptSteFlr',
                            )}
                          />
                        </div>

                        <InputField
                          label="Apt/Ste/Flr Number"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterAptSteFlrN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterAptSteFlrN"
                        />

                        <InputField
                          label="City or Town"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterCity: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterCity"
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
                                answer: `interpreterCountry: ${e.answer}`,
                              })}
                            question={miscellaneousQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                miscellaneousQuiz.data,
                              ),
                              'interpreterCountry',
                            )}
                          />
                        </div>

                        {interpreterCountry === 'United States of America' && (
                          <>
                            <div>
                              <span>
                                State
                              </span>

                              <SelectField
                                list={states}
                                showDefaultOption
                                defaultOption=""
                                onChange={e =>
                                  handleCheckboxAnswer({
                                    id: e.id,
                                    answer: `interpreterStates: ${e.answer}`,
                                  })}
                                question={miscellaneousQuiz.data[quizStep - 1]}
                                defaultValue={getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    miscellaneousQuiz.data,
                                  ),
                                  'interpreterStates',
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
                                    id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                    answer: `interpreterZipCode: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="interpreterZipCode"
                            />
                          </>
                        )}

                        {interpreterCountry !== 'United States of America' && (
                          <>
                            <InputField
                              label="Province"
                              className={css.lastName}
                              onBlur={e => {
                                handleBlur(e);
                                handleCheckboxAnswer({
                                  id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                  answer: `interpreterProvince: ${e.target.value}`,
                                });
                                submitForm();
                              }}
                              name="interpreterProvince"
                            />

                            <InputField
                              label="Postal Code"
                              className={css.lastName}
                              onBlur={async e => {
                                if (!Object.keys(await validateForm()).length) {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                    answer: `interpreterPostalCode: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="interpreterPostalCode"
                            />
                          </>
                        )}

                        <InputField
                          label="Interpreter's Daytime Telephone Number"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterDaytimeTelephoneN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterDaytimeTelephoneN"
                        />
                        <InputField
                          label="Interpreter's Mobile Telephone Number (if any)"
                          placeholder="Leave blank if not applicable"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterMobileTelephoneN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterMobileTelephoneN"
                        />
                        <InputField
                          label="Interpreter's Email Address (if any)"
                          placeholder="Leave blank if not applicable"
                          isCapitalize={false}
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterEmailAddress: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterEmailAddress"
                        />
                        <InputField
                          label="Language name that has been translated"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterLanguageTranslated: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterLanguageTranslated"
                        />
                      </Form>
                    )}
                  </Formik>
                </div>
              )
            }

            {
              // prettier-ignore
              (useInterpreterOrPreparer === 'Preparer'
                || useInterpreterOrPreparer === 'Both') && (
                <div>
                  <h3 className={cn(css.title, css.interpreterTitle)}>Preparer Details</h3>

                  <div className={css.containerDown}>

                    <BooleanMultiplyQuestion
                      className={css.smallContainer}
                      title="Is your preparer an attorney or accredited representative?"
                      quizStep={quizStep - 1}
                      answers={userAnswersArray}
                      quizData={miscellaneousQuiz.data}
                      handleCheckboxAnswer={handleCheckboxAnswer}
                      answerNegative="ssPreparerAttorneyRepresentative: No"
                      answerPositive="ssPreparerAttorneyRepresentative: Yes"
                    />

                    <BooleanMultiplyQuestion
                      className={css.smallContainer}
                      title="Will your attorney's representation extend beyond just form preparation?"
                      quizStep={quizStep - 1}
                      answers={userAnswersArray}
                      quizData={miscellaneousQuiz.data}
                      handleCheckboxAnswer={handleCheckboxAnswer}
                      answerNegative="attorneyRepresentationExtendBeyond: Extends beyond just forms"
                      answerPositive="attorneyRepresentationExtendBeyond: Limited to forms"
                    />
                  </div>

                  <Formik
                    enableReinitialize
                    initialValues={{
                      preparerLastName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerLastName',
                      ),
                      preparerFirstName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerFirstName',
                      ),
                      preparerBusinessName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerBusinessName',
                      ),
                      preparerStreetN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerStreetN',
                      ),
                      preparerAptSteFlrN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerAptSteFlrN',
                      ),
                      preparerCity: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerCity',
                      ),
                      preparerPostalCode: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerPostalCode',
                      ),
                      preparerZipCode: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerZipCode',
                      ),
                      preparerProvince: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerProvince',
                      ),
                      preparerDaytimeTelephoneN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerDaytimeTelephoneN',
                      ),
                      preparerMobileTelephoneN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerMobileTelephoneN',
                      ),
                      preparerEmailAddress: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerEmailAddress',
                      ),
                    }}
                    validationSchema={validationZipCodeSchema}
                    validateOnChange={false}
                    onSubmit={() => {}}
                  >
                    {({ handleBlur, submitForm, validateForm }) => (
                      <Form className={css.form}>
                        <InputField
                          label="Preparer's Family Name (Last Name)"
                          className={css.middleName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerLastName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerLastName"
                        />

                        <InputField
                          label="Preparer's Given Name (First Name)"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerFirstName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerFirstName"
                        />

                        <InputField
                          label="Preparer's Business or Organization Name (if any)"
                          placeholder="Leave blank if not applicable"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerBusinessName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerBusinessName"
                        />

                        <InputField
                          label="Street Number and Name"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerStreetN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerStreetN"
                        />

                        <div>
                          <span>Apt/Ste/Flr</span>

                          <SelectField
                            list={[
                              'Apt', 'Ste', 'Flr',
                            ]}
                            showDefaultOption
                            defaultOption=""
                            onChange={e =>
                              handleCheckboxAnswer({
                                id: e.id,
                                answer: `preparerAptSteFlr: ${e.answer}`,
                              })}
                            question={miscellaneousQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                miscellaneousQuiz.data,
                              ),
                              'preparerAptSteFlr',
                            )}
                          />
                        </div>

                        <InputField
                          label="Apt/Ste/Flr Number"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerAptSteFlrN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerAptSteFlrN"
                        />

                        <InputField
                          label="City or Town"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerCity: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerCity"
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
                                answer: `preparerCountry: ${e.answer}`,
                              })}
                            question={miscellaneousQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                miscellaneousQuiz.data,
                              ),
                              'preparerCountry',
                            )}
                          />
                        </div>

                        {preparerCountry === 'United States of America' && (
                          <>
                            <div>
                              <span>
                                State
                              </span>

                              <SelectField
                                list={states}
                                showDefaultOption
                                defaultOption=""
                                onChange={e =>
                                  handleCheckboxAnswer({
                                    id: e.id,
                                    answer: `preparerStates: ${e.answer}`,
                                  })}
                                question={miscellaneousQuiz.data[quizStep - 1]}
                                defaultValue={getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    miscellaneousQuiz.data,
                                  ),
                                  'preparerStates',
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
                                    id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                    answer: `preparerZipCode: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="preparerZipCode"
                            />
                          </>
                        )}

                        {preparerCountry !== 'United States of America' && (
                          <>
                            <InputField
                              label="Province"
                              className={css.lastName}
                              onBlur={e => {
                                handleBlur(e);
                                handleCheckboxAnswer({
                                  id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                  answer: `preparerProvince: ${e.target.value}`,
                                });
                                submitForm();
                              }}
                              name="preparerProvince"
                            />

                            <InputField
                              label="Postal Code"
                              className={css.lastName}
                              onBlur={async e => {
                                if (!Object.keys(await validateForm()).length) {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                    answer: `preparerPostalCode: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="preparerPostalCode"
                            />
                          </>
                        )}

                        <InputField
                          label="Preparer's Daytime Telephone Number"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerDaytimeTelephoneN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerDaytimeTelephoneN"
                        />

                        <InputField
                          label="Preparer's Mobile Telephone Number (if any)"
                          placeholder="Leave blank if not applicable"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerMobileTelephoneN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerMobileTelephoneN"
                        />
                        <InputField
                          label="Preparer's Email Address (if any)"
                          placeholder="Leave blank if not applicable"
                          isCapitalize={false}
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerEmailAddress: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerEmailAddress"
                        />
                      </Form>
                    )}
                  </Formik>

                </div>
              )
            }
          </div>
        </div>
      )}

      {quizStep === 2 && (
        <div>
          <h2 className={css.title}>
            {`Preparer And Interpreter Details For forms filled by ${initialNames.sponsorName}`}
          </h2>

          <h2 className={css.title}>
            {getReplacedName(
              miscellaneousQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.containerDown}>
            <BooleanMultiplyQuestion
              className={css.smallContainer}
              title="I can read and understand English, and I have read and understand every question and instruction on this petition and my answer to every question"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={miscellaneousQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="readNUnderstandEnglish: No"
              answerPositive="readNUnderstandEnglish: Yes"
            />

            <BooleanMultiplyQuestion
              className={css.smallContainer}
              title="Did you use an interpreter or preparer? (Greenbroad is not your interpreter or preparer)"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={miscellaneousQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              hasAdditionalOption
              hasSecondAdditionalOption
              answerNegative="useSponsorInterpreterOrPreparer: Interpreter"
              answerPositive="useSponsorInterpreterOrPreparer: No"
              answerAddition="useSponsorInterpreterOrPreparer: Preparer"
              secondAnswerAddition="useSponsorInterpreterOrPreparer: Both"
            />
          </div>

          <div>
            {
              // prettier-ignore
              (useSponsorInterpreterOrPreparer === 'Interpreter'
              || useSponsorInterpreterOrPreparer === 'Both') && (
                <div>

                  <h3 className={cn(css.title, css.interpreterTitle)}>Interpreter Details</h3>
                  <Formik
                    enableReinitialize
                    initialValues={{
                      interpreterLastName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterLastName',
                      ),
                      interpreterFirstName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterFirstName',
                      ),
                      interpreterBusinessName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterBusinessName',
                      ),
                      interpreterStreetN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterStreetN',
                      ),
                      interpreterAptSteFlrN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterAptSteFlrN',
                      ),
                      interpreterCity: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterCity',
                      ),
                      interpreterPostalCode: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterPostalCode',
                      ),
                      interpreterZipCode: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterZipCode',
                      ),
                      interpreterProvince: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterProvince',
                      ),
                      interpreterDaytimeTelephoneN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterDaytimeTelephoneN',
                      ),
                      interpreterMobileTelephoneN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterMobileTelephoneN',
                      ),
                      interpreterEmailAddress: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterEmailAddress',
                      ),
                      interpreterLanguageTranslated: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'interpreterLanguageTranslated',
                      ),
                    }}
                    validationSchema={validationZipCodeSchema}
                    validateOnChange={false}
                    onSubmit={() => {}}
                  >
                    {({ handleBlur, submitForm, validateForm }) => (
                      <Form className={css.form}>
                        <InputField
                          label="Interpreter's Family Name (Last Name)"
                          className={css.middleName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterLastName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterLastName"
                        />

                        <InputField
                          label="Interpreter's Given Name (First Name)"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterFirstName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterFirstName"
                        />

                        <InputField
                          label="Interpreter's Business or Organization Name (if any)"
                          placeholder="Leave blank if not applicable"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterBusinessName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterBusinessName"
                        />

                        <InputField
                          label="Street Number and Name"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterStreetN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterStreetN"
                        />

                        <div>
                          <span>Apt/Ste/Flr</span>

                          <SelectField
                            list={[
                              'Apt', 'Ste', 'Flr',
                            ]}
                            showDefaultOption
                            defaultOption=""
                            onChange={e =>
                              handleCheckboxAnswer({
                                id: e.id,
                                answer: `apt/Ste/Flr: ${e.answer}`,
                              })}
                            question={miscellaneousQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                miscellaneousQuiz.data,
                              ),
                              'apt/Ste/Flr',
                            )}
                          />
                        </div>

                        <InputField
                          label="Apt/Ste/Flr Number"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterAptSteFlrN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterAptSteFlrN"
                        />

                        <InputField
                          label="City or Town"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterCity: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterCity"
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
                                answer: `interpreterSponsorCountry: ${e.answer}`,
                              })}
                            question={miscellaneousQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                miscellaneousQuiz.data,
                              ),
                              'interpreterSponsorCountry',
                            )}
                          />
                        </div>

                        {interpreterSponsorCountry === 'United States of America' && (
                          <>
                            <div>
                              <span>
                                State
                              </span>

                              <SelectField
                                list={states}
                                showDefaultOption
                                defaultOption=""
                                onChange={e =>
                                  handleCheckboxAnswer({
                                    id: e.id,
                                    answer: `interpreterStates: ${e.answer}`,
                                  })}
                                question={miscellaneousQuiz.data[quizStep - 1]}
                                defaultValue={getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    miscellaneousQuiz.data,
                                  ),
                                  'interpreterStates',
                                )}
                              />
                            </div>

                            <InputField
                              label="ZIP Code"
                              className={css.lastName}
                              onBlur={async e => {
                                if (!Object.keys(await validateForm).length) {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                    answer: `interpreterZipCode: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="interpreterZipCode"
                            />
                          </>
                        )}

                        {interpreterSponsorCountry !== 'United States of America' && (
                          <>
                            <InputField
                              label="Province"
                              className={css.lastName}
                              onBlur={e => {
                                handleBlur(e);
                                handleCheckboxAnswer({
                                  id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                  answer: `interpreterProvince: ${e.target.value}`,
                                });
                                submitForm();
                              }}
                              name="interpreterProvince"
                            />

                            <InputField
                              label="Postal Code"
                              className={css.lastName}
                              onBlur={async e => {
                                if (!Object.keys(await validateForm()).length) {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                    answer: `interpreterPostalCode: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="interpreterPostalCode"
                            />
                          </>
                        )}

                        <InputField
                          label="Interpreter's Daytime Telephone Number"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterDaytimeTelephoneN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterDaytimeTelephoneN"
                        />

                        <InputField
                          label="Interpreter's Mobile Telephone Number (if any)"
                          placeholder="Leave blank if not applicable"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterMobileTelephoneN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterMobileTelephoneN"
                        />

                        <InputField
                          label="Interpreter's Email Address (if any)"
                          placeholder="Leave blank if not applicable"
                          className={css.lastName}
                          isCapitalize={false}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterEmailAddress: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterEmailAddress"
                        />

                        <InputField
                          label="Language name that has been translated"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `interpreterLanguageTranslated: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="interpreterLanguageTranslated"
                        />
                      </Form>
                    )}
                  </Formik>
                </div>
              )
            }

            {
              // prettier-ignore
              (useSponsorInterpreterOrPreparer === 'Preparer'
                || useSponsorInterpreterOrPreparer === 'Both') && (
                <div>
                  <h3 className={cn(css.title, css.interpreterTitle)}>Preparer Details</h3>

                  <div className={css.containerDown}>

                    <BooleanMultiplyQuestion
                      className={css.smallContainer}
                      title="Is your preparer an attorney or accredited representative?"
                      quizStep={quizStep - 1}
                      answers={userAnswersArray}
                      quizData={miscellaneousQuiz.data}
                      handleCheckboxAnswer={handleCheckboxAnswer}
                      answerNegative="ssPreparerAttorneyRepresentative: No"
                      answerPositive="ssPreparerAttorneyRepresentative: Yes"
                    />

                    <BooleanMultiplyQuestion
                      className={css.smallContainer}
                      title="Will your attorney's representation extend beyond just form preparation?"
                      quizStep={quizStep - 1}
                      answers={userAnswersArray}
                      quizData={miscellaneousQuiz.data}
                      handleCheckboxAnswer={handleCheckboxAnswer}
                      answerNegative="attorneyRepresentationExtendBeyond: Extends beyond just forms"
                      answerPositive="attorneyRepresentationExtendBeyond: Limited to forms"
                    />
                  </div>

                  <Formik
                    enableReinitialize
                    initialValues={{
                      preparerLastName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerLastName',
                      ),
                      preparerFirstName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerFirstName',
                      ),
                      preparerBusinessName: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerBusinessName',
                      ),
                      preparerStreetN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerStreetN',
                      ),
                      preparerAptSteFlrN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerAptSteFlrN',
                      ),
                      preparerCity: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerCity',
                      ),
                      preparerPostalCode: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerPostalCode',
                      ),
                      preparerZipCode: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerZipCode',
                      ),
                      preparerProvince: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerProvince',
                      ),
                      preparerDaytimeTelephoneN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerDaytimeTelephoneN',
                      ),
                      preparerMobileTelephoneN: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerMobileTelephoneN',
                      ),
                      preparerEmailAddress: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          miscellaneousQuiz.data,
                        ),
                        'preparerEmailAddress',
                      ),
                    }}
                    validationSchema={validationZipCodeSchema}
                    validateOnChange={false}
                    onSubmit={() => {}}
                  >
                    {({ handleBlur, submitForm, validateForm }) => (
                      <Form className={css.form}>
                        <InputField
                          label="Preparer's Family Name (Last Name)"
                          className={css.middleName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerLastName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerLastName"
                        />

                        <InputField
                          label="Preparer's Given Name (First Name)"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerFirstName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerFirstName"
                        />

                        <InputField
                          label="Preparer's Business or Organization Name (if any)"
                          placeholder="Leave blank if not applicable"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerBusinessName: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerBusinessName"
                        />

                        <InputField
                          label="Street Number and Name"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerStreetN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerStreetN"
                        />

                        <div>
                          <span>Apt/Ste/Flr</span>

                          <SelectField
                            list={[
                              'Apt', 'Ste', 'Flr',
                            ]}
                            showDefaultOption
                            defaultOption=""
                            onChange={e =>
                              handleCheckboxAnswer({
                                id: e.id,
                                answer: `apt/Ste/Flr: ${e.answer}`,
                              })}
                            question={miscellaneousQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                miscellaneousQuiz.data,
                              ),
                              'apt/Ste/Flr',
                            )}
                          />
                        </div>

                        <InputField
                          label="Apt/Ste/Flr Number"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerAptSteFlrN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerAptSteFlrN"
                        />

                        <InputField
                          label="City or Town"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerCity: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerCity"
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
                                answer: `preparerSponsorCountry: ${e.answer}`,
                              })}
                            question={miscellaneousQuiz.data[quizStep - 1]}
                            defaultValue={getValueForInput(
                              getCurentUserAnswer(
                                quizStep - 1,
                                userAnswersArray,
                                miscellaneousQuiz.data,
                              ),
                              'preparerSponsorCountry',
                            )}
                          />
                        </div>

                        {preparerSponsorCountry === 'United States of America' && (
                          <>
                            <div>
                              <span>
                                State
                              </span>

                              <SelectField
                                list={states}
                                showDefaultOption
                                defaultOption=""
                                onChange={e =>
                                  handleCheckboxAnswer({
                                    id: e.id,
                                    answer: `preparerStates: ${e.answer}`,
                                  })}
                                question={miscellaneousQuiz.data[quizStep - 1]}
                                defaultValue={getValueForInput(
                                  getCurentUserAnswer(
                                    quizStep - 1,
                                    userAnswersArray,
                                    miscellaneousQuiz.data,
                                  ),
                                  'preparerStates',
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
                                    id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                    answer: `preparerZipCode: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="preparerZipCode"
                            />
                          </>
                        )}

                        {preparerSponsorCountry !== 'United States of America' && (
                          <>
                            <InputField
                              label="Province"
                              className={css.lastName}
                              onBlur={e => {
                                handleBlur(e);
                                handleCheckboxAnswer({
                                  id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                  answer: `preparerProvince: ${e.target.value}`,
                                });
                                submitForm();
                              }}
                              name="preparerProvince"
                            />

                            <InputField
                              label="Postal Code"
                              className={css.lastName}
                              onBlur={async e => {
                                if (!Object.keys(await validateForm()).length) {
                                  handleBlur(e);
                                  handleCheckboxAnswer({
                                    id: miscellaneousQuiz.data[quizStep - 1]?.id,
                                    answer: `preparerPostalCode: ${e.target.value}`,
                                  });
                                  submitForm();
                                }
                              }}
                              name="preparerPostalCode"
                            />
                          </>
                        )}

                        <InputField
                          label="Preparer's Daytime Telephone Number"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerDaytimeTelephoneN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerDaytimeTelephoneN"
                        />

                        <InputField
                          label="Preparer's Mobile Telephone Number (if any)"
                          placeholder="Leave blank if not applicable"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerMobileTelephoneN: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerMobileTelephoneN"
                        />

                        <InputField
                          label="Preparer's Email Address (if any)"
                          placeholder="Leave blank if not applicable"
                          isCapitalize={false}
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: miscellaneousQuiz.data[quizStep - 1]?.id,
                              answer: `preparerEmailAddress: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="preparerEmailAddress"
                        />
                      </Form>
                    )}
                  </Formik>

                </div>
              )
            }
          </div>
        </div>
      )}

      {quizStep === 3 && (
        <Summary
          list={tabDTO[8].tabs}
          incompleteQuizItems={
            miscellaneousQuiz.miscellaneousIncompleteQuizItems
          }
        />
      )}
    </>
  );
};

export { Miscellaneous };
