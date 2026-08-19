import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "sw";

/**
 * All user-facing copy lives here. Add a key to both `en` and `sw`.
 */
const dict = {
  en: {
    "nav.home": "Home",
    "nav.game": "The Game",
    "nav.tournament": "Tournament",
    "nav.winners": "Winners",
    "nav.menu": "Menu",
    "nav.theme": "Toggle theme",

    "cta.app": "Download the app",
    "cta.cards": "Get the physical cards",

    "hero.eyebrow": "ALBASTINI CARD GAME",
    "hero.title": "The game is on.",
    "hero.sub": "Play. Compete. Win.  The Albastini card game on your phone and on your table.",
    "hero.badge": "Safari Edition",

    "intro.eyebrow": "What is Albastini",
    "intro.title": "More than a card game.",
    "intro.body":
      "Albastini is a fast, tactical card game born in Tanzania. Read the table, play your points, take the round.",
    "intro.f1.t": "Strategy",
    "intro.f1.b": "Every card is points. Every point is a decision.",
    "intro.f2.t": "Competition",
    "intro.f2.b": "Ranked tables, tournaments and real winners.",
    "intro.f3.t": "Fun",
    "intro.f3.b": "Rounds in minutes. Rivalries for years.",
    "intro.f4.t": "Community",
    "intro.f4.b": "Played in living rooms, hostels and bars nationwide.",

    "game.eyebrow": "Two ways to play",
    "game.title": "Pick your table.",
    "game.app.tag": "Digital",
    "game.app.t": "The Albastini app",
    "game.app.b": "Play Albastini digitally wherever you are.",
    "game.phys.tag": "Physical",
    "game.phys.t": "Physical Albastini",
    "game.phys.b": "Bring the game to the table with physical Albastini cards.",

    "stats.eyebrow": "The community",
    "stats.title": "The game is already on.",
    "stats.games": "Games played",
    "stats.players": "Active players",
    "stats.coins": "Coins won",

    "tour.eyebrow": "Tournaments",
    "tour.title": "Play for the win.",
    "tour.body":
      "Albastini runs live tournaments with real prize pools. Qualify in the app, show up, take the crown.",
    "tour.next": "Next tournament",
    "tour.days": "Days",
    "tour.hours": "Hours",
    "tour.minutes": "Minutes",
    "tour.seconds": "Seconds",
    "tour.live": "Live now",
    "tour.cta": "Join the tournament",
    "tour.prize": "Prize pool",
    "tour.venue": "Venue",
    "tour.format": "Format",

    "win.eyebrow": "Latest tournament",
    "win.title1": "They played.",
    "win.title2": "They won.",
    "win.body": "Celebrate the three players who conquered the latest Albastini tournament.",
    "win.p1": "First place",
    "win.p2": "Second place",
    "win.p3": "Third place",
    "win.prize": "Prize",

    "phys.eyebrow": "Physical Albastini",
    "phys.title": "Hold the game in your hands.",
    "phys.body":
      "Heavy card stock, bold colour blocks, the Albastini points chip. The Safari Edition deck is coming.",
    "phys.spec1": "54 cards",
    "phys.spec2": "Points chips",
    "phys.spec3": "Rigid box",
    "phys.soon": "Coming soon",
    "phys.notify": "Get notified when available",
    "form.email": "Email address",
    "form.placeholder": "you@example.com",
    "form.submit": "Notify me",
    "form.thanks1": "You're on the list.",
    "form.thanks2": "We'll let you know when the physical cards are available.",
    "form.invalid": "Enter a valid email address.",

    "app.eyebrow": "Mobile app",
    "app.title1": "The game.",
    "app.title2": "In your pocket.",
    "app.body": "Quick matches, ranked tables and tournament qualifiers — anywhere in the country.",
    "app.soon": "Available now on Android and iOS",

    "modal.title": "Choose your device",
    "modal.body": "Pick your platform to download Albastini from the official store.",
    "modal.ios": "Download for iOS",
    "modal.android": "Download for Android",
    "modal.close": "Close",

    "final.title": "Ready to play?",
    "final.sub": "Ingia Uwanjani Tucheze Albastini.",

    "footer.tagline": "The Tanzanian card game.",
    "footer.rights": "All rights reserved.",
    "footer.egg": "Ace of Albastini. You found it.",

  },
  sw: {
    "nav.home": "Nyumbani",
    "nav.game": "Mchezo",
    "nav.tournament": "Mashindano",
    "nav.winners": "Washindi",
    "nav.menu": "Menyu",
    "nav.theme": "Badilisha mandhari",

    "cta.app": "Pakua app",
    "cta.cards": "Pata karata halisi",

    "hero.eyebrow": "ALBASTINI CARD GAME",
    "hero.title": "Mchezo umeanza.",
    "hero.sub": "Cheza. Shindana. Shinda.  Mchezo wa karata Albastini kwenye simu na mezani.",
    "hero.badge": "Safari Edition",

    "intro.eyebrow": "Albastini ni nini",
    "intro.title": "Zaidi ya karata.",
    "intro.body":
      "Albastini ni mchezo wa karata wa kasi na akili uliozaliwa Tanzania. Soma meza, tumia pointi zako, chukua raundi.",
    "intro.f1.t": "Mkakati",
    "intro.f1.b": "Kila karata ni pointi. Kila pointi ni uamuzi.",
    "intro.f2.t": "Ushindani",
    "intro.f2.b": "Meza za daraja, mashindano na washindi wa kweli.",
    "intro.f3.t": "Furaha",
    "intro.f3.b": "Raundi za dakika. Ushindani wa miaka.",
    "intro.f4.t": "Jumuiya",
    "intro.f4.b": "Unachezwa sebuleni, mabwenini na baa kote nchini.",

    "game.eyebrow": "Njia mbili za kucheza",
    "game.title": "Chagua meza yako.",
    "game.app.tag": "Kidijitali",
    "game.app.t": "App ya Albastini",
    "game.app.b": "Cheza Albastini kidijitali ulipo popote.",
    "game.phys.tag": "Halisi",
    "game.phys.t": "Karata za Albastini",
    "game.phys.b": "Leta mchezo mezani na karata halisi za Albastini.",

    "stats.eyebrow": "Jumuiya",
    "stats.title": "Mchezo unaendelea.",
    "stats.games": "Michezo iliyochezwa",
    "stats.players": "Wachezaji hai",
    "stats.coins": "Coins zilizoshindwa",

    "tour.eyebrow": "Mashindano",
    "tour.title": "Cheza kwa ushindi.",
    "tour.body":
      "Albastini huandaa mashindano ya moja kwa moja na zawadi halisi. Fuzu kwenye app, fika, chukua taji.",
    "tour.next": "Mashindano yajayo",
    "tour.days": "Siku",
    "tour.hours": "Saa",
    "tour.minutes": "Dakika",
    "tour.seconds": "Sekunde",
    "tour.live": "Yanaendelea",
    "tour.cta": "Jiunge na mashindano",
    "tour.prize": "Zawadi",
    "tour.venue": "Ukumbi",
    "tour.format": "Muundo",

    "win.eyebrow": "Mashindano ya karibuni",
    "win.title1": "Walicheza.",
    "win.title2": "Walishinda.",
    "win.body": "Tunawapongeza wachezaji watatu waliotwaa mashindano ya karibuni ya Albastini.",
    "win.p1": "Nafasi ya kwanza",
    "win.p2": "Nafasi ya pili",
    "win.p3": "Nafasi ya tatu",
    "win.prize": "Zawadi",

    "phys.eyebrow": "Karata halisi za Albastini",
    "phys.title": "Shika mchezo mkononi.",
    "phys.body":
      "Karata nene, rangi thabiti, na chipu ya pointi ya Albastini. Deki ya Safari Edition inakuja.",
    "phys.spec1": "Karata 54",
    "phys.spec2": "Chipu za pointi",
    "phys.spec3": "Boksi gumu",
    "phys.soon": "Inakuja hivi karibuni",
    "phys.notify": "Pata taarifa zikipatikana",
    "form.email": "Barua pepe",
    "form.placeholder": "wewe@mfano.com",
    "form.submit": "Nitaarifu",
    "form.thanks1": "Umo kwenye orodha.",
    "form.thanks2": "Tutakujuza karata halisi zikipatikana.",
    "form.invalid": "Weka barua pepe sahihi.",

    "app.eyebrow": "App ya simu",
    "app.title1": "Mchezo.",
    "app.title2": "Mfukoni mwako.",
    "app.body": "Michezo ya haraka, meza za daraja na kufuzu mashindano — kila kona ya nchi.",
    "app.soon": "Inapatikana sasa kwa Android na iOS",

    "modal.title": "Chagua kifaa chako",
    "modal.body": "Chagua jukwaa lako ili kupakua Albastini kutoka kwenye duka rasmi.",
    "modal.ios": "Pakua kwa iOS",
    "modal.android": "Pakua kwa Android",
    "modal.close": "Funga",

    "final.title": "Uko tayari kucheza?",
    "final.sub": "Ingia Uwanjani Tucheze Albastini.",


    "footer.tagline": "Mchezo wa karata wa Tanzania.",
    "footer.rights": "Haki zote zimehifadhiwa.",
    "footer.egg": "Ace ya Albastini. Umeiona.",
  },
} as const;

export type TKey = keyof (typeof dict)["en"];

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string };

const LanguageContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict.en[k],
});

const STORAGE_KEY = "albastini-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "sw") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback((k: TKey) => dict[lang][k] ?? dict.en[k], [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  return useContext(LanguageContext);
}
