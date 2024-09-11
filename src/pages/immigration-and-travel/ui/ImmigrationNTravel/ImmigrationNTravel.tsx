/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import {
  immigrationNtravelSelector,
  quizNavigationSelector,
  resetQuizStep,
  setImmigrationNtravel,
  setIncompleteImmigrationNtravelQuizItems,
  setUserAnswers,
  userAnswerSelector,
} from '@/entities/quiz';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
  BooleanMultiplyQuestion,
  DatePickerSelect,
  InfoCard,
  InputField,
  Textarea,
} from '@/shared/ui';

import passport from '/public/assets/icons/Passport.svg';
import {
  getAllUserAnswers,
  getAllUsersInfo,
  getCountry,
  getQuiz,
  getStates,
  getUserAnswers,
  getVisas,
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

import css from './ImmigrationNTravel.module.scss';
import { SelectField } from '@/shared/ui/SelectField';
import { Summary } from '@/widgets/summary';
import { tabDTO } from '@/entities/sidebar';
import { DocumentData } from 'firebase/firestore';
import { getAnswerFromArray, getUserAnswerById } from '@/entities/forms';

const validationVisaDataSchema = Yup.object({
  aNumber: Yup.string().matches(
    /^\d{7,9}$/,
    'Number must be 7 to 9 digits long',
  ),

  uscisNumber: Yup.string().matches(
    /^\d{10,13}$/,
    'USCIS Account Number must be 10 to 13 digits long',
  ),

  nonImmigrantVisaNumber: Yup.string().matches(
    /^[a-zA-Z0-9]{8}$/,
    'Visa number must be exactly 8 alphanumeric characters long',
  ),
});

const ImmigrationNTravel = () => {
  const dispatch = useAppDispatch();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [visas, setVisas] = useState([]);
  const [currentUserChoiseId, setCurrentUserChoiseId] = useState('');
  const [allUserAnswer, setAllUserAnswer] = useState<DocumentData>([]);

  const { quizStep } = useAppSelector(quizNavigationSelector);
  const { immigrationNtravelQuiz } = useAppSelector(immigrationNtravelSelector);
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
  const isAnyoneSponsoredPast
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '52')?.answer,
      'isSponsoredAnyone',
    ) === 'Yes';

  const getAnswerById = (answerId: string, key: string = '') => {
    return (
      getAnswerFromArray(getUserAnswerById(allUserAnswer, answerId), key) ?? ''
    );
  };

  // prettier-ignore
  const isNameExactOnI94
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '55')?.answer,
      'isNameExactOnI94',
    ) === 'Yes';

  const howDidYouBecomeUsCitizen = getValueForInput(
    userAnswersArray.find(el => el.questionId === '82')?.answer,
    'howDidYouBecomeUsCitizen',
  );

  const obtainedCertificateOfNaturalizationOrCitizenship = getValueForInput(
    userAnswersArray.find(el => el.questionId === '82')?.answer,
    'obtainedCertificateOfNaturalizationOrCitizenship',
  );

  // prettier-ignore
  const enteringDocumentPassport
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '53')?.answer,
      'enteringDocument',
    );

  // prettier-ignore
  const isI94ExpDS
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '54')?.answer,
      'isExpirationSayD/S',
    ) === 'Yes';

  // prettier-ignore
  const chosenFormStatusI94
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '54')?.answer,
      'formStatusI94',
    );

  // prettier-ignore
  const statusStillSame
    = getValueForInput(
      userAnswersArray.find(el => el.questionId === '54')?.answer,
      'isStatusStillTheSame',
    );

  const handleCheckboxAnswer = async (userChoice: TUserChoice) => {
    const questionsWithDataType = [
      '52',
      '53',
      '54',
      '55',
      '56',
      '57',
      '82',
      '83',
    ];

    setCurrentUserChoiseId(userChoice.id);

    await storeAnswer(
      userAnswers,
      userChoice,
      userData?.user ?? null,
      EQuestionsTypeId.IMMIGRATION_AND_TRAVEL,
      dispatch,
      setUserAnswers,
      'multipleAnswer',
      questionsWithDataType.includes(userChoice.id)
        ? EQuestionsDataType.DATA
        : '',
    );

    const dataAnswers = await getUserAnswers(
      EQuestionsTypeId.IMMIGRATION_AND_TRAVEL,
      userData?.user.id ?? '',
    );

    // prettier-ignore
    const [isAnswerRequredIds, updateForAnswerCount]
      = getCorrectAnswerToCountMetrics(immigrationNtravelQuiz.data, dataAnswers);

    if (isAnswerRequredIds.includes(userChoice.id)) {
      updateUserInfo(
        userData?.user.id ?? '',
        {
          testsCompletedInfo: {
            ...userData?.user.testsCompletedInfo,
            immigrationNTravel: calculatePercentage(
              getAllAnswersCount(
                updateForAnswerCount,
                immigrationNtravelQuiz.data,
              ),
              immigrationNtravelQuiz.TOTAL_FIELDS,
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
          EQuestionsTypeId.IMMIGRATION_AND_TRAVEL,
        )) as IQuestions[];

        dispatch(setImmigrationNtravel(quizData));
      } catch (error) {
        // console.log(error)
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const dataAnswers = await getUserAnswers(
          EQuestionsTypeId.IMMIGRATION_AND_TRAVEL,
          userData?.user.id ?? '',
        );

        const incompleteQuizAnswerIds: string[] = getIncompleteQuizAnswerIds(
          userAnswersArray,
          immigrationNtravelQuiz.data,
        );

        dispatch(setUserAnswers(dataAnswers));

        dispatch(
          setIncompleteImmigrationNtravelQuizItems(incompleteQuizAnswerIds),
        );
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
        setVisas(await getVisas());
      } catch (error) {
        // console.log(error)
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const users = await getAllUsersInfo();
        const userToFill = users.find(
          user => user.email === userData?.user.email,
        );
        const data = await getAllUserAnswers(userToFill?.id ?? '0');

        setAllUserAnswer(Object.values(data));
      } catch (error) {
        // console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    dispatch(resetQuizStep());
  }, [dispatch]);

  return (
    <>
      {quizStep === 0 && (
        <InfoCard icon={passport}>
          <h2>Let us now get to Immigration & Travel details</h2>
          <p>
            The upcoming section comprises of your Immigration and Travel
            specifics. We would need to gain a comprehensive understanding of
            your travel history, immigration status, and other related details.
            This information is pivotal for accurate processing of your
            application. Please ensure all data is accurate and up-to-date.
            Every detail you provide will help streamline your application.
          </p>
        </InfoCard>
      )}

      {quizStep === 1 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              immigrationNtravelQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.containerDown} style={{ marginBottom: '5rem' }}>
            <BooleanMultiplyQuestion
              className={cn(css.buttonWrapper)}
              title={`${initialNames.sponsorName}, Have you ever sponsored anyone in the past?`}
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={immigrationNtravelQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="isSponsoredAnyone: No"
              answerPositive="isSponsoredAnyone: Yes"
            />

            {isAnyoneSponsoredPast && (
              <>
                <div>
                  <span>{`${initialNames.sponsorName}, How many people have you sponsored?`}</span>
                  <SelectField
                    list={['1', '2', '3']}
                    className={css.otherNamesSelect}
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `peopleCountSponsored: ${e.answer}`,
                      })
                    }
                    question={immigrationNtravelQuiz.data[quizStep - 1]}
                    showDefaultOption
                    disabled
                    defaultOption="1"
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        immigrationNtravelQuiz.data,
                      ),
                      'peopleCountSponsored',
                    )}
                  />
                </div>

                <BooleanMultiplyQuestion
                  className={cn(css.buttonWrapper)}
                  title="Is this person currently a lawful permanent resident (green card holder)?"
                  quizStep={quizStep - 1}
                  answers={userAnswersArray}
                  quizData={immigrationNtravelQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  answerNegative="isLawfulResident: No"
                  answerPositive="isLawfulResident: Yes"
                />
              </>
            )}
          </div>

          {isAnyoneSponsoredPast && (
            <>
              <h2
                className={css.title}
              >{`Previously sponsored people by ${initialNames.sponsorName} - Details`}</h2>

              <Formik
                enableReinitialize
                validationSchema={validationVisaDataSchema}
                initialValues={{
                  firstNameFiled: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      immigrationNtravelQuiz.data,
                    ),
                    'firstNameFiled',
                  ),
                  middleNameFiled: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      immigrationNtravelQuiz.data,
                    ),
                    'middleNameFiled',
                  ),
                  lastNameFiled: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      immigrationNtravelQuiz.data,
                    ),
                    'lastNameFiled',
                  ),
                  cityTownFiled: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      immigrationNtravelQuiz.data,
                    ),
                    'cityTownFiled',
                  ),
                  resultFiled: getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      immigrationNtravelQuiz.data,
                    ),
                    'resultFiled',
                  ),
                }}
                validateOnChange={false}
                onSubmit={() => {}}
              >
                {({ handleBlur, submitForm, validateForm }) => (
                  <Form className={css.form}>
                    <InputField
                      label="Given Name (First Name)"
                      className={css.firstName}
                      onBlur={async e => {
                        const errors = await validateForm();

                        if (!Object.keys(errors).length) {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                            answer: `firstNameFiled: ${e.target.value}`,
                          });
                          submitForm();
                        }
                      }}
                      name="firstNameFiled"
                    />

                    <InputField
                      label="Middle Name"
                      className={css.middleName}
                      onBlur={async e => {
                        const errors = await validateForm();

                        if (!Object.keys(errors).length) {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                            answer: `middleNameFiled: ${e.target.value}`,
                          });
                          submitForm();
                        }
                      }}
                      name="middleNameFiled"
                    />

                    <InputField
                      label="Family Name (Last Name)"
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                          answer: `lastNameFiled: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="lastNameFiled"
                    />

                    <InputField
                      label="City or Town (place of filing)"
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                          answer: `cityTownFiled: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="cityTownFiled"
                    />

                    <div>
                      <span>State (place of filing)</span>

                      <SelectField
                        list={states}
                        showDefaultOption
                        defaultOption=""
                        onChange={e =>
                          handleCheckboxAnswer({
                            id: e.id,
                            answer: `stateFiled: ${e.answer}`,
                          })
                        }
                        question={immigrationNtravelQuiz.data[quizStep - 1]}
                        defaultValue={getValueForInput(
                          getCurentUserAnswer(
                            quizStep - 1,
                            userAnswersArray,
                            immigrationNtravelQuiz.data,
                          ),
                          'stateFiled',
                        )}
                      />
                    </div>

                    <DatePickerSelect
                      title="Date filed"
                      initialDate={getInitialDateValue(
                        userAnswersArray,
                        '52',
                        'dateFiled',
                      )}
                      onClick={date => {
                        handleCheckboxAnswer({
                          id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                          answer: `dateFiled: ${date}`,
                        });
                      }}
                    />

                    <InputField
                      label="Result (for example, approved, denied, withdrawn)"
                      className={css.lastName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                          answer: `resultFiled: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="resultFiled"
                    />
                  </Form>
                )}
              </Formik>
            </>
          )}
        </div>
      )}

      {quizStep === 2 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              immigrationNtravelQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            validationSchema={validationVisaDataSchema}
            initialValues={{
              aNumber: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  immigrationNtravelQuiz.data,
                ),
                'aNumber',
              ),
              uscisNumber: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  immigrationNtravelQuiz.data,
                ),
                'uscisNumber',
              ),
              lastArrivalUSCity: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  immigrationNtravelQuiz.data,
                ),
                'lastArrivalUSCity',
              ),
              entryPort: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  immigrationNtravelQuiz.data,
                ),
                'entryPort',
              ),
            }}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {({ handleBlur, submitForm, validateForm }) => (
              <Form className={css.form}>
                <InputField
                  label="A-Number (if any)"
                  placeholder="Leave blank if not applicable"
                  className={css.firstName}
                  onBlur={async e => {
                    const errors = await validateForm();

                    if (!Object.keys(errors).length) {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                        answer: `aNumber: ${e.target.value}`,
                      });
                      submitForm();
                    }
                  }}
                  name="aNumber"
                />

                <InputField
                  label="USCIS Online Account Number (if any)"
                  placeholder="Leave blank if not applicable"
                  className={css.middleName}
                  onBlur={async e => {
                    const errors = await validateForm();

                    if (!Object.keys(errors).length) {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                        answer: `uscisNumber: ${e.target.value}`,
                      });
                      submitForm();
                    }
                  }}
                  name="uscisNumber"
                />

                <InputField
                  label="Last Arrival into the United States - City"
                  className={css.lastName}
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `lastArrivalUSCity: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="lastArrivalUSCity"
                />

                <div>
                  <span>Last Arrival into the United States - State</span>

                  <SelectField
                    list={states}
                    showDefaultOption
                    defaultOption=""
                    onChange={e =>
                      handleCheckboxAnswer({
                        id: e.id,
                        answer: `lastArrivalUSState: ${e.answer}`,
                      })
                    }
                    question={immigrationNtravelQuiz.data[quizStep - 1]}
                    defaultValue={getValueForInput(
                      getCurentUserAnswer(
                        quizStep - 1,
                        userAnswersArray,
                        immigrationNtravelQuiz.data,
                      ),
                      'lastArrivalUSState',
                    )}
                  />
                </div>

                <DatePickerSelect
                  title="Last Arrival into the United States - Date of Arrival"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '53',
                    'lastArrivalUS',
                  )}
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `lastArrivalUS: ${date}`,
                    });
                  }}
                />

                <InputField
                  label="Port of entry (Last arrival)"
                  placeholder="Seattle Tacoma Airport, Seattle"
                  className={css.lastName}
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `entryPort: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="entryPort"
                />
              </Form>
            )}
          </Formik>

          <h3 className={cn(css.title, css.arrivalDocumentsTitle)}>
            Passport and Travel Doc
          </h3>

          <div className="">
            <Formik
              enableReinitialize
              validationSchema={validationVisaDataSchema}
              initialValues={{
                passportNumber: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    immigrationNtravelQuiz.data,
                  ),
                  'passportNumber',
                ),
                travelDocumentNumber: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    immigrationNtravelQuiz.data,
                  ),
                  'travelDocumentNumber',
                ),
                nonImmigrantVisaNumber: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    immigrationNtravelQuiz.data,
                  ),
                  'nonImmigrantVisaNumber',
                ),
              }}
              validate={() => {}}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm, validateForm }) => (
                <Form className={css.form}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                    }}
                  >
                    <BooleanMultiplyQuestion
                      className={cn(css.buttonWrapper)}
                      title="What document did you enter when entering the country?"
                      quizStep={quizStep - 1}
                      answers={userAnswersArray}
                      quizData={immigrationNtravelQuiz.data}
                      handleCheckboxAnswer={handleCheckboxAnswer}
                      answerNegative="enteringDocument: Travel Document"
                      answerPositive="enteringDocument: Passport"
                    />

                    {enteringDocumentPassport === 'Passport' && (
                      <InputField
                        label="Passport Number Used at Last Arrival"
                        className={css.firstName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                            answer: `passportNumber: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="passportNumber"
                      />
                    )}

                    {enteringDocumentPassport === 'Travel Document' && (
                      <InputField
                        label="Travel Document Number Used at Last Arrival"
                        className={css.firstName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                            answer: `travelDocumentNumber: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="travelDocumentNumber"
                      />
                    )}
                  </div>

                  <DatePickerSelect
                    title="Expiration Date of this Passport or Travel Document"
                    initialDate={getInitialDateValue(
                      userAnswersArray,
                      '53',
                      'expOfPassportTravelDocument',
                    )}
                    onClick={date => {
                      handleCheckboxAnswer({
                        id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                        answer: `expOfPassportTravelDocument: ${date}`,
                      });
                    }}
                  />

                  <div>
                    <span>
                      Country that Issued this Passport or Travel Document
                    </span>

                    <SelectField
                      list={countries}
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `issuingCountry: ${e.answer}`,
                        })
                      }
                      question={immigrationNtravelQuiz.data[quizStep - 1]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          immigrationNtravelQuiz.data,
                        ),
                        'issuingCountry',
                      )}
                    />
                  </div>

                  <InputField
                    label="Non-immigrant visa number from this passport (if any)"
                    placeholder="Leave blank if not applicable"
                    className={css.lastName}
                    onBlur={async e => {
                      const errors = await validateForm();

                      if (!Object.keys(errors).length) {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                          answer: `nonImmigrantVisaNumber: ${e.target.value}`,
                        });
                        submitForm();
                      }
                    }}
                    name="nonImmigrantVisaNumber"
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {quizStep === 3 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              immigrationNtravelQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <div className={css.containerDown}>
            <BooleanMultiplyQuestion
              className={cn(css.buttonWrapper)}
              isDisabled
              choosePositive
              title="Were you inspected at port of entry?"
              quizStep={quizStep - 1}
              answers={userAnswersArray}
              quizData={immigrationNtravelQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="isInspectedAtEntryPort: No"
              answerPositive="isInspectedAtEntryPort: Yes"
            />

            <Formik
              enableReinitialize
              initialValues={{
                formI94Number: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    immigrationNtravelQuiz.data,
                  ),
                  'formI94Number',
                ),
                currentImmigrationStatus: getValueForInput(
                  getCurentUserAnswer(
                    quizStep - 1,
                    userAnswersArray,
                    immigrationNtravelQuiz.data,
                  ),
                  'currentImmigrationStatus',
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
                    label="Form I-94 Arrival-Departure Record Number"
                    className={css.firstName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                        answer: `formI94Number: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="formI94Number"
                  />

                  <BooleanMultiplyQuestion
                    className={cn(css.buttonWrapper)}
                    title='Does your I-94 expiration say "D/S"'
                    quizStep={quizStep - 1}
                    answers={userAnswersArray}
                    quizData={immigrationNtravelQuiz.data}
                    handleCheckboxAnswer={handleCheckboxAnswer}
                    answerPositive="isExpirationSayD/S: Yes"
                    answerNegative="isExpirationSayD/S: No"
                  />

                  {!isI94ExpDS && (
                    <DatePickerSelect
                      title="Expiration Date of Authorized Stay Shown on Form I-94"
                      initialDate={getInitialDateValue(
                        userAnswersArray,
                        '54',
                        'expirationDateOfAuthorizedFormI94',
                      )}
                      onClick={date => {
                        handleCheckboxAnswer({
                          id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                          answer: `expirationDateOfAuthorizedFormI94: ${date}`,
                        });
                      }}
                    />
                  )}

                  <div>
                    <span>
                      Status on Form I-94 (for example, class of admission, or
                      paroled, if paroled)
                    </span>

                    <SelectField
                      list={visas}
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `formStatusI94: ${e.answer}`,
                        })
                      }
                      question={immigrationNtravelQuiz.data[quizStep - 1]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep - 1,
                          userAnswersArray,
                          immigrationNtravelQuiz.data,
                        ),
                        'formStatusI94',
                      )}
                    />
                  </div>

                  {chosenFormStatusI94 && (
                    <BooleanMultiplyQuestion
                      className={cn(css.buttonWrapper)}
                      title={`${initialNames.immigrantName} is your current status still ${chosenFormStatusI94}`}
                      quizStep={quizStep - 1}
                      answers={userAnswersArray}
                      quizData={immigrationNtravelQuiz.data}
                      handleCheckboxAnswer={handleCheckboxAnswer}
                      answerPositive="isStatusStillTheSame: Yes"
                      answerNegative="isStatusStillTheSame: No"
                    />
                  )}

                  {statusStillSame === 'No' && (
                    <InputField
                      label="What is your current immigration status (if it has changed since your arrival, for example, B-2 visitor, F-1, parolee, Deferred action or no status)?"
                      className={css.firstName}
                      onBlur={e => {
                        handleBlur(e);
                        handleCheckboxAnswer({
                          id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                          answer: `currentImmigrationStatus: ${e.target.value}`,
                        });
                        submitForm();
                      }}
                      name="currentImmigrationStatus"
                    />
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {quizStep === 4 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              immigrationNtravelQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <BooleanMultiplyQuestion
            title="Does your name appear EXACTLY as below on your I-94?"
            quizStep={quizStep - 1}
            className={cn(
              css.childDetailsButtons,
              css.buttonWrapper,
              css.isNameExactOnI94,
            )}
            answers={userAnswersArray}
            quizData={immigrationNtravelQuiz.data}
            handleCheckboxAnswer={handleCheckboxAnswer}
            answerNegative={`isNameExactOnI94: No`}
            answerPositive={`isNameExactOnI94: Yes`}
          />

          <Formik
            enableReinitialize
            initialValues={{
              lastNameI94: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  immigrationNtravelQuiz.data,
                ),
                'lastNameI94',
              ),
              firstNameI94: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  immigrationNtravelQuiz.data,
                ),
                'firstNameI94',
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
                  label="Name as on I94 - First name"
                  disabled={isNameExactOnI94}
                  className={css.middleName}
                  placeholder={
                    isNameExactOnI94
                      ? `${getAnswerById('21', 'firstName')} ${getAnswerById('21', 'middleName')}`
                      : ''
                  }
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `firstNameI94: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="firstNameI94"
                />

                <InputField
                  label="Name as on I94 - Last name"
                  className={css.firstName}
                  disabled={isNameExactOnI94}
                  placeholder={
                    isNameExactOnI94 ? `${getAnswerById('21', 'lastName')}` : ''
                  }
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `lastNameI94: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="lastNameI94"
                />
              </Form>
            )}
          </Formik>
        </div>
      )}

      {quizStep === 5 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              immigrationNtravelQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            validationSchema={validationVisaDataSchema}
            initialValues={{
              underlyingPetitionReceiptN: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  immigrationNtravelQuiz.data,
                ),
                'underlyingPetitionReceiptN',
              ),
              uscisNumber: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  immigrationNtravelQuiz.data,
                ),
                'uscisNumber',
              ),
            }}
            validate={() => {}}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {({ handleBlur, submitForm, validateForm }) => (
              <Form className={css.containerDown}>
                <InputField
                  label="Receipt Number of Underlying Petition (if any)"
                  placeholder="Leave blank if not applicable"
                  className={css.middleName}
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `underlyingPetitionReceiptN: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="underlyingPetitionReceiptN"
                />

                <DatePickerSelect
                  title="Priority Date from Underlying Petition (if any)"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '56',
                    'underlyingPetitionPriorityDate',
                  )}
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `underlyingPetitionPriorityDate: ${date}`,
                    });
                  }}
                />

                <InputField
                  label="USCIS Online Account Number (if any)"
                  placeholder="Leave blank if not applicable"
                  className={css.firstName}
                  onBlur={async e => {
                    const errors = await validateForm();

                    if (!Object.keys(errors).length) {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                        answer: `uscisNumber: ${e.target.value}`,
                      });
                      submitForm();
                    }
                  }}
                  name="uscisNumber"
                />
              </Form>
            )}
          </Formik>
        </div>
      )}

      {quizStep === 6 && (
        <div>
          <h2 className={css.title}>
            {getReplacedName(
              immigrationNtravelQuiz.data[quizStep - 1]?.question,
              initialNames,
            )}
          </h2>

          <Formik
            enableReinitialize
            initialValues={{
              expectedLengthOfTripInDays: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  immigrationNtravelQuiz.data,
                ),
                'expectedLengthOfTripInDays',
              ),
              USCISAccountNumber: getValueForInput(
                getCurentUserAnswer(
                  quizStep - 1,
                  userAnswersArray,
                  immigrationNtravelQuiz.data,
                ),
                'USCISAccountNumber',
              ),
            }}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {({ handleBlur, submitForm }) => (
              <Form className={css.containerDown}>
                <DatePickerSelect
                  styles={{ width: '100%' }}
                  title="Date of Intended departure"
                  initialDate={getInitialDateValue(
                    userAnswersArray,
                    '57',
                    'dateOfIntendedDeparture',
                  )}
                  onClick={date => {
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `dateOfIntendedDeparture: ${date}`,
                    });
                  }}
                />

                <InputField
                  label="Expected length of trip in days"
                  placeholder="Leave blank if not applicable"
                  className={css.middleName}
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `expectedLengthOfTripInDays: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                  name="expectedLengthOfTripInDays"
                />

                <Textarea
                  defaultValue={getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      immigrationNtravelQuiz.data,
                    ),
                    'purposeOfTrip',
                  )}
                  name="purposeTrip"
                  label="Purpose of your Trip"
                  placeholder="Example: To attend my brother's wedding and see my ailing grandmother"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `purposeOfTrip: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                />

                <Textarea
                  defaultValue={getValueForInput(
                    getCurentUserAnswer(
                      quizStep - 1,
                      userAnswersArray,
                      immigrationNtravelQuiz.data,
                    ),
                    'countriesVisitList',
                  )}
                  name="countriesVisitList"
                  label="List of countries to visit"
                  placeholder="Example: Mexico, Cuba, India"
                  onBlur={e => {
                    handleBlur(e);
                    handleCheckboxAnswer({
                      id: immigrationNtravelQuiz.data[quizStep - 1]?.id,
                      answer: `countriesVisitList: ${e.target.value}`,
                    });
                    submitForm();
                  }}
                />

                <BooleanMultiplyQuestion
                  className={cn(css.buttonWrapper)}
                  title="Do you intend to use this travel document for more than 1 trip?"
                  quizStep={quizStep - 1}
                  answers={userAnswersArray}
                  quizData={immigrationNtravelQuiz.data}
                  handleCheckboxAnswer={handleCheckboxAnswer}
                  answerPositive="isMultipleTrips: Yes"
                  answerNegative="isMultipleTrips: No"
                />
              </Form>
            )}
          </Formik>
        </div>
      )}

      {quizStep === 7 && (
        <div>
          <h2
            className={css.title}
          >{`${initialNames.sponsorName}'s citizenship details`}</h2>

          <div className={css.howDidYouBecomeUsCitizenWrapper}>
            <BooleanMultiplyQuestion
              className={cn(css.buttonWrapper)}
              title="How did you become a US citizen?"
              quizStep={quizStep}
              answers={userAnswersArray}
              quizData={immigrationNtravelQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              hasAdditionalOption
              answerNegative="howDidYouBecomeUsCitizen: Naturalization"
              answerPositive="howDidYouBecomeUsCitizen: Birth"
              answerAddition="howDidYouBecomeUsCitizen: Parents"
            />
            {(howDidYouBecomeUsCitizen === 'Naturalization' ||
              howDidYouBecomeUsCitizen === 'Parents') && (
              <BooleanMultiplyQuestion
                className={cn(css.buttonWrapper)}
                title="Have you obtained a Certificate of Naturalization or a Certificate of Citizenship?"
                quizStep={quizStep}
                answers={userAnswersArray}
                quizData={immigrationNtravelQuiz.data}
                handleCheckboxAnswer={handleCheckboxAnswer}
                answerNegative="obtainedCertificateOfNaturalizationOrCitizenship: No"
                answerPositive="obtainedCertificateOfNaturalizationOrCitizenship: Yes"
              />
            )}
            <BooleanMultiplyQuestion
              className={cn(css.buttonWrapper)}
              title="Did you gain lawful permanent status or citizenship through adoption?"
              quizStep={quizStep}
              answers={userAnswersArray}
              quizData={immigrationNtravelQuiz.data}
              handleCheckboxAnswer={handleCheckboxAnswer}
              answerNegative="gainedPermanentStatusOrCitizenshipThroughAdoption: No"
              answerPositive="gainedPermanentStatusOrCitizenshipThroughAdoption: Yes"
            />

            {obtainedCertificateOfNaturalizationOrCitizenship === 'Yes' &&
              (howDidYouBecomeUsCitizen === 'Naturalization' ||
                howDidYouBecomeUsCitizen === 'Parents') && (
                <Formik
                  enableReinitialize
                  initialValues={{
                    certificateNumber: getValueForInput(
                      getCurentUserAnswer(
                        quizStep,
                        userAnswersArray,
                        immigrationNtravelQuiz.data,
                      ),
                      'certificateNumber',
                    ),
                    issuancePlace: getValueForInput(
                      getCurentUserAnswer(
                        quizStep,
                        userAnswersArray,
                        immigrationNtravelQuiz.data,
                      ),
                      'issuancePlace',
                    ),
                  }}
                  validateOnChange={false}
                  onSubmit={() => {}}
                >
                  {({ handleBlur, submitForm }) => (
                    <Form className={css.containerDown}>
                      <InputField
                        label="Certificate Number"
                        className={css.middleName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: immigrationNtravelQuiz.data[quizStep]?.id,
                            answer: `certificateNumber: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="certificateNumber"
                      />

                      <InputField
                        label="Place of Issuance"
                        className={css.middleName}
                        onBlur={e => {
                          handleBlur(e);
                          handleCheckboxAnswer({
                            id: immigrationNtravelQuiz.data[quizStep]?.id,
                            answer: `issuancePlace: ${e.target.value}`,
                          });
                          submitForm();
                        }}
                        name="issuancePlace"
                      />

                      <DatePickerSelect
                        styles={{ width: '100%' }}
                        title="Date of Issuance"
                        initialDate={getInitialDateValue(
                          userAnswersArray,
                          '82',
                          'issuanceDate',
                        )}
                        onClick={date => {
                          handleCheckboxAnswer({
                            id: immigrationNtravelQuiz.data[quizStep]?.id,
                            answer: `issuanceDate: ${date}`,
                          });
                        }}
                      />
                    </Form>
                  )}
                </Formik>
              )}
          </div>
        </div>
      )}

      {quizStep === 8 && (
        <div>
          <h2
            className={css.title}
          >{`Field Office For Application for ${initialNames.immigrantName}`}</h2>
          <p className={css.fieldOfficeText}>
            Let us identify the appropriate field office for your
            application,&nbsp;
            <a
              style={{
                color: 'blue',
                textDecoration: 'underline',
              }}
              href="https://www.uscis.gov/about-us/find-a-uscis-office/field-offices"
              target="_blank"
              rel="noreferrer"
            >
              click here
            </a>
            {` to lookup the correct USCIS field office. Use ${initialNames.immigrantName}'s
            physical address to locate the correct field office`}
          </p>
          <div>
            <Formik
              enableReinitialize
              initialValues={{
                cityOrTown: getValueForInput(
                  getCurentUserAnswer(
                    quizStep,
                    userAnswersArray,
                    immigrationNtravelQuiz.data,
                  ),
                  'cityOrTown',
                ),
              }}
              validateOnChange={false}
              onSubmit={() => {}}
            >
              {({ handleBlur, submitForm }) => (
                <Form className={css.containerDown}>
                  <InputField
                    label="City or Town"
                    className={css.middleName}
                    onBlur={e => {
                      handleBlur(e);
                      handleCheckboxAnswer({
                        id: immigrationNtravelQuiz.data[quizStep]?.id,
                        answer: `cityOrTown: ${e.target.value}`,
                      });
                      submitForm();
                    }}
                    name="cityOrTown"
                  />

                  <div style={{ width: '100%' }}>
                    <span>State</span>

                    <SelectField
                      list={states}
                      showDefaultOption
                      defaultOption=""
                      onChange={e =>
                        handleCheckboxAnswer({
                          id: e.id,
                          answer: `state: ${e.answer}`,
                        })
                      }
                      question={immigrationNtravelQuiz.data[quizStep]}
                      defaultValue={getValueForInput(
                        getCurentUserAnswer(
                          quizStep,
                          userAnswersArray,
                          immigrationNtravelQuiz.data,
                        ),
                        'state',
                      )}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {quizStep === 9 && (
        <Summary
          list={tabDTO[4]?.tabs}
          incompleteQuizItems={
            immigrationNtravelQuiz.incompleteImmigrationNtravelQuizItems
          }
        />
      )}
    </>
  );
};

export { ImmigrationNTravel };
