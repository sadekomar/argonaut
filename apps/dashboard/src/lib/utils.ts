import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateEmptyMonths(
  startDate: string,
  endDate: string
): string[] {
  const months: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  const current = new Date(start);
  current.setDate(1); // Set to first day of month

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${month}-01`);

    // Move to next month
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}

export function mapToSelectOptions<T extends { id: string; name: string }>(
  items: T[] | undefined
): Array<{ value: string; label: string }> {
  return (
    items?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? []
  );
}
