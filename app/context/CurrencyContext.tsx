"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Currency = "JPY" | "USD";
export type Country = "JP" | "US";

interface CurrencyContextValue {
  currency: Currency;
  country: Country;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "JPY",
  country: "JP",
  setCurrency: () => {},
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function CurrencyProvider({
  children,
  initialCountry,
}: {
  children: ReactNode;
  initialCountry: Country;
}) {
  const [currency, setCurrencyState] = useState<Currency>(
    initialCountry === "US" ? "USD" : "JPY"
  );

  useEffect(() => {
    const saved = localStorage.getItem("cmmn_currency") as Currency | null;
    if (saved === "JPY" || saved === "USD") {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("cmmn_currency", c);
  };

  const country: Country = currency === "USD" ? "US" : "JP";

  return (
    <CurrencyContext.Provider value={{ currency, country, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
