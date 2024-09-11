/* eslint-disable max-len */
const isEmailValid = (email: string) => {
  // prettier-ignore
  const re
    = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  return re.test(String(email)?.toLowerCase());
};

export { isEmailValid };
