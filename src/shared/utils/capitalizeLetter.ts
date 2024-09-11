export const capitalizeLetter = (str: string) => {
  if (!str) {
    return '';
  }

  if (str.length === 0) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};
