const whenRecordsBegan = new Date('2018-09-25');

function setTime(date, h, m, s, n) {
  const d = new Date(date);
  d.setHours(h, m, s, n);
  return d;
}

function startOfDay(d) {
  return setTime(d, 0, 0, 0, 0);
}

function tomorrow(date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
}

module.exports = function handleRankingDateRange([from, to]) {
  const f = startOfDay(new Date(from || whenRecordsBegan));
  const t = startOfDay(tomorrow(new Date(to || new Date())));

  if (f > t) {
    throw new Error(
      `From date (${f.toISOString()}) is after the To date (${t.toISOString()})`
    );
  }

  return [f, t];
};
