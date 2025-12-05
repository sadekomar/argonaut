"use server";

import { Currency, Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

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

export interface CreateRfqForm {
  value: string;
  date: string;
  currency: string;
  notes: string;
  authorId: string;
  clientId: string;
  projectId: string;
  supplierId: string;
}

export async function createRfq(data: CreateRfqForm) {
  const {
    value,
    date,
    currency,
    notes,
    authorId,
    clientId,
    projectId,
    supplierId,
  } = data;

  // ARGO-RFQ-1xxx-mm-yyyy
  function generateRfqReferenceNumber(
    serialNumber: number,
    date: Date | string
  ) {
    // Serial number should start with 1 and have three digits (e.g. 1001, 1002, ..., 1999)
    const padded = String(serialNumber).padStart(3, "0");
    const serial = `1${padded}`;
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `ARGO-RFQ-${serial}-${month}-${year}`;
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

  const serialNumber = await prisma.rfq.count();
  const referenceNumber = generateRfqReferenceNumber(serialNumber, date);
  const rate = await getRate(currency);

  try {
    await prisma.rfq.create({
      data: {
        referenceNumber: referenceNumber,
        value: Number(value),
        date: new Date(date),
        currency: currency as Currency,
        rate: rate,
        notes: notes,
        authorId: authorId,
        clientId: clientId,
        projectId: projectId,
        supplierId: supplierId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors here
      if (e.code === "P2002") {
        return { errors: { jobId: ["RFQ for this job already exists"] } };
      }
    }
    throw e;
  }
}
