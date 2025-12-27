import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "ko";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({
  lang: "en",
  setLang: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    // Load saved language on mount
    AsyncStorage.getItem("appLanguage").then((savedLang) => {
      if (savedLang === "en" || savedLang === "ko") {
        setLang(savedLang);
      }
    });
  }, []);

  const updateLang = (newLang: Lang) => {
    setLang(newLang);
    AsyncStorage.setItem("appLanguage", newLang); // Save to storage
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: updateLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
