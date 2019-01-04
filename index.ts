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

function groupByCategory(transactions: Transaction[]) {
  const initialCategoryCounts: CategoryCounts = {
    all: transactions,
    internet: [],
    food: [],
    transport: [],
  };

  return transactions.reduce((acc, transaction) => {
    acc[transaction.category].push(transaction);
    return acc;
  }, initialCategoryCounts);
}

function groupByReceipt(transactions: Transaction[]) {
  const initialReceiptCounts: ReceiptCounts = {
    all: transactions,
    present: [],
    missing: [],
  };

  return transactions.reduce((acc, transaction) => {
    acc[transaction.receipt].push(transaction);
    return acc;
  }, initialReceiptCounts);
}

export function countTransactions(
  transactions: Transaction[],
  filters: Filters,
): FilterCounts {
  const allByCategory = groupByCategory(transactions);
  const allByReceipt = groupByReceipt(transactions);

  const categories = groupByCategory(allByReceipt[filters.receipt]);
  const receipts = groupByReceipt(allByCategory[filters.category]);

  return {
    categories,
    receipts,
  };
}
