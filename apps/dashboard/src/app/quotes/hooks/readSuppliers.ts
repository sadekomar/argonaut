import { CompanyType } from "@repo/db";
import { prisma } from "@repo/db";

export const readSuppliers = async () => {
  const suppliers = await prisma.company.findMany({
    where: {
      type: CompanyType.SUPPLIER,
    },
  });

  return suppliers;
};
