import { filter } from 'rsvp';

type Category = 'internet' | 'food' | 'transport';
type Receipt = 'present' | 'missing';
type Year = string;

export type Transaction = {
  description: string;
  category: Category;
  receipt: Receipt;
  year: Year;
};

type CategoryFilter = 'all' | Category;
type ReceiptFilter = 'all' | Receipt;
type YearFilter = null | Year;

export type Filters = {
  category: CategoryFilter;
  receipt: ReceiptFilter;
  year: YearFilter;
};

type CategoryCounts = { [key in CategoryFilter]: Array<Transaction> };
type ReceiptCounts = { [key in ReceiptFilter]: Array<Transaction> };
type YearCounts = { [key: string]: Array<Transaction> }; // Cant use Year here; TS says no

type FilterCounts = {
  categories: CategoryCounts;
  receipts: ReceiptCounts;
  years: YearCounts;
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

function groupByYear(transactions: Transaction[]) {
  const initialYearCounts: YearCounts = {
    all: transactions,
  };

  return transactions.reduce((acc, transaction) => {
    const { year } = transaction;

    if (acc[year] == null) {
      acc[year] = [transaction];
    } else {
      acc[year].push(transaction);
    }

    return acc;
  }, initialYearCounts);
}

export function filterTransactions(
  transactions: Transaction[],
  filters: Filters,
): FilterCounts {
  const allByCategory = groupByCategory(transactions);
  const allByReceipt = groupByReceipt(transactions);

  const categories = groupByCategory(
    groupByYear(allByReceipt[filters.receipt])[filters.year],
  );

  const receipts = groupByReceipt(
    groupByYear(allByCategory[filters.category])[filters.year],
  );

  const years = groupByYear(
    groupByCategory(allByReceipt[filters.receipt])[filters.category],
  );

  return {
    categories,
    receipts,
    years,
  };
}
