export default function formatForRankingCard(item) {
  if (item.character) {
    return item;
  }

  const { total, wins, rank, ratio, score, ...character } = item;

  return {
    total,
    wins,
    rank,
    ratio,
    score,
    character
  };
}
