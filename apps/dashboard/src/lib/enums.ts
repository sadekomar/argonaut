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
