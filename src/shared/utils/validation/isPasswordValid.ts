const isPasswordValid = (password: string): boolean => {
  const beginWithoutDigit = /^\D.*$/;
  const withoutSpecialChars = /^[^-() /]*$/;
  const containsLetters = /^.*[a-zA-Z]+.*$/;
  const minimum8Chars = /^.{8,}$/;

  return (
    // prettier-ignore
    beginWithoutDigit.test(password)
    && withoutSpecialChars.test(password)
    && containsLetters.test(password)
    && minimum8Chars.test(password)
  );
};

export { isPasswordValid };
