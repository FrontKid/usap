const getSlicedChildCount = (text: string, childCount: number) => {
  const splitedText = text?.split(' ');

  if (!splitedText) {
    return '';
  }

  return `${splitedText[0]} ${childCount + 1} ${splitedText[1]}`;
};

export { getSlicedChildCount };
