"use server";

import { Prisma, prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import { QuoteForm } from "../_components/quote-form";
import { generateQuoteReferenceNumber, getRate } from "@/lib/utils";

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
    contactPersonPhone,
    contactPersonEmail,
    contactPersonTitle,
    rfqId,
  } = data;

  if (contactPersonPhone || contactPersonEmail || contactPersonTitle) {
    // update contact person fields if supplied
    await prisma.person.update({
      where: { id: contactPersonId },
      data: {
        phone: contactPersonPhone,
        email: contactPersonEmail,
        companyId: clientId,
        title: contactPersonTitle,
      },
    });
  }

  const serialNumber = await prisma.quote.count();
  const referenceNumber = generateQuoteReferenceNumber(serialNumber + 1, date);
  const rate = await getRate(currency);

  try {
    await prisma.quote.create({
      data: {
        ...(rfqId && {
          Rfq: {
            connect: {
              id: rfqId,
            },
          },
        }),
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
    console.log("error creating quote", e);
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
