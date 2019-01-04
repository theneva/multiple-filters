import { Transaction, filterTransactions } from './index';

function intersection<T>(a: T[], b: T[]) {
  return a.filter(value => b.includes(value));
}

const tesco = 0;
const underground = 1;
const coop = 2;
const google = 3;
const taxi = 4;

const transactions: Transaction[] = [
  { description: 'Tesco', category: 'food', receipt: 'present', year: '2019' },
  {
    description: 'Underground',
    category: 'transport',
    receipt: 'present',
    year: '2019',
  },
  { description: 'Coop', category: 'food', receipt: 'missing', year: '2018' },
  {
    description: 'Google',
    category: 'internet',
    receipt: 'present',
    year: '2017',
  },
  {
    description: 'Taxi',
    category: 'transport',
    receipt: 'present',
    year: '2017',
  },
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

// by year
const y2017 = t(google, taxi);
const y2018 = t(coop);
const y2019 = t(tesco, underground);

const years = { all, 2017: y2017, 2018: y2018, 2019: y2019 };

function t(...indices: number[]): Transaction[] {
  return indices.map(i => transactions[i]);
}

test('no filters', () => {
  const filtered = filterTransactions(transactions, {
    receipt: 'all',
    category: 'all',
    year: 'all',
  });
  expect(filtered).toEqual({
    categories,
    receipts,
    years,
  });
});

test('only category filter', () => {
  const filtered = filterTransactions(transactions, {
    receipt: 'all',
    category: 'food',
    year: 'all',
  });

  expect(filtered).toEqual({
    categories,
    receipts: { all: food, present: t(tesco), missing: t(coop) },
    years: { all: food, '2018': t(coop), '2019': t(tesco) },
  });
});

test('only receipt filter', () => {
  const filtered = filterTransactions(transactions, {
    receipt: 'present',
    category: 'all',
    year: 'all',
  });

  expect(filtered).toEqual({
    categories: { all: present, food: t(tesco), transport, internet },
    receipts,
    years: { all: present, 2017: y2017, 2019: y2019 }, // nothing from 2018
  });
});

test('category and receipt filters', () => {
  const filtered = filterTransactions(transactions, {
    receipt: 'present',
    category: 'food',
    year: 'all',
  });

  expect(filtered).toEqual({
    categories: { all: present, food: t(tesco), transport, internet },
    receipts: { all: food, present: t(tesco), missing: t(coop) },
    years: { all: intersection(present, food), 2019: t(tesco) },
  });
});

test('only year filter', () => {
  const filtered = filterTransactions(transactions, {
    receipt: 'all',
    category: 'all',
    year: '2019',
  });

  expect(filtered).toEqual({
    categories: {
      all: y2019,
      food: t(tesco),
      transport: t(underground),
      internet: [],
    },
    receipts: {
      all: y2019,
      present: y2019,
      missing: [],
    },
    years,
  });
});

test('category and year filters', () => {
  const filtered = filterTransactions(transactions, {
    receipt: 'all',
    category: 'food',
    year: '2019',
  });

  expect(filtered).toEqual({
    categories: {
      all: y2019,
      food: t(tesco),
      transport: t(underground),
      internet: [],
    },
    receipts: {
      all: intersection(food, y2019),
      present: t(tesco),
      missing: [],
    },
    years: { all: food, '2018': t(coop), '2019': t(tesco) },
  });
});

test('receipt and year filters', () => {
  const filtered = filterTransactions(transactions, {
    receipt: 'present',
    category: 'all',
    year: '2019',
  });

  expect(filtered).toEqual({
    categories: {
      all: intersection(present, y2019),
      food: t(tesco),
      transport: t(underground),
      internet: [],
    },
    receipts: {
      all: y2019,
      present: t(tesco, underground),
      missing: [],
    },
    years: { all: present, 2017: y2017, 2019: y2019 },
  });
});

test('category, receipt, and year filters', () => {
  const filtered = filterTransactions(transactions, {
    receipt: 'present',
    category: 'food',
    year: '2019',
  });

  expect(filtered).toEqual({
    categories: {
      all: intersection(present, y2019),
      food: t(tesco),
      transport: t(underground),
      internet: [],
    },
    receipts: {
      all: intersection(food, y2019),
      present: t(tesco),
      missing: [],
    },
    years: {
      all: intersection(food, present),
      2019: intersection(intersection(food, present), y2019),
    },
  });
});
