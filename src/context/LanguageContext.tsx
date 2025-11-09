import React, { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'sv' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('sv')

  const t = (key: string): string => {
    const translations = getTranslations()
    return translations[language][key as keyof typeof translations.sv] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Translations object
const getTranslations = () => ({
  sv: {
    // Navigation
    'nav.home': 'Hem',
    'nav.services': 'Tjänster',
    'nav.about': 'Om mig',
    'nav.contact': 'Kontakt',
    
    // Home page
    'home.hero.title': 'IT-konsult med passion för innovation',
    'home.hero.subtitle': 'Jag hjälper företag att bygga moderna, skalbara och effektiva IT-lösningar',
    'home.hero.cta': 'Boka ett samtal',
    'home.hero.cta2': 'Se mina tjänster',
    'home.features.title': 'Varför välja mig?',
    'home.features.experience.title': 'Bred erfarenhet',
    'home.features.experience.desc': 'Många års erfarenhet av komplexa IT-projekt och moderna teknologier',
    'home.features.quality.title': 'Hög kvalitet',
    'home.features.quality.desc': 'Fokus på ren kod, bästa praxis och långsiktiga lösningar',
    'home.features.flexible.title': 'Flexibel',
    'home.features.flexible.desc': 'Anpassar mig efter dina behov och arbetar både på plats och remote',
    
    // Services page
    'services.title': 'Mina tjänster',
    'services.subtitle': 'Jag erbjuder ett brett utbud av IT-konsulttjänster',
    'services.visare.title': 'Visare',
    'services.visare.desc': 'Avancerad visualiseringslösning för dataanalys och presentation. Perfekt för företag som behöver omvandla komplex data till tydliga insikter.',
    'services.mapongo.title': 'MapOnGo',
    'services.mapongo.desc': 'Innovativ kartbaserad applikation för navigering och platsbaserade tjänster. Idealisk för logistik och fältarbete.',
    'services.consulting.title': 'Konsulttjänster',
    'services.consulting.desc': 'Skräddarsydda IT-konsulttjänster inom systemutveckling, arkitektur och teknisk rådgivning. Jag hjälper dig från idé till färdig lösning.',
    'services.cta': 'Intresserad? Kontakta mig',
    
    // About page
    'about.title': 'Om mig',
    'about.intro': 'Jag är en erfaren IT-konsult med passion för att skapa innovativa lösningar',
    'about.bio.title': 'Bakgrund',
    'about.bio.content': 'Med många års erfarenhet inom IT-branschen har jag arbetat med allt från små startups till stora företag. Min expertis spänner över systemutveckling, arkitektur och projektledning.',
    'about.experience.title': 'Erfarenhet',
    'about.experience.content': 'Jag har levererat framgångsrika projekt inom olika branscher och har med teknologier som React, TypeScript, Node.js, Java och C#.',
    'about.approach.title': 'Min approach',
    'about.approach.content': 'Jag tror på nära samarbete med kunder och behovsanalys som grund för kvalitet och långsiktighet. ',
    
    // Contact page
    'contact.title': 'Kontakta mig',
    'contact.subtitle': 'Har du ett projekt eller en idé? Hör av dig!',
    'contact.form.name': 'Namn',
    'contact.form.name.placeholder': 'Ditt namn',
    'contact.form.email': 'E-post',
    'contact.form.email.placeholder': 'din@email.se',
    'contact.form.company': 'Företag (frivilligt)',
    'contact.form.company.placeholder': 'Ditt företag',
    'contact.form.message': 'Meddelande',
    'contact.form.message.placeholder': 'Berätta om ditt projekt eller din fråga...',
    'contact.form.submit': 'Skicka meddelande',
    'contact.form.sending': 'Skickar...',
    'contact.form.success': 'Tack för ditt meddelande! Jag återkommer så snart som möjligt.',
    'contact.form.error': 'Något gick fel. Vänligen försök igen.',
    'contact.info.title': 'Kontaktinformation',
    'contact.info.email': 'E-post',
    'contact.info.email.protected': 'Lös CAPTCHA för att se e-postadress',
    'contact.info.location': 'Plats',
    'contact.info.location.value': 'Sverige',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Home page
    'home.hero.title': 'IT Consultant with a passion for innovation',
    'home.hero.subtitle': 'I help companies build modern, scalable and efficient IT solutions',
    'home.hero.cta': 'Book a call',
    'home.hero.cta2': 'View services',
    'home.features.title': 'Why choose me?',
    'home.features.experience.title': 'Broad experience',
    'home.features.experience.desc': 'Many years of experience with complex IT projects and modern technologies',
    'home.features.quality.title': 'High quality',
    'home.features.quality.desc': 'Focus on clean code, best practices and long-term solutions',
    'home.features.flexible.title': 'Flexible',
    'home.features.flexible.desc': 'I adapt to your needs and work both on-site and remotely',
    
    // Services page
    'services.title': 'My Services',
    'services.subtitle': 'I offer a wide range of IT consulting services',
    'services.visare.title': 'Visare',
    'services.visare.desc': 'Advanced visualization solution for data analysis and presentation. Perfect for companies that need to transform complex data into clear insights.',
    'services.mapongo.title': 'MapOnGo',
    'services.mapongo.desc': 'Innovative map-based application for navigation and location-based services. Ideal for logistics and field work.',
    'services.consulting.title': 'Consulting Services',
    'services.consulting.desc': 'Tailored IT consulting services in system development, architecture and technical advisory. I help you from idea to finished solution.',
    'services.cta': 'Interested? Contact me',
    
    // About page
    'about.title': 'About Me',
    'about.intro': 'I am an experienced IT consultant with a passion for creating innovative solutions',
    'about.bio.title': 'Background',
    'about.bio.content': 'With many years of experience in the IT industry, I have worked with everything from small startups to large enterprises. My expertise spans system development, architecture and project management.',
    'about.experience.title': 'Experience',
    'about.experience.content': 'I have delivered successful projects across various industries and have worked with technologies such as React, TypeScript, Node.js, Java and C#.',
    'about.approach.title': 'My approach',
    'about.approach.content': 'I believe in close collaboration with clients and needs analysis as the foundation for quality and long-term sustainability.',
    
    // Contact page
    'contact.title': 'Contact Me',
    'contact.subtitle': 'Have a project or an idea? Get in touch!',
    'contact.form.name': 'Name',
    'contact.form.name.placeholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'your@email.com',
    'contact.form.company': 'Company (optional)',
    'contact.form.company.placeholder': 'Your company',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'Tell me about your project or question...',
    'contact.form.submit': 'Send message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Thank you for your message! I will get back to you as soon as possible.',
    'contact.form.error': 'Something went wrong. Please try again.',
    'contact.info.title': 'Contact Information',
    'contact.info.email': 'Email',
    'contact.info.email.protected': 'Complete CAPTCHA to view email address',
    'contact.info.location': 'Location',
    'contact.info.location.value': 'Sweden',
  },
})
