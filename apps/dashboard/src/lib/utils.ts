import { ExchangeRateResponse } from "@/app/quotes/_utils/create-quote";
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
export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
export const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// 0: ARGO-Q-2xxx-mm-yyyy
// 1: ALU-Q-2xxx-mm-yyyy
export function generateQuoteReferenceNumber(
  serialNumber: number,
  date: Date | string
) {
  // const latestQuoteSerialNumber = await prisma.quote.findFirst({
  //   orderBy: {
  //     serialNumber: "desc",
  //   },
  // select: {2
  //     serialNumber: true,
  //   },
  // });

  // Serial number should start with 2 and have three digits (e.g. 2001, 2002, ..., 2999)
  const padded = String(serialNumber).padStart(3, "0");
  const serial = `2${padded}`;
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `ARGO-Q-${serial}-${month}-${year}`;
}
export async function getRate(code: string) {
  const response = await fetch("https://open.er-api.com/v6/latest/EGP").then(
    (res) => res.json() as Promise<ExchangeRateResponse>
  );
  if (response.result === "success") {
    return response.rates[code];
  }
  throw new Error(response["error-type"]);
}
