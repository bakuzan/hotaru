module.exports = function canContinueGauntlet(
  maxVersusCount,
  characterVersusCount
) {
  return maxVersusCount - characterVersusCount > 1;
};
