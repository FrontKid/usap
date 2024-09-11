declare global {
  declare type RootState = import('../src/app/appStore').RootState;
  declare type AppDispatch = import('../src/app/appStore').AppDispatch;

  interface UserTestsCompletedInfo {
    basicPersonalInfo: number;
    familyNMarriage: number;
    immigrationNTravel: number;
    employment: number;
    financials: number;
    disclaimer: number;
    miscellaneous: number;
  }

  interface IUserError {
    code: string;
    message: string;
  }

  interface User {
    id: string | null;
    email: string | null;
    firstName: string;
    isEmailVerified: boolean;
    secondName: string;
    avatarURL: string;
    isAgreeLegalAgreements: boolean;
    isEligibilityTestCompleted: boolean;
    testsCompletedInfo: UserTestsCompletedInfo;
    token: string | null;
    isAdmin: boolean;
  }

  interface NewUserData {
    user: User;
    error: UserError;
  }

  declare type TUser = {
    user: User;
    error: IUserError;

    authProviderId?: string | null;
  } | null;

  declare type TButtonEvent =
    | React.MouseEvent<HTMLButtonElement>
    | React.MouseEvent<HTMLAnchorElement, MouseEvent>;
}

export {};
