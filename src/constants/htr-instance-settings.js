export const Limit = Object.freeze({
  List: [3, 5, 10],
  Bracket: [8, 16, 32, 64]
});

export const Order = Object.freeze([
  { id: 1, name: 'None' },
  { id: 2, name: 'Name' },
  { id: 3, name: 'Rank' },
  { id: 4, name: 'Custom' }
]);
export const Orders = Object.freeze(
  Order.reduce(
    (o, k) => ({ ...o, [k.name.replace(/ /g, '').toLowerCase()]: k.id }),
    {}
  )
);
