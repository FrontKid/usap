/* eslint-disable react-hooks/exhaustive-deps */

import { useLocalStorage } from '@uidotdev/usehooks';
import { Fragment, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
  familyNMarriageQuizSelector,
  quizNavigationSelector,
  userAnswerSelector,
  setUserAnswers,
  setFamilyNMarriageQuiz,
  resetQuizStep,
  setFamilyNMarriageIncompleteQuizItem,
} from '@/entities/quiz';
import {
  BooleanMultiplyQuestion,
  BooleanQuestion,
  DatePickerSelect,
  InfoCard,
  InputField,
} from '@/shared/ui';

import team from '/assets/icons/Team.svg';

import css from './FamilyNMarriage.module.scss';

import {
  getCountry,
  getQuiz,
  getStates,
  getUserAnswers,
  IQuestions,
  updateUserInfo,
} from '@/shared/firebase/services';
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
  ECollectionNames,
  EQuestionsDataType,
  EQuestionsTypeId,
  ISponsorImmigrantPair,
} from '@/shared/types';
import { SelectField } from '@/shared/ui/SelectField';
import { getSlicedChildCount } from '../../lib/getSlicedChildCount';
import { Summary } from '@/widgets/summary';
import { tabDTO } from '@/entities/sidebar';

const validationZipCodeSchema = Yup.object({
  ZIPCode: Yup.string().matches(/^\d{5}$/, 'Must be exactly 5 digits'),
});

const FamilyNMarriage = () => {
  const dispatch = useAppDispatch();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [currentUserChoiseId, setCurrentUserChoiseId] = useState('');

  const { quizStep } = useAppSelector(quizNavigationSelector);
  const { userAnswers } = useAppSelector(userAnswerSelector);
  const { familyNMarriageQuiz } = useAppSelector(familyNMarriageQuizSelector);

  const userAnswersArray = Object.values(userAnswers);

  const [userData, setUserData] = useLocalStorage<TUser>('user');
  const [childCount] = useLocalStorage<string>('childCount');

  // prettier-ignore
  const hasCountryUSA
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '34')?.answer,
        'country',
      ) === 'United States of America';

  // prettier-ignore
  const hasMotherDifferentName
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '38')?.answer,
        'hasDifferentName',
      ) === 'Yes';

  // prettier-ignore
  const hasFatherDifferentName
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '40')?.answer,
      'hasDifferentName',
    ) === 'Yes';

  // prettier-ignore
  const hasSponsorFatherDifferentName
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '49')?.answer,
      'hasDifferentName',
    ) === 'Yes';

  // prettier-ignore
  const isMotherLive
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '39')?.answer,
        'isMotherLive',
      ) === 'Yes';

  // prettier-ignore
  const isSponsorMotherLive
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '48')?.answer,
        'isMotherLive',
      ) === 'Yes';

  // prettier-ignore
  const isFatherLive
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '41')?.answer,
        'isFatherLive',
      ) === 'Yes';

  // prettier-ignore
  const isSponsorFatherLive
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '50')?.answer,
        'isFatherLive',
      ) === 'Yes';

  // prettier-ignore
  const isImmigrantAddressUSA
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '42')?.answer,
        'country',
      ) === 'United States of America';

  // prettier-ignore
  const isSponsorAddressUSA
      = getValueForInput(
        userAnswersArray.find(el => el.questionId === '51')?.answer,
        'country',
      ) === 'United States of America';

  const [applicantNicknams] = useLocalStorage<ISponsorImmigrantPair>(
    'sponsorImmigrantPair',
  );

  const initialNames: ISponsorImmigrantPair = {
    immigrantName: applicantNicknams?.immigrantName ?? 'immigrant',
    sponsorName: applicantNicknams?.sponsorName ?? 'sponsor',
  };

  const handleUserAnswer = async (userChoice: TUserChoice) => {
    await storeAnswer(
      userAnswers,
      userChoice,
      userData?.user ?? null,
      EQuestionsTypeId.FAMILY_AND_MARRIAGE,
      dispatch,
      setUserAnswers,
    );

    const dataAnswers = await getUserAnswers(
      EQuestionsTypeId.FAMILY_AND_MARRIAGE,
      userData?.user.id ?? '',
    );

    // prettier-ignore
    const [isAnswerRequredIds, updateForAnswerCount]
      = getCorrectAnswerToCountMetrics(familyNMarriageQuiz.data, dataAnswers);

    if (isAnswerRequredIds.includes(userChoice.id)) {
      updateUserInfo(
        userData?.user.id ?? '',
        {
          testsCompletedInfo: {
            ...userData?.user.testsCompletedInfo,
            familyNMarriage: calculatePercentage(
              getAllAnswersCount(
                updateForAnswerCount,
                familyNMarriageQuiz.data,
              ),
              familyNMarriageQuiz.TOTAL_FIELDS,
            ),
          },
        },
        setUserData,
      );
    }
  };

  const handleCheckboxAnswer = async (userChoice: TUserChoice) => {
    const questionsWithDataType = ['43', '45'];

    setCurrentUserChoiseId(userChoice.id);

    await storeAnswer(
      userAnswers,
      userChoice,
      userData?.user ?? null,
      EQuestionsTypeId.FAMILY_AND_MARRIAGE,
      dispatch,
      setUserAnswers,
      'multipleAnswer',
      !questionsWithDataType.includes(userChoice.id)
        ? EQuestionsDataType.DATA
        : '',
    );

    const dataAnswers = await getUserAnswers(
      EQuestionsTypeId.FAMILY_AND_MARRIAGE,
      userData?.user.id ?? '',
    );

    // prettier-ignore
    const [isAnswerRequredIds, updateForAnswerCount]
        = getCorrectAnswerToCountMetrics(familyNMarriageQuiz.data, dataAnswers);

    if (isAnswerRequredIds.includes(userChoice.id)) {
      updateUserInfo(
        userData?.user.id ?? '',
        {
          testsCompletedInfo: {
            ...userData?.user.testsCompletedInfo,
            familyNMarriage: calculatePercentage(
              getAllAnswersCount(
                updateForAnswerCount,
                familyNMarriageQuiz.data,
              ),
              familyNMarriageQuiz.TOTAL_FIELDS,
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
          EQuestionsTypeId.FAMILY_AND_MARRIAGE,
        )) as IQuestions[];

        dispatch(setFamilyNMarriageQuiz(quizData));
      } catch (error) {
        // console.log(error)
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const dataAnswers = await getUserAnswers(
          EQuestionsTypeId.FAMILY_AND_MARRIAGE,
          userData?.user.id ?? '',
        );

        const incompleteQuizAnswerIds: string[] = getIncompleteQuizAnswerIds(
          Object.values(dataAnswers),
          familyNMarriageQuiz.data,
        );

        dispatch(setUserAnswers(dataAnswers));

        dispatch(setFamilyNMarriageIncompleteQuizItem(incompleteQuizAnswerIds));
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

  return (
    <>
      {quizStep === 0 && (
        <InfoCard icon={team}>
          <h2>Lets us get down to some personal and family details</h2>
          <p>
            Now we are getting into further details about you and your family.
            Please provide accurate details about yourself and your family to
            ensure the best service experience. Your information remains
            confidential and is essential for our processes.
          </p>
        </InfoCard>
      )}

      {quizStep === 1 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {familyNMarriageQuiz.data[quizStep - 1]?.question}
          </h2>

          <div className={css.marriageDetailsWrapper}>
            <DatePickerSelect
              onClick={date => {
                handleCheckboxAnswer({
                  id: familyNMarriageQuiz.data[quizStep - 1].id,
                  answer: `marriedDate: ${date}`,
                });
              }}
              title={`When did ${initialNames.immigrantName} and ${initialNames.sponsorName} get married?`}
              initialDate={getInitialDateValue(
                userAnswersArray,
                '34',
                'marriedDate',
              )}
            />

            <Formik
              enableReinitialize
              initialValues={{
                getMarriedCity: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'city',
                ),
                province: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'province',
                ),
                state: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'state',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={css.marriageDetailsForm}>
                  <InputField
                    label="City or Town"
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                        answer: `city: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="getMarriedCity"
                  />

                  <div className={css.nationalitySelect}>
                    <span>Country</span>
                    <SelectField
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `country: ${e.answer}`,
                        })
                      }
                      question={familyNMarriageQuiz.data[quizStep - 1]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          familyNMarriageQuiz.data,
                        ),
                        'country',
                      )}
                      list={countries}
                    />
                  </div>

                  {hasCountryUSA && (
                    <div>
                      <span>State</span>
                      <SelectField
                        showDefaultOption
                        defaultOption=""
                        onChange={e =>
                          handleCheckboxAnswer({
                            id: e.id,
                            answer: `state: ${e.answer}`,
                          })
                        }
                        question={familyNMarriageQuiz.data[quizStep - 1]}
                        defaultValue={getValueForInput(
                          getCurentUserAnswer(
                            quizStep - 1,
                            userAnswersArray,
                            familyNMarriageQuiz.data,
                          ),
                          'state',
                        )}
                        list={states}
                      />
                    </div>
                  )}

                  {!hasCountryUSA && (
                    <InputField
                      label="Province"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `province: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="province"
                    />
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {quizStep === 2 && (
        <div className="quizWrapper">
          {Array.from({ length: +childCount }, (_, k) => k + 1).map((_, i) => (
            <Fragment key={`${_ + i}`}>
              <h2 className={css.title}>
                {getSlicedChildCount(
                  familyNMarriageQuiz.data[quizStep - 1]?.question,
                  i,
                )}
              </h2>

              <div>
                <Formik
                  enableReinitialize
                  initialValues={{
                    [`childFirstName${i + 1}`]: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      `FirstName${i + 1}`,
                    ),
                    [`childMiddleName${i + 1}`]: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      `MiddleName${i + 1}`,
                    ),
                    [`childLastName${i + 1}`]: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      `LastName${i + 1}`,
                    ),
                    [`childANumber${i + 1}`]: getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      `ANumber${i + 1}`,
                    ),
                  }}
                  validate={() => {}}
                  validateOnBlur={false}
                  validateOnChange={false}
                  onSubmit={() => {}}
                >
                  {({ handleBlur, submitForm }) => (
                    <Form className={css.childDetailsWrapper}>
                      <InputField
                        label="Given Name (First Name)"
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                            answer: `FirstName${i + 1}: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name={`childFirstName${i + 1}`}
                      />

                      <InputField
                        label="Middle Name"
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                            answer: `MiddleName${i + 1}: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name={`childMiddleName${i + 1}`}
                      />

                      <InputField
                        label="Family Name (last Name)"
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                            answer: `LastName${i + 1}: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name={`childLastName${i + 1}`}
                      />

                      <InputField
                        label="A-Number (if any)"
                        placeholder="Leave blank if not applicable"
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                            answer: `ANumber${i + 1}: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name={`childANumber${i + 1}`}
                      />

                      <InputField
                        label="Relationship"
                        placeholder="Child"
                        disabled
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                            answer: `ChildName${i + 1}: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name={`ChildName${i + 1}`}
                      />

                      <DatePickerSelect
                        onClick={date => {
                          handleCheckboxAnswer({
                            id: familyNMarriageQuiz.data[quizStep - 1].id,
                            answer: `BirthDate${i + 1}: ${date}`,
                          });
                        }}
                        title="Date of Birth (mm/dd/yyyy)"
                        initialDate={getInitialDateValue(
                          userAnswersArray,
                          '35',
                          `BirthDate${i + 1}`,
                        )}
                      />

                      <div className={css.nationalitySelect}>
                        <span>Birth Country</span>
                        <SelectField
                          showDefaultOption
                          defaultOption=""
                          onChange={e =>
                            handleCheckboxAnswer({
                              id: e.id,
                              answer: `BirthCountry${i + 1}: ${e.answer}`,
                            })
                          }
                          question={familyNMarriageQuiz.data[quizStep - 1]}
                          defaultValue={getValueForInput(
                            getCurentUserAnswer(
                              quizStep - 1,
                              userAnswersArray,
                              familyNMarriageQuiz.data,
                            ),
                            `BirthCountry${i + 1}`,
                          )}
                          list={countries}
                        />
                      </div>
                    </Form>
                  )}
                </Formik>

                <BooleanMultiplyQuestion
                  title="Is this child applying with you (Please see FAQ)"
                  quizStep={quizStep - 1}
                  className={css.childDetailsButtons}
                  answers={userAnswersArray}
                  chooseNegative
                  isDisabled
                  quizData={familyNMarriageQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  answerNegative={`isThisChildApplying${i + 1}: No`}
                  answerPositive={`isThisChildApplying${i + 1}: Yes`}
                />
              </div>
            </Fragment>
          ))}
        </div>
      )}

      {quizStep === 3 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.smallContainer}>
            <span>
              How many times have you been married previously (Not including
              current marriage)?
            </span>

            <SelectField
              disabled
              list={['1', '2', '3', '4', '5']}
              onChange={e =>
                handleCheckboxAnswer({
                  id: e.id,
                  answer: `marriagesNumber: ${e.answer}`,
                })
              }
              question={familyNMarriageQuiz.data[quizStep - 1]}
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'marriagesNumber',
              )}
            />
          </div>
        </div>
      )}
      {quizStep === 4 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            initialValues={{
              [`${initialNames.immigrantName}FirstName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'firstName',
              ),
              [`${initialNames.immigrantName}MiddleName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'middleName',
              ),
              [`${initialNames.immigrantName}LastName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'lastName',
              ),
              [`${initialNames.immigrantName}MarriagePlaceCity`]:
                getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'marriagePlaceCity',
                ),
              [`${initialNames.immigrantName}MarriagePlaceProvince`]:
                getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'marriagePlaceProvince',
                ),
              [`${initialNames.immigrantName}DivorceCity`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'divorceCity',
              ),
              [`${initialNames.immigrantName}DivorceProvince`]:
                getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'divorceProvince',
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
                  label="Given Name (First Name)"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `firstName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}FirstName`}
                />

                <InputField
                  label="Middle Name"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `middleName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}MiddleName`}
                />

                <InputField
                  label="Last Name"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `lastName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}LastName`}
                />

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `priorSpouseBD: ${date}`,
                    });
                  }}
                  title="Prior Spouse-Date of Birth (mm/dd/yyyy)"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '37',
                    'priorSpouseBD',
                  )}
                />

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `marriageDatePriorSpouse: ${date}`,
                    });
                  }}
                  title="Date of Marriage to Prior Spouse"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '37',
                    'marriageDatePriorSpouse',
                  )}
                />

                <InputField
                  label="Place of Marriage - City or Town"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `marriagePlaceCity: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}MarriagePlaceCity`}
                />

                <InputField
                  label="Place of Marriage - State or Province"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `marriagePlaceProvince: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}MarriagePlaceProvince`}
                />

                <div>
                  <span>Place of Marriage - Country</span>

                  <SelectField
                    showDefaultOption
                    defaultOption=""
                    list={countries}
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `marriageCountry: ${e.answer}`,
                      })
                    }
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'marriageCountry',
                    )}
                  />
                </div>

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `divorceDatePriorSpouse: ${date}`,
                    });
                  }}
                  title="Date of Divorce to Prior Spouse (mm/dd/yyyy)"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '37',
                    'divorceDatePriorSpouse',
                  )}
                />

                <InputField
                  label="Divorce - City or Town"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `divorceCity: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}DivorceCity`}
                />

                <InputField
                  label="Divorce - State or Province"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `divorceProvince: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}DivorceProvince`}
                />

                <div>
                  <span>Country of Divorce</span>

                  <SelectField
                    showDefaultOption
                    defaultOption=""
                    list={countries}
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `divorceCountry: ${e.answer}`,
                      })
                    }
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'divorceCountry',
                    )}
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
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            initialValues={{
              [`${initialNames.immigrantName}FirstName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'firstName',
              ),
              [`${initialNames.immigrantName}MiddleName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'middleName',
              ),
              [`${initialNames.immigrantName}LastName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'lastName',
              ),
              [`${initialNames.immigrantName}CityBirth`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'cityBirth',
              ),
              [`${initialNames.immigrantName}DiffFirstName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffFirstName',
              ),
              [`${initialNames.immigrantName}DiffMiddleName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffMiddleName',
              ),
              [`${initialNames.immigrantName}DiffLastName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffLastName',
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
                  label="Given Name (First Name)"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `firstName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}FirstName`}
                />

                <InputField
                  label="Middle Name"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `middleName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}MiddleName`}
                />

                <InputField
                  label="Family Name (Last Name)"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `lastName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}LastName`}
                />

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `birthDate: ${date}`,
                    });
                  }}
                  title="Date of Birth (mm/dd/yyyy)"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '38',
                    'birthDate',
                  )}
                />

                <InputField
                  label="City or Town of Birth"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `cityBirth: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}CityBirth`}
                />

                <div>
                  <span>Country of Birth</span>

                  <SelectField
                    showDefaultOption
                    defaultOption=""
                    list={countries}
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `birthCountry: ${e.answer}`,
                      })
                    }
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'birthCountry',
                    )}
                  />
                </div>

                <BooleanMultiplyQuestion
                  title={`Did ${initialNames.immigrantName}'s Mother Have A Different Name At Birth?`}
                  quizStep={quizStep - 1}
                  answers={userAnswersArray}
                  quizData={familyNMarriageQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  answerNegative="hasDifferentName: No"
                  answerPositive="hasDifferentName: Yes"
                />
              </Form>
            )}
          </Formik>

          {hasMotherDifferentName && (
            <div className={css.motherDifferentName}>
              <h3 className={css.title}>
                {`Name Of ${initialNames.immigrantName}'s Mother At Birth`}
              </h3>

              <Formik
                enableReinitialize
                initialValues={{
                  [`${initialNames.immigrantName}DiffFirstName`]:
                    getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'diffFirstName',
                    ),
                  [`${initialNames.immigrantName}DiffMiddleName`]:
                    getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'diffMiddleName',
                    ),
                  [`${initialNames.immigrantName}DiffLastName`]:
                    getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'diffLastName',
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
                      label="Given Name (First Name)"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `diffFirstName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`${initialNames.immigrantName}DiffFirstName`}
                    />

                    <InputField
                      label="Middle Name"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `diffMiddleName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`${initialNames.immigrantName}DiffMiddleName`}
                    />

                    <InputField
                      label="Family Name (Last Name)"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `diffLastName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`${initialNames.immigrantName}DiffLastName`}
                    />
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      )}
      {quizStep === 6 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={css.smallContainer}
            title="Is your mother still living?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            quizData={familyNMarriageQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative="isMotherLive: No"
            answerPositive="isMotherLive: Yes"
            hasAdditionalOption
            answerAddition="isMotherLive: I don't know"
          />

          {isMotherLive && (
            <Formik
              enableReinitialize
              initialValues={{
                [`${initialNames.immigrantName}CurrentCity`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'currentCity',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={css.containerCenter}>
                  <div>
                    <InputField
                      label="Current city or town of residence"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `currentCity: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`${initialNames.immigrantName}CurrentCity`}
                    />
                  </div>

                  <div>
                    <span>Current country of residence</span>

                    <SelectField
                      showDefaultOption
                      defaultOption=""
                      list={countries}
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `currentCountry: ${e.answer}`,
                        })
                      }
                      question={familyNMarriageQuiz.data[quizStep - 1]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          familyNMarriageQuiz.data,
                        ),
                        'currentCountry',
                      )}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      )}
      {quizStep === 7 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            initialValues={{
              [`${initialNames.immigrantName}FirstName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'firstName',
              ),
              [`${initialNames.immigrantName}MiddleName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'middleName',
              ),
              [`${initialNames.immigrantName}LastName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'lastName',
              ),
              [`${initialNames.immigrantName}CityBirth`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'cityBirth',
              ),
              [`${initialNames.immigrantName}DiffFirstName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffFirstName',
              ),
              [`${initialNames.immigrantName}DiffMiddleName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffMiddleName',
              ),
              [`${initialNames.immigrantName}DiffLastName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffLastName',
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
                  label="Given Name (First Name)"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `firstName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}FirstName`}
                />

                <InputField
                  label="Middle Name"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `middleName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}MiddleName`}
                />

                <InputField
                  label="Family Name (Last Name)"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `lastName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}LastName`}
                />

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `birthDate: ${date}`,
                    });
                  }}
                  title="Date of Birth (mm/dd/yyyy)"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '40',
                    'birthDate',
                  )}
                />

                <InputField
                  label="City or Town of Birth"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `cityBirth: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}CityBirth`}
                />

                <div>
                  <span>Country of Birth</span>

                  <SelectField
                    showDefaultOption
                    defaultOption=""
                    list={countries}
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `birthCountry: ${e.answer}`,
                      })
                    }
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'birthCountry',
                    )}
                  />
                </div>

                <BooleanMultiplyQuestion
                  title={`Did ${initialNames.immigrantName}'s Mother Have A Different Name At Birth?`}
                  quizStep={quizStep - 1}
                  answers={userAnswersArray}
                  quizData={familyNMarriageQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  answerNegative="hasDifferentName: No"
                  answerPositive="hasDifferentName: Yes"
                />
              </Form>
            )}
          </Formik>

          {hasFatherDifferentName && (
            <div className={css.motherDifferentName}>
              <h3 className={css.title}>
                {`Name Of ${initialNames.immigrantName}'s Father At Birth`}
              </h3>

              <Formik
                enableReinitialize
                initialValues={{
                  [`${initialNames.immigrantName}DiffFirstName`]:
                    getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'diffFirstName',
                    ),
                  [`${initialNames.immigrantName}DiffMiddleName`]:
                    getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'diffMiddleName',
                    ),
                  [`${initialNames.immigrantName}DiffLastName`]:
                    getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'diffLastName',
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
                      label="Given Name (First Name)"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `diffFirstName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`${initialNames.immigrantName}DiffFirstName`}
                    />

                    <InputField
                      label="Middle Name"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `diffMiddleName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`${initialNames.immigrantName}DiffMiddleName`}
                    />

                    <InputField
                      label="Family Name (Last Name)"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `diffLastName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`${initialNames.immigrantName}DiffLastName`}
                    />
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      )}
      {quizStep === 8 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={css.smallContainer}
            title="Is your Father still living?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            quizData={familyNMarriageQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative="isFatherLive: No"
            answerPositive="isFatherLive: Yes"
            hasAdditionalOption
            answerAddition="isFatherLive: I don't know"
          />

          {isFatherLive && (
            <Formik
              enableReinitialize
              initialValues={{
                [`${initialNames.immigrantName}CurrentCity`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'currentCity',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={css.containerCenter}>
                  <div>
                    <InputField
                      label="Current city or town of residence"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `currentCity: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`${initialNames.immigrantName}CurrentCity`}
                    />
                  </div>

                  <div>
                    <span>Current country of residence</span>

                    <SelectField
                      showDefaultOption
                      defaultOption=""
                      list={countries}
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `currentCountry: ${e.answer}`,
                        })
                      }
                      question={familyNMarriageQuiz.data[quizStep - 1]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          familyNMarriageQuiz.data,
                        ),
                        'currentCountry',
                      )}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      )}
      {quizStep === 9 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            validationSchema={validationZipCodeSchema}
            initialValues={{
              nameCare: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'nameCare',
              ),
              streetNumber: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'streetNumber',
              ),
              'apt/Ste/FlrN': getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'apt/Ste/FlrN',
              ),
              city: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'city',
              ),
              province: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'province',
              ),
              postalCode: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'postalCode',
              ),
              zipCode: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
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
                  label="In Care Of Name (if any)"
                  placeholder="Leave blank if not applicable"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `nameCare: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="nameCare"
                />

                <InputField
                  label="Street Number and Name"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'country',
                    )}
                  />
                </div>

                {isImmigrantAddressUSA ? (
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
                        question={familyNMarriageQuiz.data[quizStep - 1]}
                        defaultValue={getValueForInput(
                          getCurentUserAnswer(
                            quizStep - 1,
                            userAnswersArray,
                            familyNMarriageQuiz.data,
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
                            id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                            id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `dateFrom: ${date}`,
                    });
                  }}
                  title="Date of Residence - From"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '42',
                    'dateFrom',
                  )}
                />

                <DatePickerSelect
                  isDisabled
                  value="PRESENT"
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `dateTo: ${date}`,
                    });
                  }}
                  title="Date of Residence - To"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '42',
                    'dateTo',
                  )}
                />
              </Form>
            )}
          </Formik>
        </div>
      )}
      {quizStep === 10 && (
        <div>
          <h2 className={css.title}>Last Known International Address</h2>

          <BooleanQuestion
            currentUserAnswer={getCurentUserAnswer(
              quizStep - 1,
              userAnswersArray,
              familyNMarriageQuiz.data,
            )}
            data={familyNMarriageQuiz.data[quizStep - 1]}
            initialNames={initialNames}
            onClick={handleUserAnswer}
            label={getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          />
        </div>
      )}

      {quizStep === 11 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            validationSchema={validationZipCodeSchema}
            initialValues={{
              [`${initialNames.immigrantName}StreetNumber`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'streetNumber',
              ),
              [`${initialNames.immigrantName}Apt/Ste/FlrN`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'apt/Ste/FlrN',
              ),
              [`${initialNames.immigrantName}City`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'city',
              ),
              [`${initialNames.immigrantName}Province`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'province',
              ),
              postalCode: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'postalCode',
              ),
              zipCode: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `streetNumber: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}StreetNumber`}
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
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `apt/Ste/FlrN: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}Apt/Ste/FlrN`}
                />

                <InputField
                  label="City or town"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `city: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}City`}
                />

                <div>
                  <span>Country</span>

                  <SelectField
                    showDefaultOption
                    defaultOption=""
                    list={countries.slice(1)}
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `country: ${e.answer}`,
                      })
                    }
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'country',
                    )}
                  />
                </div>

                <InputField
                  label="Province"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `province: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.immigrantName}Province`}
                />

                <InputField
                  label="Postal Code"
                  onBlur={async e => {
                    const errors = await validateForm();

                    if (!Object.keys(errors).length) {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                        answer: `postalCode: ${e.target.value}`,
                      });
                      submitForm();
                    }
                  }}
                  name="postalCode"
                />

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `dateResidenceFrom: ${date}`,
                    });
                  }}
                  title="Date of Residence - From"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '44',
                    'dateResidenceFrom',
                  )}
                />

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `dateResidenceTo: ${date}`,
                    });
                  }}
                  title="Date of Residence - To"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '44',
                    'dateResidenceTo',
                  )}
                />
              </Form>
            )}
          </Formik>
        </div>
      )}
      {quizStep === 12 && (
        <div className="quizWrapper">
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.smallContainer}>
            <span>
              How many times have you been married previously (Not including
              current marriage)?
            </span>

            <SelectField
              disabled
              list={['1', '2', '3', '4', '5']}
              onChange={e =>
                handleCheckboxAnswer({
                  id: e.id,
                  answer: `marriagesNumber: ${e.answer}`,
                })
              }
              question={familyNMarriageQuiz.data[quizStep - 1]}
              defaultValue={getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'marriagesNumber',
              )}
            />
          </div>
        </div>
      )}
      {quizStep === 13 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            initialValues={{
              [`${initialNames.sponsorName}FirstName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'firstName',
              ),
              [`${initialNames.sponsorName}MiddleName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'middleName',
              ),
              [`${initialNames.sponsorName}LastName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'lastName',
              ),
              [`${initialNames.sponsorName}MarriagePlaceCity`]:
                getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'marriagePlaceCity',
                ),
              [`${initialNames.sponsorName}MarriagePlaceProvince`]:
                getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'marriagePlaceProvince',
                ),
              [`${initialNames.sponsorName}DivorceCity`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'divorceCity',
              ),
              [`${initialNames.sponsorName}DivorceProvince`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'divorceProvince',
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
                  label="Given Name (First Name)"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `lastName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.sponsorName}LastName`}
                />

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `divorceDatePriorSpouse: ${date}`,
                    });
                  }}
                  title="Date of Divorce to Prior Spouse (mm/dd/yyyy)"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '46',
                    'divorceDatePriorSpouse',
                  )}
                />
              </Form>
            )}
          </Formik>
        </div>
      )}
      {quizStep === 14 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            initialValues={{
              [`${initialNames.sponsorName}FirstName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'firstName',
              ),
              [`${initialNames.sponsorName}MiddleName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'middleName',
              ),
              [`${initialNames.sponsorName}LastName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'lastName',
              ),
              [`${initialNames.sponsorName}CityBirth`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'cityBirth',
              ),
              [`${initialNames.sponsorName}DiffFirstName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffFirstName',
              ),
              [`${initialNames.sponsorName}DiffMiddleName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffMiddleName',
              ),
              [`${initialNames.sponsorName}DiffLastName`]: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffLastName',
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
                  label="Given Name (First Name)"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `middleName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.sponsorName}MiddleName`}
                />

                <InputField
                  label="Family Name (Last Name)"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `lastName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name={`${initialNames.sponsorName}LastName`}
                />

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `birthDate: ${date}`,
                    });
                  }}
                  title="Date of Birth (mm/dd/yyyy)"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '47',
                    'birthDate',
                  )}
                />

                <div>
                  <span>Country of Birth</span>

                  <SelectField
                    showDefaultOption
                    defaultOption=""
                    list={countries}
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `birthCountry: ${e.answer}`,
                      })
                    }
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'birthCountry',
                    )}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
      {quizStep === 15 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={css.smallContainer}
            title="Is your mother still living?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            quizData={familyNMarriageQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative="isMotherLive: No"
            answerPositive="isMotherLive: Yes"
            hasAdditionalOption
            answerAddition="isMotherLive: I don't know"
          />

          {isSponsorMotherLive && (
            <Formik
              enableReinitialize
              initialValues={{
                [`${initialNames.sponsorName}CurrentCity`]: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'currentCity',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={css.containerCenter}>
                  <div>
                    <InputField
                      label="Current city or town of residence"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `currentCity: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name={`${initialNames.sponsorName}CurrentCity`}
                    />
                  </div>

                  <div>
                    <span>Current country of residence</span>

                    <SelectField
                      showDefaultOption
                      defaultOption=""
                      list={countries}
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `currentCountry: ${e.answer}`,
                        })
                      }
                      question={familyNMarriageQuiz.data[quizStep - 1]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          familyNMarriageQuiz.data,
                        ),
                        'currentCountry',
                      )}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      )}
      {quizStep === 16 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            initialValues={{
              firstName: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'firstName',
              ),
              middleName: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'middleName',
              ),
              lastName: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'lastName',
              ),
              cityBirth: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'cityBirth',
              ),
              diffFirstName: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffFirstName',
              ),
              diffMiddleName: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffMiddleName',
              ),
              diffLastName: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'diffLastName',
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
                  label="Given Name (First Name)"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `firstName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="firstName"
                />

                <InputField
                  label="Middle Name"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `middleName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="middleName"
                />

                <InputField
                  label="Family Name (Last Name)"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `lastName: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="lastName"
                />

                <DatePickerSelect
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `birthDate: ${date}`,
                    });
                  }}
                  title="Date of Birth (mm/dd/yyyy)"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '49',
                    'birthDate',
                  )}
                />

                <InputField
                  label="City or Town of Birth"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `cityBirth: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="cityBirth"
                />

                <div>
                  <span>Country of Birth</span>

                  <SelectField
                    showDefaultOption
                    defaultOption=""
                    list={countries}
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `birthCountry: ${e.answer}`,
                      })
                    }
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'birthCountry',
                    )}
                  />
                </div>

                <BooleanMultiplyQuestion
                  title={`Did ${initialNames.sponsorName}'s Father Have A Different Name At Birth?`}
                  quizStep={quizStep - 1}
                  answers={userAnswersArray}
                  quizData={familyNMarriageQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  answerNegative="hasDifferentName: No"
                  answerPositive="hasDifferentName: Yes"
                />
              </Form>
            )}
          </Formik>

          {hasSponsorFatherDifferentName && (
            <div className={css.motherDifferentName}>
              <h3 className={css.title}>
                {`Name Of ${initialNames.immigrantName}'s Father At Birth`}
              </h3>

              <Formik
                enableReinitialize
                initialValues={{
                  diffFirstName: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      familyNMarriageQuiz.data,
                    ),
                    'diffFirstName',
                  ),
                  diffMiddleName: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      familyNMarriageQuiz.data,
                    ),
                    'diffMiddleName',
                  ),
                  diffLastName: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      familyNMarriageQuiz.data,
                    ),
                    'diffLastName',
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
                      label="Given Name (First Name)"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `diffFirstName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="diffFirstName"
                    />

                    <InputField
                      label="Middle Name"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `diffMiddleName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="diffMiddleName"
                    />

                    <InputField
                      label="Family Name (Last Name)"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `diffLastName: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="diffLastName"
                    />
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      )}
      {quizStep === 17 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            className={css.smallContainer}
            title="Is your Father still living?"
            quizStep={quizStep - 1}
            answers={userAnswersArray}
            quizData={familyNMarriageQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative="isFatherLive: No"
            answerPositive="isFatherLive: Yes"
            hasAdditionalOption
            answerAddition="isFatherLive: I don't know"
          />

          {isSponsorFatherLive && (
            <Formik
              enableReinitialize
              initialValues={{
                currentCity: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    familyNMarriageQuiz.data,
                  ),
                  'currentCity',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={css.containerCenter}>
                  <div>
                    <InputField
                      label="Current city or town of residence"
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                          answer: `currentCity: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="currentCity"
                    />
                  </div>

                  <div>
                    <span>Current country of residence</span>

                    <SelectField
                      showDefaultOption
                      defaultOption=""
                      list={countries}
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `currentCountry: ${e.answer}`,
                        })
                      }
                      question={familyNMarriageQuiz.data[quizStep - 1]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          familyNMarriageQuiz.data,
                        ),
                        'currentCountry',
                      )}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      )}

      {quizStep === 18 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              familyNMarriageQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            validationSchema={validationZipCodeSchema}
            initialValues={{
              nameCare: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'nameCare',
              ),
              streetNumber: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'streetNumber',
              ),
              'apt/Ste/FlrN': getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'apt/Ste/FlrN',
              ),
              city: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'city',
              ),
              province: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'province',
              ),
              zipCode: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'zipCode',
              ),
              postalCode: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  familyNMarriageQuiz.data,
                ),
                'postalCode',
              ),
            }}
            validateOnBlur
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `nameCare: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="nameCare"
                />

                <InputField
                  label="Street Number and Name"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `apt/Ste/FlrN: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="apt/Ste/FlrN"
                />

                <InputField
                  label="city or town"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                    question={familyNMarriageQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        familyNMarriageQuiz.data,
                      ),
                      'country',
                    )}
                  />
                </div>

                {isSponsorAddressUSA ? (
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
                        question={familyNMarriageQuiz.data[quizStep - 1]}
                        defaultValue={getValueForInput(
                          getCurentUserAnswer(
                            quizStep - 1,
                            userAnswersArray,
                            familyNMarriageQuiz.data,
                          ),
                          'state',
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
                            id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                          id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                            id: familyNMarriageQuiz.data[quizStep - 1]?.id,
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
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `dateFrom: ${date}`,
                    });
                  }}
                  title="Date of Residence - From"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '51',
                    'dateFrom',
                  )}
                />

                <DatePickerSelect
                  isDisabled
                  value="PRESENT"
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: familyNMarriageQuiz.data[quizStep - 1]?.id,
                      answer: `dateTo: ${date}`,
                    });
                  }}
                  title="Date of Residence - To"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '51',
                    'dateTo',
                  )}
                />
              </Form>
            )}
          </Formik>
        </div>
      )}
      {quizStep === 19 && (
        <Summary
          list={tabDTO[3].tabs}
          incompleteQuizItems={
            familyNMarriageQuiz.incompleteFamilyNMarriageQuizItem
          }
        />
      )}
    </>
  );
};

export { FamilyNMarriage };
