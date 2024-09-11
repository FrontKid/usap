import { useLocalStorage } from '@uidotdev/usehooks';

const useAuth = () => {
  const [userData] = useLocalStorage<TUser>('user');

  return {
    isAuth: !!userData?.user.email,
    email: userData?.user.email ?? null,
    token: userData?.user.token ?? null,
    id: userData?.user.id ?? null,
    isAdmin: userData?.user.isAdmin ?? null,
  };
};

export { useAuth };
