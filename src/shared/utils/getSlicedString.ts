const getSlicedString = (string: string, to: number = 29) => {
  let slicedString = string;

  if (slicedString.length > to) {
    slicedString = `${string.slice(0, to)}...`;
  }

  return slicedString;
};

export { getSlicedString };
