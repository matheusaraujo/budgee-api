import { Transaction } from './transaction.type';

export function parse(input: string): Transaction {
  const words = input.split(' ');

  return {
    category: getCategory(words),
    date: getDate(words),
    amount: getAmount(words),
    description: getDescription(words),
  };
}

function getCategory(words: string[]): string | undefined {
  const category = words.filter((w) => w.startsWith('#'));
  if (category?.length === 1) return category[0].substring(1);
  return undefined;
}

function getDate(words: string[]): Date | undefined {
  const date = words.filter((w) => w.startsWith('@'));
  if (date?.length === 1) return new Date(date[0].substring(1));
  return undefined;
}

function getAmount(words: string[]): number | undefined {
  const amount = words.filter((w) => !isNaN(parseFloat(w)));
  if (amount?.length === 1) return parseFloat(amount[0]);
  return undefined;
}

function getDescription(words: string[]): string | undefined {
  const description = words.filter(
    (w) => !w.startsWith('#') && !w.startsWith('@') && isNaN(parseFloat(w)),
  );

  if (description.length === 0) return undefined;

  return description.join(' ');
}
