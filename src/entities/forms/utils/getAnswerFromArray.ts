const getAnswerFromArray = (answer: string | string[], key: string = '') => {
  if (!Array.isArray(answer)) {
    return answer ?? '';
  }

  const answerObject = answer.reduce((acc: Record<string, string>, el) => {
    const [elKey, elValue] = el.split(':');

    return {
      ...acc,
      [elKey.trim()]: elValue.trim(),
    };
  }, {});

  return answerObject[key] ?? '';
};

export { getAnswerFromArray };
