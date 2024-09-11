/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { useLocalStorage } from '@uidotdev/usehooks';
import { FC, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import cn from 'classnames';
import {
  disclaimerQuizSelector,
  quizNavigationSelector,
  resetQuizStep,
  setDisclaimerIncompleteQuizItems,
  setDisclaimerQuiz,
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
import {
  getCountry,
  getQuiz,
  getUserAnswers,
  IQuestions,
  updateUserInfo,
} from '@/shared/firebase/services';
import {
  BooleanMultiplyQuestion,
  DatePickerSelect,
  InfoCard,
  InputField,
  Textarea,
} from '@/shared/ui';

import notepad from '/public/assets/icons/Notepad.svg';

import css from './Disclaimer.module.scss';
import { SelectField } from '@/shared/ui/SelectField';
import { tabDTO } from '@/entities/sidebar';
import { Summary } from '@/widgets/summary';

type TDisclaimerProps = object;

const Disclaimer: FC<TDisclaimerProps> = () => {
  const dispatch = useAppDispatch();
  const [countries, setCountries] = useState([]);
  const [currentUserChoiseId, setCurrentUserChoiseId] = useState('');

  const { quizStep } = useAppSelector(quizNavigationSelector);
  const { disclaimerQuiz } = useAppSelector(disclaimerQuizSelector);
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
  const countOfAssociatedOrganization
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '71')?.answer,
    'hasBeenAssociatedWithOrganization',
  );

  // prettier-ignore
  const hasBeenDeniedAdmissionToUS
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '73')?.answer,
    'hasBeenDeniedAdmissionToUS',
  ) === 'Yes';

  // prettier-ignore
  const hasBeenDeniedVisaToUS
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '73')?.answer,
    'hasBeenDeniedVisaToUS',
  ) === 'Yes';

  // prettier-ignore
  const hasWorkedInUSWithoutAuthorization
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '73')?.answer,
    'hasWorkedInUSWithoutAuthorization',
  ) === 'Yes';

  // prettier-ignore
  const hasViolatedNonimmigrantStatusTerms
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '73')?.answer,
    'hasViolatedNonimmigrantStatusTerms',
  ) === 'Yes';

  // prettier-ignore
  const hasFailedToAttendOrRemainInRemovalProceedingSinceApril1997
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '74')?.answer,
    'hasFailedToAttendOrRemainInRemovalProceedingSinceApril1997',
  ) === 'Yes';

  // prettier-ignore
  const hasEnteredUSWithoutInspection
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '74')?.answer,
    'hasEnteredUSWithoutInspection',
  ) === 'Yes';

  // prettier-ignore
  const hasBeenUnlawfullyPresentInUSForMoreThan180Days
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '74')?.answer,
    'hasBeenUnlawfullyPresentInUSForMoreThan180Days',
  ) === 'Yes';

  // prettier-ignore
  const hasBeenUnlawfullyPresentInUSForOneYearOrMore
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '74')?.answer,
    'hasBeenUnlawfullyPresentInUSForOneYearOrMore',
  ) === 'Yes';

  // prettier-ignore
  const hasReenteredWithoutInspectionAfterUnlawfulPresence
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '74')?.answer,
    'hasReenteredWithoutInspectionAfterUnlawfulPresence',
  ) === 'Yes';

  // prettier-ignore
  const hasBeenArrestedOrChargedByLawEnforcement
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '75')?.answer,
    'hasBeenArrestedOrChargedByLawEnforcement',
  ) === 'Yes';

  // prettier-ignore
  const hasLeftToAvoidUSArmedForcesService
  = getValueForInput(
    userAnswersArray.find(el => el.questionId === '77')?.answer,
    'hasLeftToAvoidUSArmedForcesService',
  ) === 'Yes';

  // prettier-ignore
  const isRequestingAccommodationForDisabilities
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '79')?.answer,
      'isRequestingAccommodationForDisabilities',
    ) === 'Yes';

  // prettier-ignore
  const isDeafOrHardOfHearing
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '79')?.answer,
      'isDeafOrHardOfHearing',
    ) === 'Yes';

  // prettier-ignore
  const isBlindOrHasLowVision
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '79')?.answer,
      'isBlindOrHasLowVision',
    ) === 'Yes';

  // prettier-ignore
  const hasOtherDisabilityOrImpairment
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '79')?.answer,
      'hasOtherDisabilityOrImpairment',
    ) === 'Yes';

  const handleCheckboxAnswer = async (userChoice: TUserChoice) => {
    setCurrentUserChoiseId(userChoice.id);

    await storeAnswer(
      userAnswers,
      userChoice,
      userData?.user ?? null,
      EQuestionsTypeId.DISCLAIMER,
      dispatch,
      setUserAnswers,
      'multipleAnswer',
      EQuestionsDataType.DATA,
    );

    const dataAnswers = await getUserAnswers(
      EQuestionsTypeId.DISCLAIMER,
      userData?.user.id ?? '',
    );

    // prettier-ignore
    const [isAnswerRequredIds, updateForAnswerCount]
        = getCorrectAnswerToCountMetrics(disclaimerQuiz.data, dataAnswers);

    if (isAnswerRequredIds.includes(userChoice.id)) {
      updateUserInfo(
        userData?.user.id ?? '',
        {
          testsCompletedInfo: {
            ...userData?.user.testsCompletedInfo,
            disclaimer: calculatePercentage(
              getAllAnswersCount(updateForAnswerCount, disclaimerQuiz.data),
              disclaimerQuiz.TOTAL_FIELDS,
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
          EQuestionsTypeId.DISCLAIMER,
        )) as IQuestions[];

        dispatch(setDisclaimerQuiz(quizData));
      } catch (error) {
        // console.log(error)
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const dataAnswers = await getUserAnswers(
          EQuestionsTypeId.DISCLAIMER,
          userData?.user.id ?? '',
        );

        const incompleteQuizAnswerIds: string[] = getIncompleteQuizAnswerIds(
          Object.values(dataAnswers),
          disclaimerQuiz.data,
        );

        dispatch(setUserAnswers(dataAnswers));

        dispatch(setDisclaimerIncompleteQuizItems(incompleteQuizAnswerIds));
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
        <InfoCard icon={notepad}>
          <h2>Inadmissibility and Association Declarations</h2>
          <p>
            Next up is the declarations section. Here, you&apos;ll provide
            details about past associations, activities, and any potential U.S.
            inadmissibility concerns. Topics include organizational
            associations, previous U.S. immigration interactions, legal
            altercations, and security-related conduct. Answer honestly; false
            declarations can lead to application denial. Ensure accuracy and
            consult with legal counsel if unsure.
          </p>
        </InfoCard>
      )}

      {quizStep === 1 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              disclaimerQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={css.disclaimerRow}
            title="Have you EVER been a member of, involved in, or in any way associated with any organization, association, fund, foundation, party, club, society, or similar group in the United States or in any other location in the world including any military service? Indicate How Many"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            hasAdditionalOption
            hasSecondAdditionalOption
            secondAnswerAddition="hasBeenAssociatedWithOrganization: 3"
            answerPositive="hasBeenAssociatedWithOrganization: No"
            answerNegative="hasBeenAssociatedWithOrganization: 1"
            answerAddition="hasBeenAssociatedWithOrganization: 2"
          />
        </div>
      )}

      {quizStep === 2 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              disclaimerQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          {Array.from(
            { length: +countOfAssociatedOrganization },
            (_, i) => i,
          ).map((el, i) => (
            <div
              className={css.organizationalAssociationWrapper}
              key={`${el + i}`}
            >
              <BooleanMultiplyQuestion
                className={cn(css.buttonWrapper, css.organizationalAssociation)}
                title={`Organization ${i + 1} - Are you currently a member?`}
                quizStep={quizStep - 1}
                answers={userAnswersArray}
                quizData={disclaimerQuiz.data}
                handleCheckboxAnswer={handleCheckboxAnswer}
                answerPositive={`isCurrentlyMember${i}: Yes`}
                answerNegative={`isCurrentlyMember${i}: No`}
              />

              <Formik
                enableReinitialize
                initialValues={{
                  [`organizationName${i}`]: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      disclaimerQuiz.data,
                    ),
                    `organizationName${i}`,
                  ),
                  [`city${i}`]: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      disclaimerQuiz.data,
                    ),
                    `city${i}`,
                  ),
                  [`stateOrProvince${i}`]: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      disclaimerQuiz.data,
                    ),
                    `stateOrProvince${i}`,
                  ),
                  [`groupNature${i}`]: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      disclaimerQuiz.data,
                    ),
                    `groupNature${i}`,
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
                      label={`Organization ${i + 1} - Name of Organization`}
                      className={css.firstName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: disclaimerQuiz.data[quizStep - 1]?.id,
                          answer: `organizationName${i}: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`organizationName${i}`}
                    />

                    <InputField
                      label={`Organization ${i + 1} - City or Town`}
                      className={css.middleName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: disclaimerQuiz.data[quizStep - 1]?.id,
                          answer: `city${i}: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`city${i}`}
                    />

                    <InputField
                      label={`Organization ${i + 1} - State or Province`}
                      className={css.middleName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: disclaimerQuiz.data[quizStep - 1]?.id,
                          answer: `stateOrProvince${i}: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`stateOrProvince${i}`}
                    />

                    <div>
                      <span>{`Organization ${i + 1} - Country`}</span>

                      <SelectField
                        list={countries}
                        showDefaultOption
                        defaultOption=""
                        onChange={e =>
                          handleCheckboxAnswer({
                            id: e.id,
                            answer: `orgCountry${i}: ${e.answer}`,
                          })
                        }
                        question={disclaimerQuiz.data[quizStep - 1]}
                        defaultValue={getValueForInput(
                          getCurentUserAnswer(
                            quizStep - 1,
                            userAnswersArray,
                            disclaimerQuiz.data,
                          ),
                          `orgCountry${i}`,
                        )}
                      />
                    </div>

                    <InputField
                      label={`Organization ${i + 1} - Nature of Group`}
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: disclaimerQuiz.data[quizStep - 1]?.id,
                          answer: `groupNature${i}: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`groupNature${i}`}
                    />

                    <DatePickerSelect
                      title={`Organization ${i + 1} - Dates of Membership - From`}
                      initialDate={getInitialDateValue(
                        userAnswersArray,
                        '72',
                        `datesMembershipFrom${i}`,
                      )}
                      onClick={date => {
                        handleCheckboxAnswer({
                          id: disclaimerQuiz.data[quizStep - 1]?.id,
                          answer: `datesMembershipFrom${i}: ${date}`,
                        });
                      }}
                    />

                    <DatePickerSelect
                      title={`Organization ${i + 1} - Dates of Membership - To`}
                      initialDate={getInitialDateValue(
                        userAnswersArray,
                        '72',
                        `datesMembershipTo${i}`,
                      )}
                      onClick={date => {
                        handleCheckboxAnswer({
                          id: disclaimerQuiz.data[quizStep - 1]?.id,
                          answer: `datesMembershipTo${i}: ${date}`,
                        });
                      }}
                    />
                  </Form>
                )}
              </Formik>
            </div>
          ))}
        </div>
      )}

      {quizStep === 3 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              disclaimerQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been denied admission to the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenDeniedAdmissionToUS: Yes"
            answerNegative="hasBeenDeniedAdmissionToUS: No"
          />

          {hasBeenDeniedAdmissionToUS && (
            <Textarea
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  disclaimerQuiz.data,
                ),
                'hasBeenDeniedAdmissionToUSExplanation',
              )}
              className={css.textAreaDescl}
              name="hasBeenDeniedAdmissionToUSExplanation"
              label="Have you EVER been denied admission to the United States-Explanation"
              placeholder="explain the circumstances and relevant details"
              onBlur={e => {
                handleCheckboxAnswer({
                  id: disclaimerQuiz.data[quizStep - 1]?.id,
                  answer: `hasBeenDeniedAdmissionToUSExplanation: ${e.target.value}`,
                });
              }}
            />
          )}

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been denied a visa to the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenDeniedVisaToUS: Yes"
            answerNegative="hasBeenDeniedVisaToUS: No"
          />

          {hasBeenDeniedVisaToUS && (
            <Textarea
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  disclaimerQuiz.data,
                ),
                'hasBeenDeniedVisaToUSExplanation',
              )}
              className={css.textAreaDescl}
              name="hasBeenDeniedVisaToUSExplanation"
              label="Have you EVER been denied a visa to the United States-Explanation"
              placeholder="explain the circumstances and relevant details"
              onBlur={e => {
                handleCheckboxAnswer({
                  id: disclaimerQuiz.data[quizStep - 1]?.id,
                  answer: `hasBeenDeniedVisaToUSExplanation: ${e.target.value}`,
                });
              }}
            />
          )}

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER worked in the United States without authorization?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasWorkedInUSWithoutAuthorization: Yes"
            answerNegative="hasWorkedInUSWithoutAuthorization: No"
          />

          {hasWorkedInUSWithoutAuthorization && (
            <Textarea
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  disclaimerQuiz.data,
                ),
                'hasWorkedInUSWithoutAuthorizationExplanation',
              )}
              className={css.textAreaDescl}
              name="hasWorkedInUSWithoutAuthorizationExplanation"
              label="Have you EVER worked in the United States without authorization-Explanation"
              placeholder="explain the circumstances and relevant details"
              onBlur={e => {
                handleCheckboxAnswer({
                  id: disclaimerQuiz.data[quizStep - 1]?.id,
                  answer: `hasWorkedInUSWithoutAuthorizationExplanation: ${e.target.value}`,
                });
              }}
            />
          )}

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER violated the terms or conditions of your nonimmigrant status?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasViolatedNonimmigrantStatusTerms: Yes"
            answerNegative="hasViolatedNonimmigrantStatusTerms: No"
          />

          {hasViolatedNonimmigrantStatusTerms && (
            <Textarea
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  disclaimerQuiz.data,
                ),
                'hasViolatedNonimmigrantStatusTermsExplanation',
              )}
              className={css.textAreaDescl}
              name="hasViolatedNonimmigrantStatusTermsExplanation"
              label="Have you EVER violated the terms or conditions of your nonimmigrant status-Explanation"
              placeholder="explain the circumstances and relevant details"
              onBlur={e => {
                handleCheckboxAnswer({
                  id: disclaimerQuiz.data[quizStep - 1]?.id,
                  answer: `hasViolatedNonimmigrantStatusTermsExplanation: ${e.target.value}`,
                });
              }}
            />
          )}

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Are you presently or have you EVER been in removal, exclusion, rescission, or deportation proceedings?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenInRemovalProceedings: Yes"
            answerNegative="hasBeenInRemovalProceedings: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been issued a final order of exclusion, deportation, or removal?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenIssuedFinalOrderOfRemoval: Yes"
            answerNegative="hasBeenIssuedFinalOrderOfRemoval: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER had a prior final order of exclusion, deportation, or removal reinstated?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasHadFinalOrderReinstated: Yes"
            answerNegative="hasHadFinalOrderReinstated: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER held lawful permanent resident status which was later rescinded?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasHadPermanentResidentStatusRescinded: Yes"
            answerNegative="hasHadPermanentResidentStatusRescinded: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been granted voluntary departure by an immigration officer or an immigration judge but failed to depart within the allotted time?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasFailedToDepartAfterVoluntaryDeparture: Yes"
            answerNegative="hasFailedToDepartAfterVoluntaryDeparture: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER applied for any kind of relief or protection from removal, exclusion, or deportation?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasAppliedForReliefFromRemoval: Yes"
            answerNegative="hasAppliedForReliefFromRemoval: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been a J nonimmigrant exchange visitor who was subject to the two-year foreign residence requirement?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenSubjectToTwoYearForeignResidenceRequirement: Yes"
            answerNegative="hasBeenSubjectToTwoYearForeignResidenceRequirement: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you complied with the foreign residence requirement?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasCompliedWithForeignResidenceRequirement: Yes"
            answerNegative="hasCompliedWithForeignResidenceRequirement: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you been granted a waiver or has Department of State issued a favorable waiver recommendation letter for you?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenGrantedWaiverOrFavorableRecommendation: Yes"
            answerNegative="hasBeenGrantedWaiverOrFavorableRecommendation: No"
          />
        </div>
      )}

      {quizStep === 4 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              disclaimerQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER failed or refused to attend or to remain in attendance at any removal proceeding filed against you on or after April 1, 1997?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasFailedToAttendOrRemainInRemovalProceedingSinceApril1997: Yes"
            answerNegative="hasFailedToAttendOrRemainInRemovalProceedingSinceApril1997: No"
          />

          {hasFailedToAttendOrRemainInRemovalProceedingSinceApril1997 && (
            <BooleanMultiplyQuestion
              className={css.disclaimerRowDeclar}
              title="If your answer to above question is 'Yes' do you believe you had reasonable cause?"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              wrapInDiv
              divStyles={css.disclaimerRowDiv}
              quizData={disclaimerQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerPositive="hadReasonableCauseForFailureToAttendRemovalProceeding: Yes"
              answerNegative="hadReasonableCauseForFailureToAttendRemovalProceeding: No"
            />
          )}

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER submitted fraudulent or counterfeit documentation to any U.S. Government official to obtain or attempt to obtain any immigration benefit, including a visa or entry into the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasSubmittedFraudulentDocumentationForImmigrationBenefit: Yes"
            answerNegative="hasSubmittedFraudulentDocumentationForImmigrationBenefit: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER lied about, concealed, or misrepresented any information on an application or petition to obtain a visa, other documentation required for entry into the United States, admission to the United States, or any other kind of immigration benefit?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasLiedOrConcealedInformationForImmigrationBenefit: Yes"
            answerNegative="hasLiedOrConcealedInformationForImmigrationBenefit: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER falsely claimed to be a U.S. citizen (in writing or any other way)?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasViolatedNonimmigrantStatusTerms: Yes"
            answerNegative="hasViolatedNonimmigrantStatusTerms: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been a stowaway on a vessel or aircraft arriving in the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenStowawayInUS: Yes"
            answerNegative="hasBeenStowawayInUS: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER knowingly encouraged, induced, assisted, abetted, or aided any foreign national to enter or to try to enter the United States illegally (alien smuggling)"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasEngagedInAlienSmuggling: Yes"
            answerNegative="hasEngagedInAlienSmuggling: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Are you under a final order of civil penalty for violating INA section 274C for use of fraudulent documents?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="isUnderFinalOrderForINAViolation: Yes"
            answerNegative="isUnderFinalOrderForINAViolation: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been excluded, deported, or removed from the United States or have you ever departed the United States on your own after having been ordered excluded, deported, or removed from the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenExcludedOrDeportedFromUS: Yes"
            answerNegative="hasBeenExcludedOrDeportedFromUS: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER entered the United States without being inspected and admitted or paroled?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasEnteredUSWithoutInspection: Yes"
            answerNegative="hasEnteredUSWithoutInspection: No"
          />

          {hasEnteredUSWithoutInspection && (
            <Textarea
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  disclaimerQuiz.data,
                ),
                'hasEnteredUSWithoutInspectionExplanation',
              )}
              className={css.textAreaDescl}
              name="hasEnteredUSWithoutInspectionExplanation"
              label="Have you EVER entered the United States without being inspected and admitted or paroled-Explanation"
              placeholder="explain the circumstances and relevant details"
              onBlur={e => {
                handleCheckboxAnswer({
                  id: disclaimerQuiz.data[quizStep - 1]?.id,
                  answer: `hasEnteredUSWithoutInspectionExplanation: ${e.target.value}`,
                });
              }}
            />
          )}

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Since April 1, 1997, have you been unlawfully present in the United States for more than 180 days but less than a year, and then departed the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenUnlawfullyPresentInUSForMoreThan180Days: Yes"
            answerNegative="hasBeenUnlawfullyPresentInUSForMoreThan180Days: No"
          />

          {hasBeenUnlawfullyPresentInUSForMoreThan180Days && (
            <Textarea
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  disclaimerQuiz.data,
                ),
                'hasBeenUnlawfullyPresentInUSForMoreThan180DaysExplanation',
              )}
              className={css.textAreaDescl}
              name="hasBeenUnlawfullyPresentInUSForMoreThan180DaysExplanation"
              label="Since April 1, 1997, have you been unlawfully present in the United States for more than 180 days but less than a year, and then departed the United States-Explanation"
              placeholder="explain the circumstances and relevant details"
              onBlur={e => {
                handleCheckboxAnswer({
                  id: disclaimerQuiz.data[quizStep - 1]?.id,
                  answer: `hasBeenUnlawfullyPresentInUSForMoreThan180DaysExplanation: ${e.target.value}`,
                });
              }}
            />
          )}

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Since April 1, 1997, have you been unlawfully present in the United States for one year or more and then departed the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenUnlawfullyPresentInUSForOneYearOrMore: Yes"
            answerNegative="hasBeenUnlawfullyPresentInUSForOneYearOrMore: No"
          />

          {hasBeenUnlawfullyPresentInUSForOneYearOrMore && (
            <Textarea
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  disclaimerQuiz.data,
                ),
                'hasBeenUnlawfullyPresentInUSForOneYearOrMoreExplanation',
              )}
              className={css.textAreaDescl}
              name="hasBeenUnlawfullyPresentInUSForOneYearOrMoreExplanation"
              label="Since April 1, 1997, have you been unlawfully present in the United States for more than 180 days but less than a year, and then departed the United States-Explanation"
              placeholder="explain the circumstances and relevant details"
              onBlur={e => {
                handleCheckboxAnswer({
                  id: disclaimerQuiz.data[quizStep - 1]?.id,
                  answer: `hasBeenUnlawfullyPresentInUSForOneYearOrMoreExplanation: ${e.target.value}`,
                });
              }}
            />
          )}

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Since April 1, 1997, have you EVER reentered or attempted to reenter the United States without being inspected and admitted or paroled after having been unlawfully present in the United States for more than one year in the aggregate?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasReenteredWithoutInspectionAfterUnlawfulPresence: Yes"
            answerNegative="hasReenteredWithoutInspectionAfterUnlawfulPresence: No"
          />

          {hasReenteredWithoutInspectionAfterUnlawfulPresence && (
            <Textarea
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  disclaimerQuiz.data,
                ),
                'unlawfulPresenceSince1997',
              )}
              className={css.textAreaDescl}
              name="unlawfulPresenceSince1997"
              label="Since April 1, 1997, have you been unlawfully present in the United States for one year or more and then departed the United States-Explanation"
              placeholder="explain the circumstances and relevant details"
              onBlur={e => {
                handleCheckboxAnswer({
                  id: disclaimerQuiz.data[quizStep - 1]?.id,
                  answer: `unlawfulPresenceSince1997: ${e.target.value}`,
                });
              }}
            />
          )}

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you been granted a waiver or has Department of State issued a favorable waiver recommendation letter for you?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenGrantedWaiverOrFavorableRecommendation: Yes"
            answerNegative="hasBeenGrantedWaiverOrFavorableRecommendation: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Since April 1, 1997, have you EVER reentered or attempted to reenter the United States without being inspected and admitted or paroled after having been deported, excluded, or removed from the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasReenteredWithoutInspectionAfterDeportation: Yes"
            answerNegative="hasReenteredWithoutInspectionAfterDeportation: No"
          />
        </div>
      )}

      {quizStep === 5 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              disclaimerQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been arrested, cited, charged, or detained for any reason by any law enforcement official (including but not limited to any U.S. immigration official or any official of the U.S. armed forces or U.S. Coast Guard)?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenArrestedOrChargedByLawEnforcement: Yes"
            answerNegative="hasBeenArrestedOrChargedByLawEnforcement: No"
          />

          {hasBeenArrestedOrChargedByLawEnforcement && (
            <Textarea
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  disclaimerQuiz.data,
                ),
                'hasBeenArrestedOrChargedExplanation',
              )}
              className={css.textAreaDescl}
              name="hasBeenArrestedOrChargedExplanation"
              label="Have you EVER been arrested, cited, charged, or detained for any reason by any law enforcement official (including but not limited to any U.S. immigration official or any official of the U.S. armed forces or U.S. Coast Guard)-Explanation"
              placeholder="explain the circumstances and relevant details"
              onBlur={e => {
                handleCheckboxAnswer({
                  id: disclaimerQuiz.data[quizStep - 1]?.id,
                  answer: `hasBeenArrestedOrChargedExplanation: ${e.target.value}`,
                });
              }}
            />
          )}

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER committed a crime of any kind (even if you were not arrested, cited, charged with, or tried for that crime)?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasCommittedAnyCrime: Yes"
            answerNegative="hasCommittedAnyCrime: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER pled guilty to or been convicted of a crime or offense (even if the violation was subsequently expunged or sealed by a court, or if you were granted a pardon, amnesty, a rehabilitation decree, or other act of clemency)?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasPledGuiltyOrBeenConvictedOfCrime: Yes"
            answerNegative="hasPledGuiltyOrBeenConvictedOfCrime: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been ordered punished by a judge or had conditions imposed on you that restrained your liberty (such as a prison sentence, suspended sentence, house arrest, parole, alternative sentencing, drug or alcohol treatment, rehabilitative programs or classes, probation, or community service)?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenOrderedPunishedOrHadLibertyRestraints: Yes"
            answerNegative="hasBeenOrderedPunishedOrHadLibertyRestraints: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been a defendant or the accused in a criminal proceeding (including pre-trial diversion, deferred prosecution, deferred adjudication, or any withheld adjudication)?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenDefendantInCriminalProceeding: Yes"
            answerNegative="hasBeenDefendantInCriminalProceeding: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER violated (or attempted or conspired to violate) any controlled substance law or regulation of a state, the United States, or a foreign country?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasViolatedControlledSubstanceLaw: Yes"
            answerNegative="hasViolatedControlledSubstanceLaw: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been convicted of two or more offenses (other than purely political offenses) for which the combined sentences to confinement were five years or more?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenConvictedOfTwoOrMoreOffensesWithFiveYearsOrMore: Yes"
            answerNegative="hasBeenConvictedOfTwoOrMoreOffensesWithFiveYearsOrMore: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER illicitly (illegally) trafficked or benefited from the trafficking of any controlled substances, such as chemicals, illegal drugs, or narcotics?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasIllicitlyTraffickedControlledSubstances: Yes"
            answerNegative="hasIllicitlyTraffickedControlledSubstances: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER knowingly aided, abetted, assisted, conspired, or colluded in the illicit trafficking of any illegal narcotic or other controlled substances?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasAidedInIllicitTraffickingOfNarcotics: Yes"
            answerNegative="hasAidedInIllicitTraffickingOfNarcotics: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Are you the spouse, son, or daughter of a foreign national who illicitly trafficked or aided (or otherwise abetted, assisted, conspired, or colluded) in the illicit trafficking of a controlled substance, such as chemicals, illegal drugs, or narcotics and you obtained, within the last five years, any financial or other benefit from the illegal activity of your spouse or parent, although you knew or reasonably should have known that the financial or other benefit resulted from the illicit activity of your spouse or parent?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBenefitedFromIllicitTraffickingByFamilyMember: Yes"
            answerNegative="hasBenefitedFromIllicitTraffickingByFamilyMember: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER engaged in prostitution or are you coming to the United States to engage in prostitution?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasEngagedInOrIntendsToEngageInProstitution: Yes"
            answerNegative="hasEngagedInOrIntendsToEngageInProstitution: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER directly or indirectly procured (or attempted to procure) or imported prostitutes or persons for the purpose of prostitution?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasProcuredOrImportedPersonsForProstitution: Yes"
            answerNegative="hasProcuredOrImportedPersonsForProstitution: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER received any proceeds or money from prostitution?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasReceivedProceedsFromProstitution: Yes"
            answerNegative="hasReceivedProceedsFromProstitution: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Do you intend to engage in illegal gambling or any other form of commercialized vice, such as prostitution, bootlegging, or the sale of child pornography, while in the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="intendsToEngageInIllegalActivitiesInUS: Yes"
            answerNegative="intendsToEngageInIllegalActivitiesInUS: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER exercised immunity (diplomatic or otherwise) to avoid being prosecuted for a criminal offense in the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasExercisedImmunityToAvoidProsecutionInUS: Yes"
            answerNegative="hasExercisedImmunityToAvoidProsecutionInUS: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER, while serving as a foreign government official, been responsible for or directly carried out violations of religious freedoms?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasViolatedReligiousFreedomsAsForeignOfficial: Yes"
            answerNegative="hasViolatedReligiousFreedomsAsForeignOfficial: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER induced by force, fraud, or coercion (or otherwise been involved in) the trafficking of persons for commercial sex acts?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenInvolvedInTraffickingForCommercialSexActs: Yes"
            answerNegative="hasBeenInvolvedInTraffickingForCommercialSexActs: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER trafficked a person into involuntary servitude, peonage, debt bondage, or slavery? Trafficking includes recruiting, harboring, transporting, providing, or obtaining a person for labor or services through the use of force, fraud, or coercion"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasTraffickedPersonIntoInvoluntaryServitude: Yes"
            answerNegative="hasTraffickedPersonIntoInvoluntaryServitude: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER knowingly aided, abetted, assisted, conspired, or colluded with others in trafficking persons for commercial sex acts or involuntary servitude, peonage, debt bondage, or slavery?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasAidedInTraffickingForCommercialSexOrInvoluntaryServitude: Yes"
            answerNegative="hasAidedInTraffickingForCommercialSexOrInvoluntaryServitude: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Are you the spouse, son or daughter of a foreign national who engaged in the trafficking of persons and have received or obtained, within the last five years, any financial or other benefits from the illicit activity of your spouse or your parent, although you knew or reasonably should have known that this benefit resulted from the illicit activity of your spouse or parent?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasReceivedBenefitsFromTraffickingByFamilyMember: Yes"
            answerNegative="hasReceivedBenefitsFromTraffickingByFamilyMember: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER engaged in money laundering or have you EVER knowingly aided, assisted, conspired, or colluded with others in money laundering or do you seek to enter the United States to engage in such activity?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasEngagedInOrAidedMoneyLaundering: Yes"
            answerNegative="hasEngagedInOrAidedMoneyLaundering: No"
          />
        </div>
      )}

      {quizStep === 6 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              disclaimerQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="46A- Engage in any activity that violates or evades any law relating to espionage (including spying) or sabotage in the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasEngagedInEspionageOrSabotage: Yes"
            answerNegative="hasEngagedInEspionageOrSabotage: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="46B- Engage in any activity in the United States that violates or evades any law prohibiting the export from the United States of goods, technology, or sensitive information?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasEngagedInExportControlViolations: Yes"
            answerNegative="hasEngagedInExportControlViolations: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="46C- Engage in any activity whose purpose includes opposing, controlling, or overthrowing the U.S. Government by force, violence, or other unlawful means while in the United States? "
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasEngagedInActivityOpposingUSGovernment: Yes"
            answerNegative="hasEngagedInActivityOpposingUSGovernment: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="46D - Engage in any activity that could endanger the welfare, safety, or security of the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasEngagedInActivityEndangeringUSWelfareSafetySecurity: Yes"
            answerNegative="hasEngagedInActivityEndangeringUSWelfareSafetySecurity: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="46E- Engage in any other unlawful activity?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasEngagedInOtherUnlawfulActivity: Yes"
            answerNegative="hasEngagedInOtherUnlawfulActivity: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="47- Are you engaged in or, upon your entry into the United States, do you intend to engage in any activity that could have potentially serious adverse foreign policy consequences for the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="intendsToEngageInActivityWithAdverseForeignPolicyConsequences: Yes"
            answerNegative="intendsToEngageInActivityWithAdverseForeignPolicyConsequences: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="48A- Committed, threatened to commit, attempted to commit, conspired to commit, incited, endorsed, advocated, planned, or prepared any of the following: hijacking, sabotage, kidnapping, political assassination, or use of a weapon or explosive to harm another individual or cause substantial damage to property?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasCommittedOrAttemptedSeriousCrimes: Yes"
            answerNegative="hasCommittedOrAttemptedSeriousCrimes: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Participated in, or been a member of, a group or organization that did any of the activities described in Item Number 48.a.?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasParticipatedInGroupEngagedInSeriousCrimes: Yes"
            answerNegative="hasParticipatedInGroupEngagedInSeriousCrimes: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Recruited members or asked for money or things of value for a group or organization that did any of the activities described in Item Number 48.a.?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasRecruitedForGroupEngagedInSeriousCrimes: Yes"
            answerNegative="hasRecruitedForGroupEngagedInSeriousCrimes: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Provided money, a thing of value, services or labor, or any other assistance or support for any of the activities described in Item Number 48.a.?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasProvidedSupportForSeriousCrimes: Yes"
            answerNegative="hasProvidedSupportForSeriousCrimes: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Provided money, a thing of value, services or labor, or any other assistance or support for an individual, group, or organization who did any of the activities described in Item Number 48.a.?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasProvidedSupportToIndividualsOrGroupsInvolvedInSeriousCrimes: Yes"
            answerNegative="hasProvidedSupportToIndividualsOrGroupsInvolvedInSeriousCrimes: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="49- Have you EVER received any type of military, paramilitary, or weapons training?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasReceivedMilitaryParamilitaryOrWeaponsTraining: Yes"
            answerNegative="hasReceivedMilitaryParamilitaryOrWeaponsTraining: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Do you intend to engage in any of the activities listed in any part of Item Numbers 48.a. - 49."
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="intendsToEngageInActivitiesListedInItems48aTo49: Yes"
            answerNegative="intendsToEngageInActivitiesListedInItems48aTo49: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER assisted or participated in selling, providing, or transporting weapons to any person who, to your knowledge, used them against another person?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasAssistedInWeaponSaleOrTransportUsedAgainstOthers: Yes"
            answerNegative="hasAssistedInWeaponSaleOrTransportUsedAgainstOthers: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER worked, volunteered, or otherwise served in any prison, jail, prison camp, detention facility, labor camp, or any other situation that involved detaining persons?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasWorkedInDetentionFacility: Yes"
            answerNegative="hasWorkedInDetentionFacility: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been a member of, assisted, or participated in any group, unit, or organization of any kind in which you or other persons used any type of weapon against any person or threatened to do so?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenMemberOfGroupUsingWeapons: Yes"
            answerNegative="hasBeenMemberOfGroupUsingWeapons: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER served in, been a member of, assisted, or participated in any military unit, paramilitary unit, police unit, self-defense unit, vigilante unit, rebel group, guerilla group, militia, insurgent organization, or any other armed group?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasServedInArmedGroup: Yes"
            answerNegative="hasServedInArmedGroup: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER been a member of, or in any way affiliated with, the Communist Party or any other totalitarian party (in the United States or abroad)?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenAffiliatedWithCommunistOrTotalitarianParty: Yes"
            answerNegative="hasBeenAffiliatedWithCommunistOrTotalitarianParty: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="During the period from March 23, 1933 to May 8, 1945, did you ever order, incite, assist, or otherwise participate in the persecution of any person because of race, religion, national origin, or political opinion, in association with either the Nazi government of Germany or any organization or government associated or allied with the Nazi government of Germany?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasParticipatedInPersecutionDuringNaziEra: Yes"
            answerNegative="hasParticipatedInPersecutionDuringNaziEra: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you ever participated in acts involving torture or genocide?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasParticipatedInTortureOrGenocide: Yes"
            answerNegative="hasParticipatedInTortureOrGenocide: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you ever been involved with or participated in killing any person?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenInvolvedInKillingAnyPerson: Yes"
            answerNegative="hasBeenInvolvedInKillingAnyPerson: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you ever been involved with or participated in intentionally and severely injuring any person?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenInvolvedInSevereInjuryToAnyPerson: Yes"
            answerNegative="hasBeenInvolvedInSevereInjuryToAnyPerson: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Engaging in any kind of sexual contact or relations with any person who did not consent or was unable to consent, or was being forced or threatened?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasEngagedInNonConsensualSexualContact: Yes"
            answerNegative="hasEngagedInNonConsensualSexualContact: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Limiting or denying any person's ability to exercise religious beliefs?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasLimitedOrDeniedReligiousBeliefs: Yes"
            answerNegative="hasLimitedOrDeniedReligiousBeliefs: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER recruited, enlisted, conscripted, or used any person under 15 years of age to serve in or help an armed force or group?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasRecruitedOrUsedMinorsInArmedForces: Yes"
            answerNegative="hasRecruitedOrUsedMinorsInArmedForces: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER used any person under 15 years of age to take part in hostilities, or to help or provide services to people in combat?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasUsedMinorsInHostilities: Yes"
            answerNegative="hasUsedMinorsInHostilities: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Are you subject to the public charge ground of inadmissibility under INA section 212(a)(4)?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="isSubjectToPublicChargeInadmissibility: Yes"
            answerNegative="isSubjectToPublicChargeInadmissibility: No"
          />

          <h3 className={css.title}>
            For the following questions, please answer in the context of
            &quot;Are you the spouse or chld of an individual who ever:&quot;
          </h3>

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="51A- Committed, threatened to commit, attempted to commit, conspired to commit, incited, endorsed, advocated, planned, or prepared any of the following: hijacking, sabotage, kidnapping, political assassination, or use of a weapon or explosive to harm another individual or cause substantial damage to property?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="terrorismRelatedActivities51A: Yes"
            answerNegative="terrorismRelatedActivities51A: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Participated in, or been a member or a representative of a group or organization that did any of the activities described in Item Number 51.a.?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="groupParticipation51B: Yes"
            answerNegative="groupParticipation51B: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Recruited members, or asked for money or things of value, for a group or organization that did any of the activities described in Item Number 51.a.?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="recruitmentForGroup51C: Yes"
            answerNegative="recruitmentForGroup51C: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Provided money, a thing of value, services or labor, or any other assistance or support for any of the activities described in Item Number 51.a.?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="supportForActivities51D: Yes"
            answerNegative="supportForActivities51D: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Provided money, a thing of value, services or labor, or any other assistance or support to an individual, group, or organization who did any of the activities described in Item Number 51.a.?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="assistanceToIndividuals51E: Yes"
            answerNegative="assistanceToIndividuals51E: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Received any type of military, paramilitary, or weapons training from a group or organization that did any of the activities described in Item Number 51.a.?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="militaryTraining51F: Yes"
            answerNegative="militaryTraining51F: No"
          />
        </div>
      )}

      {quizStep === 7 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              disclaimerQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Do you plan to practice polygamy in the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="plansToPracticePolygamyInUS: Yes"
            answerNegative="plansToPracticePolygamyInUS: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Are you accompanying another foreign national who requires your protection or guardianship but who is inadmissible after being certified by a medical officer as being helpless from sickness, physical or mental disability, or infancy, as described in INA section 232(c)?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="accompanyingInadmissibleForeignNationalRequiringProtection: Yes"
            answerNegative="accompanyingInadmissibleForeignNationalRequiringProtection: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER assisted in detaining, retaining, or withholding custody of a U.S. citizen child outside the United States from a U.S. citizen who has been granted custody of the child?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasAssistedInDetainingUSCitizenChild: Yes"
            answerNegative="hasAssistedInDetainingUSCitizenChild: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER voted in violation of any Federal, state, or local constitutional provision, statute, ordinance, or regulation in the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasVotedInViolationOfUSLaws: Yes"
            answerNegative="hasVotedInViolationOfUSLaws: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER renounced U.S. citizenship to avoid being taxed by the United States?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasRenouncedUSCitizenshipToAvoidTaxes: Yes"
            answerNegative="hasRenouncedUSCitizenshipToAvoidTaxes: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Applied for exemption or discharge from training or service in the U.S. armed forces or in the U.S. National Security Training Corps on the ground that you are a foreign national?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasAppliedForExemptionFromUSArmedForcesAsForeignNational: Yes"
            answerNegative="hasAppliedForExemptionFromUSArmedForcesAsForeignNational: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Been relieved or discharged from such training or service on the ground that you are a foreign national?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenRelievedOrDischargedFromUSTrainingAsForeignNational: Yes"
            answerNegative="hasBeenRelievedOrDischargedFromUSTrainingAsForeignNational: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Been convicted of desertion from the U.S. armed forces?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasBeenConvictedOfDesertionFromUSArmedForces: Yes"
            answerNegative="hasBeenConvictedOfDesertionFromUSArmedForces: No"
          />

          <BooleanMultiplyQuestion
            className={css.disclaimerRowDeclar}
            title="Have you EVER left or remained outside the United States to avoid or evade training or service in the U.S. armed forces in time of war or a period declared by the President to be a national emergency?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            wrapInDiv
            divStyles={css.disclaimerRowDiv}
            quizData={disclaimerQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerPositive="hasLeftToAvoidUSArmedForcesService: Yes"
            answerNegative="hasLeftToAvoidUSArmedForcesService: No"
          />

          {hasLeftToAvoidUSArmedForcesService && (
            <Formik
              enableReinitialize
              initialValues={{
                nationalityOrImmigrationStatusBeforeLeaving: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    disclaimerQuiz.data,
                  ),
                  'nationalityOrImmigrationStatusBeforeLeaving',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={css.disclaimerRowDeclar}>
                  <InputField
                    label="Since your answer to the above is “Yes,” what was your nationality or immigration status immediately before you left (for example, U.S. citizen or national, lawful permanent resident, nonimmigrant, parolee, present without admission or parole, or any other status)?"
                    className={css.firstName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: disclaimerQuiz.data[quizStep - 1]?.id,
                        answer: `nationalityOrImmigrationStatusBeforeLeaving: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="nationalityOrImmigrationStatusBeforeLeaving"
                  />
                </Form>
              )}
            </Formik>
          )}
        </div>
      )}

      {quizStep === 8 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              disclaimerQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.containerDown}>
            <div>
              <span>
                What is the highest degree or level of school you have
                completed?
              </span>

              <SelectField
                list={[
                  'Grades 1 through 11',
                  '12th grade - no diploma',
                  "Associate's degree",
                  "Bachelor's degree",
                  "Master's degree",
                  '1 or more years of college credit- no degree',
                  'High school diploma or GED or alternative credential',
                  'Professional degree (JD/ MD/ DMD/ etc.)',
                  'Doctorate degree',
                ]}
                showDefaultOption
                defaultOption=""
                onChange={e =>
                  handleCheckboxAnswer({
                    id: e.id,
                    answer: `highestDegreeOrLevelCompleted: ${e.answer}`,
                  })
                }
                question={disclaimerQuiz.data[quizStep - 1]}
                defaultValue={getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    disclaimerQuiz.data,
                  ),
                  'highestDegreeOrLevelCompleted',
                )}
              />
            </div>

            <Textarea
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  disclaimerQuiz.data,
                ),
                'certificationsLicensesSkills',
              )}
              className={css.certificationsLicensesSkills}
              name="certificationsLicensesSkills"
              label="List your certifications, licenses, skills obtained through work experience, and educational certificates"
              placeholder="example:Licensed electrician, Master of engineering, licensed attorney, etc."
              onBlur={e => {
                handleCheckboxAnswer({
                  id: disclaimerQuiz.data[quizStep - 1]?.id,
                  answer: `certificationsLicensesSkills: ${e.target.value}`,
                });
              }}
            />
          </div>
        </div>
      )}

      {quizStep === 9 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              disclaimerQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.containerDown}>
            <BooleanMultiplyQuestion
              className={cn(css.buttonWrapper)}
              title="Are you requesting an accommodation because of your disabilities and/or impairments?"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={disclaimerQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="isRequestingAccommodationForDisabilities: No"
              answerPositive="isRequestingAccommodationForDisabilities: Yes"
            />

            {isRequestingAccommodationForDisabilities && (
              <>
                <BooleanMultiplyQuestion
                  className={cn(css.buttonWrapper)}
                  title="I am deaf or hard of hearing"
                  quizStep={quizStep - 1}
                  answers={userAnswersArray}
                  quizData={disclaimerQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  answerNegative="isDeafOrHardOfHearing: No"
                  answerPositive="isDeafOrHardOfHearing: Yes"
                />

                {isDeafOrHardOfHearing && (
                  <Formik
                    enableReinitialize
                    initialValues={{
                      requestedAccommodation: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          disclaimerQuiz.data,
                        ),
                        'requestedAccommodation',
                      ),
                    }}
                    validate={() => {}}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={() => {}}
                  >
                    {({ handleBlur, submitForm }) => (
                      <Form className={css.disclaimerRowDeclar}>
                        <InputField
                          label="I request the following accommodation. (If you are requesting a sign-language interpreter, indicate for which language (for example, American Sign Language).):"
                          className={css.firstName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: disclaimerQuiz.data[quizStep - 1]?.id,
                              answer: `requestedAccommodation: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="requestedAccommodation"
                        />
                      </Form>
                    )}
                  </Formik>
                )}

                <BooleanMultiplyQuestion
                  className={cn(css.buttonWrapper)}
                  title="I am blind or have low vision"
                  quizStep={quizStep - 1}
                  answers={userAnswersArray}
                  quizData={disclaimerQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  answerNegative="isBlindOrHasLowVision: No"
                  answerPositive="isBlindOrHasLowVision: Yes"
                />

                {isBlindOrHasLowVision && (
                  <Formik
                    enableReinitialize
                    initialValues={{
                      requestedAccommodationForVision: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          disclaimerQuiz.data,
                        ),
                        'requestedAccommodationForVision',
                      ),
                    }}
                    validate={() => {}}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={() => {}}
                  >
                    {({ handleBlur, submitForm }) => (
                      <Form className={css.disclaimerRowDeclar}>
                        <InputField
                          label="I request the following accommodation"
                          className={css.firstName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: disclaimerQuiz.data[quizStep - 1]?.id,
                              answer: `requestedAccommodationForVision: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="requestedAccommodationForVision"
                        />
                      </Form>
                    )}
                  </Formik>
                )}

                <BooleanMultiplyQuestion
                  className={cn(css.buttonWrapper)}
                  title="I have another type of disability and/or impairment."
                  quizStep={quizStep - 1}
                  answers={userAnswersArray}
                  quizData={disclaimerQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  answerNegative="hasOtherDisabilityOrImpairment: No"
                  answerPositive="hasOtherDisabilityOrImpairment: Yes"
                />

                {hasOtherDisabilityOrImpairment && (
                  <Formik
                    enableReinitialize
                    initialValues={{
                      disabilityAccommodationRequest: getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          disclaimerQuiz.data,
                        ),
                        'disabilityAccommodationRequest',
                      ),
                    }}
                    validate={() => {}}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={() => {}}
                  >
                    {({ handleBlur, submitForm }) => (
                      <Form className={css.disclaimerRowDeclar}>
                        <InputField
                          label="Describe the nature of your disability and/or impairment and the accommodation you are requesting."
                          className={css.firstName}
                          onBlur={e => {
                            handleBlur(e);
                            handleCheckboxAnswer({
                              id: disclaimerQuiz.data[quizStep - 1]?.id,
                              answer: `disabilityAccommodationRequest: ${e.target.value}`,
                            });
                            submitForm();
                          }}
                          name="disabilityAccommodationRequest"
                        />
                      </Form>
                    )}
                  </Formik>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {quizStep === 10 && (
        <Summary
          list={tabDTO[7]?.tabs}
          incompleteQuizItems={disclaimerQuiz.disclaimerIncompleteQuizItems}
        />
      )}
    </>
  );
};

export { Disclaimer };
