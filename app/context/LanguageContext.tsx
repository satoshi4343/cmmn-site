"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Language = "ja" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  hasSelected: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [hasSelected, setHasSelected] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cmmn_language");
    if (saved === "ja" || saved === "en") {
      setLanguageState(saved);
      setHasSelected(true);
    } else {
      const browserLang = navigator.language.startsWith("ja") ? "ja" : "en";
      setLanguageState(browserLang);
      setHasSelected(false);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setHasSelected(true);
    localStorage.setItem("cmmn_language", lang);
  };

  if (!mounted) return <>{children}</>;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, hasSelected }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
