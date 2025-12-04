"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import { QuoteForm } from "../_components/quote-form";

// ExchangeRate-API Successful Response Type
export type ExchangeRateSuccessResponse = {
  result: "success";
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  rates: {
    [currencyCode: string]: number;
  };
};

// ExchangeRate-API Error Response Type
export type ExchangeRateErrorResponse = {
  result: "error";
  "error-type": string;
};

// ExchangeRate-API General Response Type
export type ExchangeRateResponse =
  | ExchangeRateSuccessResponse
  | ExchangeRateErrorResponse;

// 0: ARGO-Q-2xxx-mm-yyyy
function generateQuoteReferenceNumber(
  serialNumber: number,
  date: Date | string
) {
  // Serial number should start with 2 and have three digits (e.g. 2001, 2002, ..., 2999)
  const padded = String(serialNumber).padStart(3, "0");
  const serial = `2${padded}`;
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `ARGO-Q-${serial}-${month}-${year}`;
}

async function getRate(code: string) {
  const response = await fetch("https://open.er-api.com/v6/latest/EGP").then(
    (res) => res.json() as Promise<ExchangeRateResponse>
  );
  if (response.result === "success") {
    return response.rates[code];
  }
  throw new Error(response["error-type"]);
}

export async function createQuote(data: QuoteForm) {
  const {
    value,
    date,
    currency,
    notes,
    authorId,
    clientId,
    projectId,
    contactPersonId,
    supplierId,
    approximateSiteDeliveryDate,
    objectKeys,
  } = data;

  const serialNumber = await prisma.quote.count();
  const referenceNumber = generateQuoteReferenceNumber(serialNumber, date);
  const rate = await getRate(currency);

  try {
    await prisma.quote.create({
      data: {
        referenceNumber: referenceNumber,
        value: Number(value),
        date: new Date(date),
        currency: currency,
        rate: rate,
        notes: notes,
        authorId: authorId,
        clientId: clientId,
        projectId: projectId,
        contactPersonId: contactPersonId,
        supplierId: supplierId,
        approximateSiteDeliveryDate: approximateSiteDeliveryDate
          ? new Date(approximateSiteDeliveryDate)
          : null,
        objectKeys: objectKeys,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          errors: {
            referenceNumber: [
              "Quote with this reference number already exists",
            ],
          },
        };
      }
    }
    throw e;
  }
}
