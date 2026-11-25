// Tradução automática pela língua do navegador (i18next + react-i18next)
//
// Línguas (qualquer variante regional cai na língua base: pt-BR -> pt, zh-TW -> zh...):
//   pt  Português     en  English      es  Español
//   zh  中文 (简体)    ko  한국어        ja  日本語
//   ru  Русский       tr  Türkçe
// Qualquer outra língua -> inglês.
//
// Para testar outra língua sem mudar o navegador: adicione ?lang=ko (ou zh, ja, ru, tr...) na URL.
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import es from './locales/es'
import ja from './locales/ja'
import ko from './locales/ko'
import pt from './locales/pt'
import ru from './locales/ru'
import tr from './locales/tr'
import zh from './locales/zh'

export const LINGUAS = ['pt', 'en', 'es', 'zh', 'ko', 'ja', 'ru', 'tr'] as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      es: { translation: es },
      zh: { translation: zh },
      ko: { translation: ko },
      ja: { translation: ja },
      ru: { translation: ru },
      tr: { translation: tr },
    },
    supportedLngs: LINGUAS,
    nonExplicitSupportedLngs: true, // pt-BR -> pt, zh-CN -> zh...
    load: 'languageOnly',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }, // o React já protege contra HTML injetado
    detection: {
      order: ['querystring', 'navigator'],
      lookupQuerystring: 'lang',
      caches: [], // sempre segue o navegador; não guarda escolha
    },
  })

// Mantém <html lang="..."> e o título da aba na língua certa
function aplicarLingua() {
  document.documentElement.lang = i18n.resolvedLanguage ?? 'en'
  document.title = i18n.t('titulo')
}
i18n.on('languageChanged', aplicarLingua)
aplicarLingua()

export default i18n
