"use server";

import { prisma } from "@repo/db";
import { QuoteOutcome, RegistrationStatus, CompanyType } from "@repo/db";

export interface DashboardMetrics {
  quotations: {
    totalValue: number;
    won: number;
    lost: number;
    pending: number;
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
  // Get all quotes with their values and rates for calculating total value
  const quotes = await prisma.quote.findMany({
    select: {
      value: true,
      rate: true,
    },
  });

  // Calculate total quotations value (sum of value * rate for all quotes)
  const totalQuotationsValue = quotes.reduce((sum, quote) => {
    return sum + quote.value * quote.rate;
  }, 0);

  // Count quotes by outcome using Prisma count for better performance
  const [wonQuotations, lostQuotations, pendingQuotations] = await Promise.all([
    prisma.quote.count({
      where: { quoteOutcome: QuoteOutcome.WON },
    }),
    prisma.quote.count({
      where: { quoteOutcome: QuoteOutcome.LOST },
    }),
    prisma.quote.count({
      where: { quoteOutcome: QuoteOutcome.PENDING },
    }),
  ]);

  // Get total projects and companies counts in parallel
  const [totalProjects, totalCompanies, totalRfqs] = await Promise.all([
    prisma.project.count(),
    prisma.company.count(),
    prisma.rfq.count(),
  ]);

  // Get all metrics in parallel for better performance
  const [
    totalRegistrations,
    consultantRegistrations,
    underReviewRegistrations,
    verifiedRegistrations,
    onHoldRegistrations,
    pursuingRegistrations,
  ] = await Promise.all([
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

  return {
    quotations: {
      totalValue: totalQuotationsValue,
      won: wonQuotations,
      lost: lostQuotations,
      pending: pendingQuotations,
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
