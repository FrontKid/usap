/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
// import admin from 'firebase-admin';
import { ECollectionNames, EQuestionsTypeId } from '../types';
import { db } from '.';

interface IQuestions {
  id: string;
  link: string | null;
  answerType: string;
  correctAnswer: string | null;
  question: string;
  answer: boolean | string[];
  totalFields: number;
  isRequired: boolean;
}

export const getQuiz = async (
  collectionName: ECollectionNames,
  questionGroup: EQuestionsTypeId,
) => {
  try {
    const snapShot = await getDocs(collection(db, collectionName));

    const quizData = snapShot.docs
      .map(el => el.data())
      .filter(el => el.questionsTypeId === questionGroup)
      .sort((quizCurrent, quizNext) => +quizCurrent.id - +quizNext.id);

    return quizData;
  } catch (error) {
    return error;
  }
};

export const updateUserInfo = async (
  userId: string,
  data: any,
  setUserLocal: any,
) => {
  const userDocRef = doc(db, ECollectionNames.USERS, userId);

  try {
    await updateDoc(userDocRef, data);

    setUserLocal((state: TUser) => {
      if (!state) {
        return null;
      }

      return {
        ...state,
        user: {
          ...state.user,
          ...data,
        },
      };
    });
  } catch (error) {
    // console.log(error);
  }
};

export const updateUserAgreements = async (
  userID: string,
  data: any,
  setUserLocal: any,
) => {
  try {
    const userDocRef = doc(db, ECollectionNames.USERS, userID);

    await updateDoc(userDocRef, data);

    setUserLocal((state: TUser) => {
      if (!state) {
        return null;
      }

      return {
        ...state,
        user: {
          ...state.user,
          isAgreeLegalAgreements: data.isAgreeLegalAgreements,
        },
      };
    });
  } catch (error) {
    // console.log(error)
  }
};

export const updateUserBasicInfo = async (
  userID: string,
  data: any,
  setUserLocal: any,
) => {
  try {
    const userDocRef = doc(db, ECollectionNames.USERS, userID);

    await updateDoc(userDocRef, data);

    setUserLocal((state: TUser) => {
      if (!state) {
        return null;
      }

      return {
        ...state,
        user: {
          ...state.user,
          isEligibilityTestCompleted: true,
        },
      };
    });
  } catch (error) {
    // console.log(error);
  }
};

export const updateUserEmailVarify = async (
  userID: string,
  data: any,
  setUserLocal: any,
) => {
  try {
    const userDocRef = doc(db, ECollectionNames.USERS, userID);

    await updateDoc(userDocRef, data);

    setUserLocal((state: TUser) => {
      if (!state) {
        return null;
      }

      return {
        ...state,
        user: {
          ...state.user,
          isEmailVerified: true,
        },
      };
    });
  } catch (error) {
    // console.log(error);
  }
};

export const getUserInfo = async (
  userID: string,
): Promise<DocumentData | null> => {
  try {
    const userDocRef = doc(db, ECollectionNames.USERS, userID);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      return userData;
    }

    return null;
  } catch (error) {
    // console.error('Error getting user data:', error);

    return null;
  }
};

export const getAllUsersInfo = async (): Promise<DocumentData[]> => {
  try {
    const usersCollectionRef = collection(db, ECollectionNames.USERS);
    const usersSnapshot = await getDocs(usersCollectionRef);

    const usersData = usersSnapshot.docs.map(docEnt => ({
      id: docEnt.id,
      ...docEnt.data(),
    }));

    return usersData;
  } catch (error) {
    // console.error('Error getting users data:', error);
    return [];
  }
};

export const getVisas = async () => {
  try {
    const { docs } = await getDocs(collection(db, ECollectionNames.QUIZZES));
    const data: { [key: string]: any } = {};

    docs.forEach(docEl => {
      data[docEl.id] = docEl.data();
    });

    return data.visas.visas;
  } catch (error) {
    return error;
  }
};

export const getCountry = async () => {
  try {
    const { docs } = await getDocs(collection(db, ECollectionNames.QUIZZES));
    const data: { [key: string]: any } = {};

    docs.forEach(docEl => {
      data[docEl.id] = docEl.data();
    });

    return data.cities.cities;
  } catch (error) {
    return error;
  }
};

export const getStates = async () => {
  try {
    const { docs } = await getDocs(collection(db, ECollectionNames.QUIZZES));
    const data: { [key: string]: any } = {};

    docs.forEach(docEl => {
      data[docEl.id] = docEl.data();
    });

    return data.states.states;
  } catch (error) {
    return error;
  }
};

export const getUserAnswers = async (answerType: string, userId: string) => {
  try {
    const q = query(
      collection(db, ECollectionNames.ANSWERS),
      where('userId', '==', userId),
      where('questionsTypeId', '==', answerType),
    );

    const snapShot = await getDocs(q);

    const data = snapShot.docs.map(el => el.data());

    const objData = data.reduce((acc, el) => {
      acc[el.id] = { ...el };

      return acc;
    }, {});

    return objData;

    // return data.sort(
    //   (answerCur, answerNext) => answerCur.questionId - answerNext.questionId,
    // );
  } catch (error) {
    // console.log(error);
    return [];
  }
};

export const getAllUserAnswers = async (userId: string) => {
  try {
    const q = query(
      collection(db, ECollectionNames.ANSWERS),
      where('userId', '==', userId),
    );

    const snapShot = await getDocs(q);

    const data = snapShot.docs.map(el => el.data());

    const objData = data.reduce((acc, el) => {
      acc[el.id] = { ...el };

      return acc;
    }, {});

    return objData;

    // return data.sort(
    //   (answerCur, answerNext) => answerCur.questionId - answerNext.questionId,
    // );
  } catch (error) {
    // console.log(error);
    return [];
  }
};

export const uptdateUserAnswers = async (answerId: string, data: any) => {
  try {
    const answerDocRef = doc(db, ECollectionNames.ANSWERS, answerId);

    await updateDoc(answerDocRef, data);
  } catch (error) {
    // console.log(error)
  }
};

export const updateUserAdminStatus = async (
  userID: string,
  isAdmin: boolean,
): Promise<void> => {
  try {
    const userDocRef = doc(db, ECollectionNames.USERS, userID);

    await updateDoc(userDocRef, {
      isAdmin,
    });
  } catch (error) {
    // console.error('Error updating user admin status:', error);
  }
};

export const deleteUserAnswer = async (userId: string, answerId: string) => {
  try {
    const docRef = doc(db, ECollectionNames.ANSWERS, answerId);

    // Проверка на принадлежность документа пользователю
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists() && docSnapshot.data().userId === userId) {
      await deleteDoc(docRef);
    }
  } catch (error) {
    // console.error('Error deleting answer: ', error);
  }
};

export const deleteUserDataAndAuth = async (userId: string) => {
  try {
    const answersQuery = query(
      collection(db, ECollectionNames.ANSWERS),
      where('userId', '==', userId),
    );

    const answersSnapshot = await getDocs(answersQuery);

    answersSnapshot.forEach(async doc2 => {
      await deleteDoc(doc2.ref);
    });

    const userDocRef = doc(db, ECollectionNames.USERS, userId);

    await deleteDoc(userDocRef);
  } catch (error) {
    // console.error('Error deleting user and data:', error);
  }
};

export const deleteMultipleUserAnswers = async (
  userId: string,
  answerIds: string[],
) => {
  try {
    const deletionPromises = answerIds.map(async answerId => {
      const batch = writeBatch(db);
      const docRef = doc(db, ECollectionNames.ANSWERS, answerId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists() && docSnapshot.data().userId === userId) {
        batch.delete(docRef);
      }

      await batch.commit();
    });

    await Promise.all(deletionPromises);
  } catch (error) {
    // console.error('Error deleting answers: ', error);
  }
};

export type { IQuestions };
