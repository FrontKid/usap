import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { useLocalStorage } from '@uidotdev/usehooks';

import {
  eligibilityQuizSelector,
  quizNavigationSelector,
  resetQuizStep,
  setEligibilityQuiz,
  setUserAnswers,
  userAnswerSelector,
} from '@/entities/quiz';

import {
  IQuestions,
  getQuiz,
  getUserAnswers,
  getVisas,
  updateUserAgreements,
} from '@/shared/firebase/services';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
  ECollectionNames,
  EQuestionsTypeId,
  ISponsorImmigrantPair,
} from '@/shared/types';
import {
  InfoCard,
  Button,
  InputField,
  BooleanQuestion,
  IncorrectAnswer,
} from '@/shared/ui';
import { TUserChoice, storeAnswer } from '@/shared/utils';

// prettier-ignore
import { eligibilityApplicantNamesShema }
  from '../../utils/eligibilityApplicantNamesShema';

import magnifierSVG from '/assets/icons/Magnifier.svg';
import congratulationsSVG from '/assets/icons/Congratulations.svg';

import css from './EligibilityQuiz.module.scss';

const EligibilityQuiz = () => {
  const [visas, setVisas] = useState([]);

  const dispatch = useAppDispatch();

  const { quizStep, isAnswerIncorrect } = useAppSelector(
    quizNavigationSelector,
  );
  const { eligibilityQuiz } = useAppSelector(eligibilityQuizSelector);
  const { userAnswers } = useAppSelector(userAnswerSelector);

  // prettier-ignore
  const [applicantNicknams, setApplicantNicknams]
    = useLocalStorage<ISponsorImmigrantPair>('sponsorImmigrantPair');
  const [userData, setUserData] = useLocalStorage<TUser>('user');

  const initialNames: ISponsorImmigrantPair = {
    immigrantName: applicantNicknams?.immigrantName ?? '',
    sponsorName: applicantNicknams?.sponsorName ?? '',
  };

  const userAnswersArray = Object.values(userAnswers);

  // prettier-ignore
  const userAnswer
    = userAnswersArray.find(
      el => el.questionId === eligibilityQuiz.data[quizStep - 3]?.id,
    )?.answer ?? '';

  // prettier-ignore
  const advanceParole = userAnswersArray.find(
    el => el.questionId === '80',
  )?.answer ?? '';

  // prettier-ignore
  const shoulddGoToAnAdvanceParole
    = Object.values(userAnswers).find(el => el.questionId === '5')?.answer
    === 'CH - PAROLEE (HUMANITARIAN-HQ AUTH)';

  const quizTitle = shoulddGoToAnAdvanceParole
    ? `Question ${quizStep - 2 > 5 ? quizStep - 1 : quizStep - 2} of 15`
    : `Question ${quizStep - 2} of 14`;

  const handleNames = (data: ISponsorImmigrantPair) => {
    setApplicantNicknams(state => ({
      ...state,
      immigrantName: data.immigrantName ?? '',
      sponsorName: data.sponsorName ?? '',
    }));
  };

  const handleUserAnswer = async (userChoice: TUserChoice) => {
    storeAnswer(
      userAnswers,
      userChoice,
      userData?.user ?? null,
      EQuestionsTypeId.ELIGIBILITY_QUIZ,
      dispatch,
      setUserAnswers,
    );
  };

  const handleUserAgreements = async (value: boolean) => {
    await updateUserAgreements(
      userData?.user.id ?? '',
      {
        isAgreeLegalAgreements: value,
      },
      setUserData,
    );
  };

  useEffect(() => {
    (async () => {
      try {
        dispatch(
          setEligibilityQuiz(
            (await getQuiz(
              ECollectionNames.QUESTIONS,
              EQuestionsTypeId.ELIGIBILITY_QUIZ,
            )) as IQuestions[],
          ),
        );
      } catch (error) {
        // console.error(error);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      setVisas(await getVisas());
    })();
  }, []);

  useEffect(() => {
    dispatch(resetQuizStep());

    (async () => {
      try {
        const data = await getUserAnswers(
          'EligibilityQuiz',
          userData?.user.id ?? '',
        );

        dispatch(setUserAnswers(data));
      } catch (error) {
        // console.log(error)
      }
    })();
  }, [userData?.user.id, dispatch]);

  if (isAnswerIncorrect) {
    return <IncorrectAnswer />;
  }

  return (
    <>
      {quizStep === 0 && (
        <InfoCard icon={magnifierSVG}>
          <h2>2 minute quiz to determine your eligibility!</h2>
          <p>
            Immigrants and their needs are unique. In the next 2 minutes we will
            figure out if you are eligible and if we can help or if your case is
            more suited for a lawyer.
          </p>
        </InfoCard>
      )}

      {quizStep === 1 && (
        <article className={css.disclaimers}>
          <h2 className={css.disclaimersTitle}>
            Disclaimers, Terms of Use and Privacy Policy
          </h2>

          <div className={css.buttonsContainer}>
            <Button className={css.link} color="textButton" to="/">
              Disclaimer
            </Button>
            <Button className={css.link} color="textButton" to="/">
              Terms of Use Agreement
            </Button>
            <Button className={css.link} color="textButton" to="/">
              Online Privacy Policy
            </Button>
          </div>

          <div className={css.questionContainer}>
            <p className={css.questionText}>
              Please read the above documents as these govern the use of our
              website. If you agree, please click yes to continue. By selecting
              &ldquo;Yes&ldquo;, you are attesting that you have read the
              documents and agree to the conditions therein
            </p>

            <div className={css.questionButtonContainer}>
              <Button
                isActive={!userData?.user.isAgreeLegalAgreements}
                onClick={() => handleUserAgreements(true)}
              >
                Yes
              </Button>
              <Button
                isActive={userData?.user.isAgreeLegalAgreements}
                onClick={() => handleUserAgreements(false)}
              >
                No
              </Button>
            </div>
          </div>
        </article>
      )}

      {quizStep === 2 && (
        <div className={css.nickNames}>
          <h2 className={css.nickNamesTitle}>
            What should we call you? (Nick names)
          </h2>
          <p className={css.nickNamesText}>
            Tell us your names. We only need both of your first names for now,
            it is just for us (not for the forms).
          </p>

          <Formik
            initialValues={initialNames}
            validationSchema={eligibilityApplicantNamesShema}
            validateOnBlur={false}
            onSubmit={handleNames}
          >
            {({ submitForm }) => (
              <div className={css.nickNamesInputs}>
                <InputField
                  errorClassname={css.inputNameError}
                  isRounded
                  name="immigrantName"
                  label="First name of the intending immigrant?"
                  onBlur={submitForm}
                />
                <InputField
                  isRounded
                  name="sponsorName"
                  label="First name of the sponsoring US Citizen Spouse?"
                  onBlur={submitForm}
                />
              </div>
            )}
          </Formik>
        </div>
      )}
      {quizStep >= 3 && quizStep <= 16 && (
        <div className={css.quizWrapper}>
          <h2 className={css.quizTitle}>
            <span>{quizTitle}</span>
          </h2>
          <BooleanQuestion
            currentUserAnswer={userAnswer}
            data={eligibilityQuiz?.data[quizStep - 3]}
            initialNames={initialNames}
            onClick={handleUserAnswer}
            list={visas}
          />
        </div>
      )}
      {quizStep === 17 && (
        <InfoCard icon={congratulationsSVG}>
          <h2>Great News. We can help.</h2>
          <p>
            Awesome! Looks like we can assist you with your application, you are
            now less than 90 minutes away from completing your application!
          </p>
        </InfoCard>
      )}

      {quizStep === 18 && (
        <div className={css.quizWrapper}>
          <h2 className={css.quizTitle}>
            <span>Question 6 of 15</span>
          </h2>
          <BooleanQuestion
            currentUserAnswer={advanceParole}
            data={eligibilityQuiz?.data[14]}
            initialNames={initialNames}
            onClick={handleUserAnswer}
            list={visas}
          />
        </div>
      )}
    </>
  );
};

export { EligibilityQuiz };
