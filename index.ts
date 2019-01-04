export enum Category {
  Internet,
  Transport,
  Food,
}

export type Transaction = {
  description: string;
  hasReceipt: boolean;
  category: Category;
};

export type Filters = {
  hasReceipt: boolean | null;
  category: 'all' | Category;
};

type CountsByCategory = Map<Category, number>;
type CountsByReceipt = Map<boolean, number>;

type FilterCounts = {
    categories: CountsByCategory;
    receipts:
}

export function countTransactions(
  transactions: Transaction[],
  filters: Filters,
): FilterCounts {
  return transactions.length;
}
