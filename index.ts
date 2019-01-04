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

type CategoryCounts = { [key in CategoryFilter]: Array<Transaction> };
type ReceiptCounts = { [key in ReceiptFilter]: Array<Transaction> };

type FilterCounts = {
  categories: CategoryCounts;
  receipts: ReceiptCounts;
};

export function countTransactions(
  transactions: Transaction[],
  filters: Filters,
): FilterCounts {
  const initialCategoryCounts: CategoryCounts = {
    all: transactions,
    internet: [],
    food: [],
    transport: [],
  };

  const categories = transactions.reduce((acc, transaction) => {
    acc[transaction.category].push(transaction);
    return acc;
  }, initialCategoryCounts);

  const initialReceiptCounts: ReceiptCounts = {
    all: transactions,
    present: [],
    missing: [],
  };

  const filteredByCategory = categories[filters.category];
  const receipts = filteredByCategory.reduce((acc, transaction) => {
    acc[transaction.receipt].push(transaction);
    return acc;
  }, initialReceiptCounts);

  return {
    categories,
    receipts,
  };
}
