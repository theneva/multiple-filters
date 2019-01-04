import { Transaction, countTransactions } from './index';

const transactions: Transaction[] = [
  { description: 'Tesco', category: 'food', receipt: 'present' },
  { description: 'Underground', category: 'transport', receipt: 'present' },
  { description: 'Coop', category: 'food', receipt: 'missing' },
  { description: 'Google', category: 'internet', receipt: 'present' },
  { description: 'Taxi', category: 'transport', receipt: 'present' },
];

test('no filters just yields the length', () => {
  const counts = countTransactions(transactions, {
    receipt: 'all',
    category: 'all',
  });
  expect(counts).toEqual({
    categories: {
      all: 5,
      food: 2,
      transport: 2,
      internet: 1,
    },
    receipts: {
      all: 5,
      present: 4,
      missing: 1,
    },
  });
});
