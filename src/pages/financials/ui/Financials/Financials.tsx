/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { useLocalStorage } from '@uidotdev/usehooks';
import { FC, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import cn from 'classnames';
import {
  quizNavigationSelector,
  resetQuizStep,
  setUserAnswers,
  userAnswerSelector,
} from '@/entities/quiz';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
  ECollectionNames,
  EQuestionsDataType,
  EQuestionsTypeId,
  ISponsorImmigrantPair,
} from '@/shared/types';
import {
  financialsQuizSelector,
  setFinancialsIncompleteQuizItems,
  setFinancialsQuiz,
} from '@/entities/quiz/financials/model/slice';
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
  getQuiz,
  getUserAnswers,
  IQuestions,
  updateUserInfo,
} from '@/shared/firebase/services';
import { BooleanMultiplyQuestion, InfoCard, InputField } from '@/shared/ui';

import donates from '/public/assets/icons/Donate.svg';

import css from './Financials.module.scss';
import { CheckboxGroup } from '@/widgets/checkbox-group';
import { financialsFederalTaxReturn } from '@/entities/multi-select';
import { SelectField } from '@/shared/ui/SelectField';
import { tabDTO } from '@/entities/sidebar';
import { Summary } from '@/widgets/summary';

type TFinancialsProps = object;

const Financials: FC<TFinancialsProps> = () => {
  const dispatch = useAppDispatch();
  const [currentUserChoiseId, setCurrentUserChoiseId] = useState('');

  const { quizStep } = useAppSelector(quizNavigationSelector);
  const { userAnswers } = useAppSelector(userAnswerSelector);
  const { financialsQuiz } = useAppSelector(financialsQuizSelector);

  const userAnswersArray = Object.values(userAnswers);

  const [userData, setUserData] = useLocalStorage<TUser>('user');

  // immigrantName sponsoringName
  // 63 - 68
  const mostRecentTaxYear1 = getCurentUserAnswer(
    quizStep - 1,
    userAnswersArray,
    financialsQuiz.data,
  )?.find((el: string) => el.includes('Most'));

  const secondRecentTaxYear2 = getCurentUserAnswer(
    quizStep - 1,
    userAnswersArray,
    financialsQuiz.data,
  )?.find((el: string) => el?.includes('Second'));

  const thirdRecentTaxYear3 = getCurentUserAnswer(
    quizStep - 1,
    userAnswersArray,
    financialsQuiz.data,
  )?.find((el: string) => el?.includes('Third'));

  const isThreeOptionActive =
    mostRecentTaxYear1 && secondRecentTaxYear2 && thirdRecentTaxYear3;

  const [applicantNicknams] = useLocalStorage<ISponsorImmigrantPair>(
    'sponsorImmigrantPair',
  );

  // prettier-ignore
  const hasSocialSecurityAdministration
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '68')?.answer,
      'socialSecurityAdministration',
    ) === 'Yes';

  // prettier-ignore
  const isFileLastRaxReturnJointly
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '63')?.answer,
      'fileLastRaxReturnJointly',
    ) === 'Yes';

  // prettier-ignore
  const nonDependentRelativesResidingWithYou
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '65')?.answer,
      'nonDependentRelativesResidingWithYou',
    ) === 'Yes';

  const initialNames: ISponsorImmigrantPair = {
    immigrantName: applicantNicknams?.immigrantName ?? 'immigrant',
    sponsorName: applicantNicknams?.sponsorName ?? 'sponsor',
  };

  const handleCheckboxAnswer = async (userChoice: TUserChoice) => {
    setCurrentUserChoiseId(userChoice.id);

    await storeAnswer(
      userAnswers,
      userChoice,
      userData?.user ?? null,
      EQuestionsTypeId.FINANCIALS,
      dispatch,
      setUserAnswers,
      'multipleAnswer',
      EQuestionsDataType.DATA,
    );

    const dataAnswers = await getUserAnswers(
      EQuestionsTypeId.FINANCIALS,
      userData?.user.id ?? '',
    );

    // prettier-ignore
    const [isAnswerRequredIds, updateForAnswerCount]
        = getCorrectAnswerToCountMetrics(financialsQuiz.data, dataAnswers);

    if (isAnswerRequredIds.includes(userChoice.id)) {
      updateUserInfo(
        userData?.user.id ?? '',
        {
          testsCompletedInfo: {
            ...userData?.user.testsCompletedInfo,
            financials: calculatePercentage(
              getAllAnswersCount(updateForAnswerCount, financialsQuiz.data),
              financialsQuiz.TOTAL_FIELDS,
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
          EQuestionsTypeId.FINANCIALS,
        )) as IQuestions[];

        dispatch(setFinancialsQuiz(quizData));
      } catch (error) {
        // console.log(error)
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const dataAnswers = await getUserAnswers(
          EQuestionsTypeId.FINANCIALS,
          userData?.user.id ?? '',
        );

        const incompleteQuizAnswerIds: string[] = getIncompleteQuizAnswerIds(
          Object.values(dataAnswers),
          financialsQuiz.data,
        );

        dispatch(setUserAnswers(dataAnswers));

        dispatch(setFinancialsIncompleteQuizItems(incompleteQuizAnswerIds));
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
    dispatch(resetQuizStep());
  }, [dispatch]);

  return (
    <>
      {quizStep === 0 && (
        <InfoCard icon={donates}>
          <h2>Financial & Tax Details Needed Next</h2>
          <p>
            In this section, we&apos;ll capture your financial landscape, from
            your tax filings over the years to your current assets and income.
            It&apos;s crucial to provide precise and comprehensive details, as
            these elements are pivotal in evaluations. Your consistency in
            submitting accurate data will streamline the assessment and
            processing journey.
          </p>
        </InfoCard>
      )}

      {quizStep === 1 && (
        <div>
          <h2 className={css.title}>Tax Filings Status</h2>

          <BooleanMultiplyQuestion
            className={css.smallContainer}
            title={getReplacedName(
              financialsQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            quizData={financialsQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative="fileLastRaxReturnJointly: No"
            answerPositive="fileLastRaxReturnJointly: Yes"
          />
        </div>
      )}

      {quizStep === 2 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              financialsQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.financialsFederalTaxReturnWrapper}>
            <h2 className={css.financialsFederalTaxReturn}>
              Select the years that you filed a federal tax return for
            </h2>

            <CheckboxGroup
              checkedItems={getCurentUserAnswer(
                quizStep - 1,
                userAnswersArray,
                financialsQuiz.data,
              )}
              questionId={financialsQuiz.data[quizStep - 1]?.id}
              onClick={handleCheckboxAnswer}
              className={css.immigrationPreference}
              checkBoxDTO={financialsFederalTaxReturn}
            />
          </div>

          {isThreeOptionActive && (
            <BooleanMultiplyQuestion
              className={css.smallContainer}
              title="(Optional) I have attached photocopies or transcripts of my Federal income tax returns for my second and third most recent tax years. Select this is you plan on attaching these 2 documents in evidence section"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={financialsQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="attachedTaxReturnsForSecondAndThirdMostRecentYears: No"
              answerPositive="attachedTaxReturnsForSecondAndThirdMostRecentYears: Yes"
            />
          )}

          <Formik
            enableReinitialize
            initialValues={{
              mostRecentTaxYear: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'mostRecentTaxYear',
              ),
              enterAdjustedGross1: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'enterAdjustedGross1',
              ),
              secondRecentTaxYear: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'secondRecentTaxYear',
              ),
              enterAdjustedGross2: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'enterAdjustedGross2',
              ),
              thirdRecentTaxYear: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'thirdRecentTaxYear',
              ),
              enterAdjustedGross3: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'enterAdjustedGross3',
              ),
            }}
            validate={() => {}}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {({ handleBlur, submitForm }) => (
              <Form className={css.questionTax}>
                {mostRecentTaxYear1 && (
                  <div>
                    <InputField
                      label="Whats your most recent tax year?"
                      className={css.middleName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `mostRecentTaxYear: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="mostRecentTaxYear"
                    />

                    <InputField
                      label="Enter adjusted gross income for"
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `enterAdjustedGross1: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="enterAdjustedGross1"
                    />
                  </div>
                )}

                {secondRecentTaxYear2 && (
                  <div>
                    <InputField
                      label="Whats your second recent tax year?"
                      className={css.middleName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `secondRecentTaxYear: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="secondRecentTaxYear"
                    />

                    <InputField
                      label="Enter adjusted gross income for"
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `enterAdjustedGross2: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="enterAdjustedGross2"
                    />
                  </div>
                )}

                {thirdRecentTaxYear3 && (
                  <div>
                    <InputField
                      label="Whats your third recent tax year?"
                      className={css.middleName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `thirdRecentTaxYear: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="thirdRecentTaxYear"
                    />

                    <InputField
                      label="Enter adjusted gross income for"
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `enterAdjustedGross3: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="enterAdjustedGross3"
                    />
                  </div>
                )}
              </Form>
            )}
          </Formik>

          {!isThreeOptionActive && (
            <BooleanMultiplyQuestion
              className={css.smallContainer}
              title="I was not required to file a Federal income tax return as my income was below the IRS required level and I have attached evidence to support this."
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={financialsQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="fileLastRaxReturnJointly: No"
              answerPositive="fileLastRaxReturnJointly: Yes"
            />
          )}
        </div>
      )}

      {quizStep === 3 && (
        <div>
          <h2 className={css.title}>Tax Filings - Dependents</h2>

          <h4 style={{ marginBottom: '2rem' }} className={css.title}>
            {isFileLastRaxReturnJointly
              ? getReplacedName(
                  financialsQuiz.data[quizStep - 1]?.question,
                  initialNames,
                )
              : `${initialNames.sponsorName}'s Dependents`}
          </h4>

          <Formik
            enableReinitialize
            initialValues={{
              howManyDependentChildren: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'howManyDependentChildren',
              ),
              howManyDependentOther: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'howManyDependentOther',
              ),
            }}
            validate={() => {}}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {({ handleBlur, submitForm }) => (
              <Form className={css.questionTax}>
                <div>
                  <InputField
                    label="How many dependent children do you have? (as per tax return)"
                    className={css.middleName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: financialsQuiz.data[quizStep - 1]?.id,
                        answer: `howManyDependentChildren: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="howManyDependentChildren"
                  />

                  <InputField
                    label="How many other dependents do you have? (as per tax return)"
                    className={css.lastName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: financialsQuiz.data[quizStep - 1]?.id,
                        answer: `howManyDependentOther: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="howManyDependentOther"
                  />
                </div>
              </Form>
            )}
          </Formik>

          {!isFileLastRaxReturnJointly && (
            <>
              <h4 style={{ marginBottom: '2rem' }} className={css.title}>
                {`${initialNames.immigrantName}'s Dependents`}
              </h4>

              <Formik
                enableReinitialize
                initialValues={{
                  howManyDependentChildren: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      financialsQuiz.data,
                    ),
                    'howManyDependentChildrenImmigrant',
                  ),
                  howManyDependentOther: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      financialsQuiz.data,
                    ),
                    'howManyDependentOtherImmigrant',
                  ),
                }}
                validate={() => {}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={() => {}}
              >
                {({ handleBlur, submitForm }) => (
                  <Form className={css.questionTax}>
                    <div style={{ marginBottom: '3rem' }}>
                      <InputField
                        label="How many dependent children do you have? (as per tax return)"
                        className={css.middleName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: financialsQuiz.data[quizStep - 1]?.id,
                            answer: `howManyDependentChildrenImmigrant: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="howManyDependentChildrenImmigrant"
                      />

                      <InputField
                        label="How many other dependents do you have? (as per tax return)"
                        className={css.lastName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: financialsQuiz.data[quizStep - 1]?.id,
                            answer: `howManyDependentOtherImmigrant: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="howManyDependentOtherImmigrant"
                      />
                    </div>

                    <div className={css.containerDown}>
                      <BooleanMultiplyQuestion
                        className={cn(css.buttonWrapper)}
                        title="Do you have parents, unmarried siblings under the age of 21 or unmarried children residing with you and they are not claimed as dependents on your tax return?"
                        quizStep={quizStep - 1}
                        answers={userAnswersArray}
                        quizData={financialsQuiz.data}
                        handleCheckboxAnswer={handleCheckboxAnswer}
                        answerNegative="nonDependentRelativesResidingWithYou: No"
                        answerPositive="nonDependentRelativesResidingWithYou: Yes"
                      />

                      {nonDependentRelativesResidingWithYou && (
                        <InputField
                          label="How many such people reside with you? (only as per above categorization)"
                          className={css.lastName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: financialsQuiz.data[quizStep - 1]?.id,
                              answer: `numberOfPeopleResidingWithYouAsPerCategorization: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="numberOfPeopleResidingWithYouAsPerCategorization"
                        />
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </div>
      )}

      {quizStep === 4 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              financialsQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <h4 className={css.subTitle}>
            {`${initialNames.sponsorName}'s Current Income Information`}
          </h4>

          <Formik
            enableReinitialize
            initialValues={{
              socialSecurityNumberSponsor: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'socialSecurityNumberSponsor',
              ),
              sponsorCurrentTotalIncomeProjected: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'sponsorCurrentTotalIncomeProjected',
              ),
            }}
            validate={() => {}}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {({ handleBlur, submitForm }) => (
              <Form className={css.containerDown}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <InputField
                    label="Enter your social security number"
                    className={css.middleName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: financialsQuiz.data[quizStep - 1]?.id,
                        answer: `socialSecurityNumberSponsor: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="socialSecurityNumberSponsor"
                  />

                  <InputField
                    label={`${initialNames.sponsorName}, What is your current total income? (this year, projected)`}
                    className={css.lastName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: financialsQuiz.data[quizStep - 1]?.id,
                        answer: `sponsorCurrentTotalIncomeProjected: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="sponsorCurrentTotalIncomeProjected"
                  />
                </div>
              </Form>
            )}
          </Formik>

          <h4 className={cn(css.subTitle, css.immigrantIncomeInformation)}>
            {`${initialNames.immigrantName}'s Current Income Information`}
          </h4>

          <Formik
            enableReinitialize
            initialValues={{
              immigrantNameTotalIncome: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'immigrantNameTotalIncome',
              ),
            }}
            validate={() => {}}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {({ handleBlur, submitForm }) => (
              <Form className={css.containerDown}>
                <div>
                  <InputField
                    label={`${initialNames.immigrantName}, What is your current total income? (this year, projected)`}
                    className={css.middleName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: financialsQuiz.data[quizStep - 1]?.id,
                        answer: `immigrantNameTotalIncome: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="immigrantNameTotalIncome"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {quizStep === 5 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              financialsQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            initialValues={{
              immigrantCurrentBalance: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'immigrantCurrentBalance',
              ),
              immigrantCurrentNetValue: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'immigrantCurrentNetValue',
              ),
              immigrantCurrentOtherValue: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'immigrantCurrentOtherValue',
              ),
              immigrantTotalHouseholdSize: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'immigrantTotalHouseholdSize',
              ),
              sponsorCurrentBalance: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'sponsorCurrentBalance',
              ),
              sponsorCurrentNetValue: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'sponsorCurrentNetValue',
              ),
              sponsorCurrentOtherValue: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  financialsQuiz.data,
                ),
                'sponsorCurrentOtherValue',
              ),
            }}
            validate={() => {}}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {({ handleBlur, submitForm }) => (
              <Form>
                <div>
                  <h4 className={css.subTitle}>
                    {`Assets of ${initialNames.sponsorName}`}
                  </h4>
                  <div className={css.rowInputs}>
                    <InputField
                      label={`${initialNames.sponsorName}, What is the current balance of all your savings and checking accounts?`}
                      className={css.middleName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `sponsorCurrentBalance: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="sponsorCurrentBalance"
                    />

                    <InputField
                      label={`${initialNames.sponsorName}, What is your current net value of owned real estate?`}
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `sponsorCurrentNetValue: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="sponsorCurrentNetValue"
                    />

                    <InputField
                      label={`${initialNames.sponsorName}, What is the current value of all stocks, bonds or other money instruments you own?`}
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `sponsorCurrentOtherValue: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="sponsorCurrentOtherValue"
                    />
                  </div>
                </div>

                <div className={css.assetsInfoWrapp}>
                  <h4 className={css.subTitle}>
                    {`Assets of ${initialNames.immigrantName}`}
                  </h4>
                  <div className={css.rowInputs}>
                    <InputField
                      label={`${initialNames.immigrantName}, What is the current balance of all your savings and checking accounts?`}
                      className={css.middleName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `immigrantCurrentBalance: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="immigrantCurrentBalance"
                    />

                    <InputField
                      label={`${initialNames.immigrantName}, What is your current net value of owned real estate?`}
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `immigrantCurrentNetValue: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="immigrantCurrentNetValue"
                    />

                    <InputField
                      label={`${initialNames.immigrantName}, What is the current value of all stocks, bonds or other money instruments you own?`}
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `immigrantCurrentOtherValue: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="immigrantCurrentOtherValue"
                    />
                  </div>
                </div>

                <h3 className={cn(css.subTitle, css.liabilitiesTitle)}>
                  {`${initialNames.immigrantName}'s household Assets and Liabilities`}
                </h3>

                <div className={css.containerDown}>
                  <InputField
                    label="you indicated that your total household size is:"
                    className={css.lastName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: financialsQuiz.data[quizStep - 1]?.id,
                        answer: `immigrantTotalHouseholdSize: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="immigrantTotalHouseholdSize"
                  />
                  <div>
                    <span>Indicate your annual household income</span>

                    <SelectField
                      list={[
                        '$0-27000',
                        '$27001-52000',
                        '$52001-85000',
                        '$85001-14100',
                        'Over $141000',
                      ]}
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `yourAnnualIncome: ${e.answer}`,
                        })
                      }
                      question={financialsQuiz.data[quizStep - 1]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          financialsQuiz.data,
                        ),
                        'yourAnnualIncome',
                      )}
                    />
                  </div>

                  <div>
                    <span>
                      Identify the total value of your household assets
                    </span>

                    <SelectField
                      list={[
                        '$0-18400',
                        '$18401-136000',
                        '$136001-321400',
                        '$321401-707100',
                        'Over $707100',
                      ]}
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `totalValueOfAssets: ${e.answer}`,
                        })
                      }
                      question={financialsQuiz.data[quizStep - 1]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          financialsQuiz.data,
                        ),
                        'totalValueOfAssets',
                      )}
                    />
                  </div>

                  <div>
                    <span>
                      Identify the total value of your household liabilities
                      (including both secured and unsecured liabilities)
                    </span>

                    <SelectField
                      list={[
                        '$0',
                        '$1-10100',
                        '$10101-57700',
                        '$57701-186800',
                        'Over $186800',
                      ]}
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `totalValueLiabilities: ${e.answer}`,
                        })
                      }
                      question={financialsQuiz.data[quizStep - 1]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          financialsQuiz.data,
                        ),
                        'totalValueLiabilities',
                      )}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {quizStep === 6 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              financialsQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.containerDown}>
            <BooleanMultiplyQuestion
              className={cn(css.buttonWrapper)}
              title="Has the Social Security Administration (SSA) ever officially issued a Social Security card to you?"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={financialsQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="socialSecurityAdministration: No"
              answerPositive="socialSecurityAdministration: Yes"
            />

            {hasSocialSecurityAdministration && (
              <Formik
                enableReinitialize
                initialValues={{
                  provideSecurityNumber: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      financialsQuiz.data,
                    ),
                    'provideSecurityNumber',
                  ),
                }}
                validate={() => {}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={() => {}}
              >
                {({ handleBlur, submitForm }) => (
                  <Form>
                    <InputField
                      label="Provide your U.S. Social Security Number (SSN)"
                      className={css.middleName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: financialsQuiz.data[quizStep - 1]?.id,
                          answer: `provideSecurityNumber: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="provideSecurityNumber"
                    />
                  </Form>
                )}
              </Formik>
            )}

            <BooleanMultiplyQuestion
              className={cn(css.buttonWrapper)}
              title="Do you want the SSA to issue you a Social Security card?"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={financialsQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="socialSecurityCard: No"
              answerPositive="socialSecurityCard: Yes"
            />
          </div>
        </div>
      )}

      {quizStep === 7 && (
        <Summary
          list={tabDTO[6].tabs}
          incompleteQuizItems={financialsQuiz.financialsIncompleteQuizItems}
        />
      )}
    </>
  );
};

export { Financials };
