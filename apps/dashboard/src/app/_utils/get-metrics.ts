"use server";

import { prisma } from "@repo/db";
import { QuoteOutcome, RegistrationStatus, CompanyType } from "@repo/db";

export interface DashboardMetrics {
  quotations: {
    totalValue: number;
    won: number;
    lost: number;
    pending: number;
    pendingValue: number;
    wonValue: number;
    lostValue: number;
  };
  projects: {
    total: number;
  };
  companies: {
    total: number;
  };
  registrations: {
    total: number;
    consultant: number;
    underReview: number;
    verified: number;
    onHold: number;
    pursuing: number;
  };
  rfqs: {
    total: number;
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // Execute all independent database queries in parallel for maximum performance
  const [
    quotes,
    wonQuotations,
    lostQuotations,
    pendingQuotations,
    totalProjects,
    totalCompanies,
    totalRfqs,
    totalRegistrations,
    consultantRegistrations,
    underReviewRegistrations,
    verifiedRegistrations,
    onHoldRegistrations,
    pursuingRegistrations,
  ] = await Promise.all([
    // Quotes data for value calculations
    prisma.quote.findMany({
      select: {
        value: true,
        rate: true,
        quoteOutcome: true,
      },
    }),
    // Quote counts by outcome
    prisma.quote.count({
      where: { quoteOutcome: QuoteOutcome.WON },
    }),
    prisma.quote.count({
      where: { quoteOutcome: QuoteOutcome.LOST },
    }),
    prisma.quote.count({
      where: { quoteOutcome: QuoteOutcome.PENDING },
    }),
    // Projects, companies, and RFQs counts
    prisma.project.count(),
    prisma.company.count(),
    prisma.rfq.count(),
    // Registration counts
    prisma.registration.count(),
    prisma.registration.count({
      where: {
        company: {
          type: CompanyType.CONSULTANT,
        },
      },
    }),
    prisma.registration.count({
      where: { registrationStatus: RegistrationStatus.UNDER_REVIEW },
    }),
    prisma.registration.count({
      where: { registrationStatus: RegistrationStatus.VERIFIED },
    }),
    prisma.registration.count({
      where: { registrationStatus: RegistrationStatus.ON_HOLD },
    }),
    prisma.registration.count({
      where: { registrationStatus: RegistrationStatus.PURSUING },
    }),
  ]);

  // Calculate quotation values from fetched quotes (single pass through data)
  let totalQuotationsValue = 0;
  let wonValue = 0;
  let lostValue = 0;
  let pendingValue = 0;

  for (const quote of quotes) {
    const convertedValue = quote.value / quote.rate;
    totalQuotationsValue += convertedValue;

    if (quote.quoteOutcome === QuoteOutcome.WON) {
      wonValue += convertedValue;
    } else if (quote.quoteOutcome === QuoteOutcome.LOST) {
      lostValue += convertedValue;
    } else if (quote.quoteOutcome === QuoteOutcome.PENDING) {
      pendingValue += convertedValue;
    }
  }

  return {
    quotations: {
      totalValue: totalQuotationsValue,
      won: wonQuotations,
      lost: lostQuotations,
      pending: pendingQuotations,
      pendingValue: pendingValue,
      wonValue: wonValue,
      lostValue: lostValue,
    },
    projects: {
      total: totalProjects,
    },
    companies: {
      total: totalCompanies,
    },
    registrations: {
      total: totalRegistrations,
      consultant: consultantRegistrations,
      underReview: underReviewRegistrations,
      verified: verifiedRegistrations,
      onHold: onHoldRegistrations,
      pursuing: pursuingRegistrations,
    },
    rfqs: {
      total: totalRfqs,
    },
  };
}
