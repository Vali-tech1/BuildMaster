const currencyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function formatProjectCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatProjectDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export function calculateProjectProgress(progressPercent: number) {
  if (!Number.isFinite(progressPercent)) {
    return 0;
  }

  return Math.round(Math.min(100, Math.max(0, progressPercent)));
}

export function calculateRemainingBudget(totalBudget: number, expenses: number) {
  return totalBudget - expenses;
}
