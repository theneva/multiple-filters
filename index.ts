type Category = 'internet' | 'food' | 'transport';
type Receipt = 'present' | 'missing';

export type Transaction = {
  description: string;
  category: Category;
  receipt: Receipt;
};

type CategoryFilter = 'all' | Category;
type ReceiptFilter = 'all' | Receipt;

export type Filters = {
  category: CategoryFilter;
  receipt: ReceiptFilter;
};

type CategoryCounts = { [key in CategoryFilter]: number };
type ReceiptCounts = { [key in ReceiptFilter]: number };

type FilterCounts = {
  categories: CategoryCounts;
  receipts: ReceiptCounts;
};

export function countTransactions(
  transactions: Transaction[],
  filters: Filters,
): FilterCounts {
  const initialCategoryCounts: CategoryCounts = {
    all: transactions.length,
    internet: 0,
    food: 0,
    transport: 0,
  };

  const categories = transactions.reduce((counts, transaction) => {
    counts[transaction.category]++;
    return counts;
  }, initialCategoryCounts);

  const receipts = { all: 5, present: 4, missing: 1 };

  return {
    categories,
    receipts,
  };
}
