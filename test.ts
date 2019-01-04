import { Transaction, Category } from './index';

const transactions: Transaction[] = [
  { description: 'Tesco', category: Category.Food, hasReceipt: true },
  {
    description: 'Underground',
    category: Category.Transport,
    hasReceipt: true,
  },
  { description: 'Coop', category: Category.Food, hasReceipt: false },
  {
    description: 'Google',
    category: Category.Internet,
    hasReceipt: true,
  },
  { description: 'Taxi', category: Category.Transport, hasReceipt: true },
];

test('blah', () => {
  console.log();
});

// test('no filters just yields the length', () => {
//   const count = countTransactions(transactions, {
//     hasReceipt: 'all',
//     category: 'all',
//   });
//   expect(count).toBe(transactions.length);
// });
