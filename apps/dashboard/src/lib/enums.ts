const CompanyType = {
  SUPPLIER: "SUPPLIER",
  CLIENT: "CLIENT",
  CONTRACTOR: "CONTRACTOR",
  CONSULTANT: "CONSULTANT",
} as const;

const PersonType = {
  AUTHOR: "AUTHOR",
  CONTACT_PERSON: "CONTACT_PERSON",
  INTERNAL: "INTERNAL",
} as const;

export { PersonType, CompanyType };

export enum Currency {
  EGP = "EGP",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  SAR = "SAR",
  AED = "AED",
}
