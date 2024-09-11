const getValueForInput = (answers: string[], fieldType: string) => {
  if (Array.isArray(answers)) {
    return (
      answers
        .find(el => el.split(':')[0] === fieldType)
        ?.split(':')[1]
        ?.trim() ?? ''
    );
  }

  return '';
};

export { getValueForInput };
