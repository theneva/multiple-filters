import { Transaction, countTransactions } from './index';

const tesco = 0;
const underground = 1;
const coop = 2;
const google = 3;
const taxi = 4;

const transactions: Transaction[] = [
  { description: 'Tesco', category: 'food', receipt: 'present' },
  { description: 'Underground', category: 'transport', receipt: 'present' },
  { description: 'Coop', category: 'food', receipt: 'missing' },
  { description: 'Google', category: 'internet', receipt: 'present' },
  { description: 'Taxi', category: 'transport', receipt: 'present' },
];

const all = transactions;

// by category
const food = t(tesco, coop);
const transport = t(underground, taxi);
const internet = t(google);

const categories = { all, food, transport, internet };

// by receipt
const present = t(tesco, underground, google, taxi);
const missing = t(coop);

const receipts = { all, present, missing };

function t(...indices: number[]): Transaction[] {
  return indices.map(i => transactions[i]);
}

test('no filters just yields the length', () => {
  const counts = countTransactions(transactions, {
    receipt: 'all',
    category: 'all',
  });
  expect(counts).toEqual({
    categories: { all, food, transport, internet },
    receipts: { all, present, missing },
  });
});

test('only category filter', () => {
  const counts = countTransactions(transactions, {
    receipt: 'all',
    category: 'food',
  });

  expect(counts).toEqual({
    categories,
    receipts: { all: t(tesco, coop), present: t(tesco), missing: t(coop) },
  });
});

test('only receipt filter', () => {
  const counts = countTransactions(transactions, {
    receipt: 'present',
    category: 'all',
  });

  expect(counts).toEqual({
    categories: { all: present, food: t(tesco), transport, internet },
    receipts,
  });
});

test('category and receipt filters', () => {
  const counts = countTransactions(transactions, {
    receipt: 'present',
    category: 'food',
  });

  expect(counts).toEqual({
    categories: { all: present, food: t(tesco), transport, internet },
    receipts: { all: food, present: t(tesco), missing: t(coop) },
  });
});
