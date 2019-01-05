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
type YearFilter = 'all' | Year;

export type Filters = {
  category: CategoryFilter;
  receipt: ReceiptFilter;
  year: YearFilter;
};

type CategoryCounts = { [key in CategoryFilter]: Array<Transaction> };
type ReceiptCounts = { [key in ReceiptFilter]: Array<Transaction> };
type YearCounts = { [key: string]: Array<Transaction> }; // Can't use Year here; TS says no

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

type FilterName = keyof Filters;
type FilterFunctions = {
  [name in FilterName]: (transactions: Transaction[]) => Transaction[]
};

function filterFunctions(filters: Filters): FilterFunctions {
  return {
    category: transactions => groupByCategory(transactions)[filters.category],
    receipt: transactions => groupByReceipt(transactions)[filters.receipt],
    year: transactions => groupByYear(transactions)[filters.year],
  };
}

export function filterTransactions(
  transactions: Transaction[],
  filters: Filters,
): FilterCounts {
  function applyFiltersExcept(except: keyof Filters) {
    const filtersWithoutException = {
      ...filterFunctions(filters),
    };
    delete filtersWithoutException[except];

    const otherFilters = Object.values(filtersWithoutException);

    return otherFilters.reduce((filtered, filter) => filter(filtered), [
      ...transactions,
    ]);
  }

  const categories = groupByCategory(applyFiltersExcept('category'));
  const receipts = groupByReceipt(applyFiltersExcept('receipt'));
  const years = groupByYear(applyFiltersExcept('year'));

  return {
    categories,
    receipts,
    years,
  };
}
