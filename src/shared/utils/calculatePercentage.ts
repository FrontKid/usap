function calculatePercentage(
  totalAnswers: number,
  answersFor100Percent: number,
) {
  let percent = (totalAnswers / answersFor100Percent) * 100;

  percent = Math.round(Math.max(0, Math.min(100, percent)));

  return percent;
}

export { calculatePercentage };
