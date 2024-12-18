export interface FilterData {
  accountTypes: string[];
  customerTypes: string[];
  beneficiaryBanks: string[];
  regions: string[];
  areas: string[];
}

export interface TransactionData {
  accountType: string;
  customerType: string;
  beneficiaryBank: string;
  region: string;
  area: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  date: string;
}

export interface BankData {
  name: string;
  inflow: number;
  outflow: number;
  transactions: {
    accountTypes: Set<string>;
    customerTypes: Set<string>;
    regions: Set<string>;
    areas: Set<string>;
  };
}

export async function parseCSVData(): Promise<{
  filters: FilterData;
  banks: Map<string, BankData>;
  transactions: TransactionData[];
}> {
  const response = await fetch("/dummy_transactions.csv");
  const csvText = await response.text();
  const rows = csvText.split("\n").slice(1);

  // Initialize filters with Sets instead of arrays
  const filtersSet = {
    accountTypes: new Set<string>(),
    customerTypes: new Set<string>(),
    beneficiaryBanks: new Set<string>(),
    regions: new Set<string>(),
    areas: new Set<string>(),
  };

  const banks = new Map<string, BankData>();
  const transactions: TransactionData[] = [];

  rows.forEach((row) => {
    const [
      accountType,
      customerType,
      beneficiaryBank,
      region,
      area,
      amount,
      type,
      date,
    ] = row.split(",").map((val) => val.trim());

    if (!accountType || !beneficiaryBank) return;

    // Add to filters
    filtersSet.accountTypes.add(accountType);
    filtersSet.customerTypes.add(customerType);
    filtersSet.beneficiaryBanks.add(beneficiaryBank);
    if (region) filtersSet.regions.add(region);
    if (area) filtersSet.areas.add(area);

    const parsedAmount = parseFloat(amount);

    // Track bank-specific data
    if (!banks.has(beneficiaryBank)) {
      banks.set(beneficiaryBank, {
        name: beneficiaryBank,
        inflow: 0,
        outflow: 0,
        transactions: {
          accountTypes: new Set<string>(),
          customerTypes: new Set<string>(),
          regions: new Set<string>(),
          areas: new Set<string>(),
        },
      });
    }

    const bankData = banks.get(beneficiaryBank)!;
    if (type === "CREDIT") {
      bankData.inflow += parsedAmount;
    } else {
      bankData.outflow += parsedAmount;
    }

    // Store transaction
    transactions.push({
      accountType,
      customerType,
      beneficiaryBank,
      region,
      area,
      amount: parsedAmount,
      type: type as "CREDIT" | "DEBIT",
      date,
    });
  });

  return {
    filters: {
      accountTypes: Array.from(filtersSet.accountTypes).filter(Boolean),
      customerTypes: Array.from(filtersSet.customerTypes).filter(Boolean),
      beneficiaryBanks: Array.from(filtersSet.beneficiaryBanks).filter(Boolean),
      regions: Array.from(filtersSet.regions).filter(Boolean),
      areas: Array.from(filtersSet.areas).filter(Boolean),
    },
    banks,
    transactions,
  };
}
