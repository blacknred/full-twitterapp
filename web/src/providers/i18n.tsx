import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { IntlProvider } from "react-intl";

type II18nContext = {
  locale: string;
  setLocale: Dispatch<SetStateAction<string>>;
};

const I18nCtx = createContext<II18nContext | undefined>(undefined);

export const useI18n = () => useContext(I18nCtx) as II18nContext;

export const I18nProvider = (props: PropsWithChildren) => {
  const [locale, setLocale] = useState(navigator?.language || 'en-EN');
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    import(`../assets/langs/${locale}.json`).then(setMessages)
  }, [locale])

  return (
    <I18nCtx.Provider value={{ locale, setLocale }} >
      {messages && <IntlProvider messages={messages} locale={locale} {...props} />}
    </I18nCtx.Provider>
  );
}