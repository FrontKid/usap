interface IReplaceOn {
  immigrantName: string;
  sponsorName: string;
}

const getReplacedName = (str: string, replaceOn: IReplaceOn) => {
  if (!str) {
    return '';
  }

  const { immigrantName, sponsorName } = replaceOn;

  const immigrantNameRegex = /\bimmigrantName\b|\bimmigrantName's\b/g;
  const sponsorNameRegex = /\bsponsoringName\b|\bsponsoringName's\b/g;

  let replacedStr = str.replace(immigrantNameRegex, match => {
    if (match === 'immigrantName') {
      return immigrantName;
    }

    if (match === "immigrantName's") {
      return `${immigrantName}'s`;
    }

    return match;
  });

  replacedStr = replacedStr.replace(sponsorNameRegex, match => {
    if (match === 'sponsoringName') {
      return sponsorName;
    }

    if (match === "sponsoringName's") {
      return `${sponsorName}'s`;
    }

    return match;
  });

  return replacedStr;
};

export { getReplacedName };
