/**
 * Minimal i18n for the WC26 app — English + Norwegian (bokmål).
 *
 * Pattern: `getDictionary()` is a server-only function that reads the
 * `wc26-locale` cookie (set by the language toggle), falls back to the
 * `Accept-Language` header, and defaults to English. Translations happen
 * server-side; client components receive translated strings as props.
 *
 * Keys are intentionally namespaced (nav.*, predictions.*, etc.) so the
 * tree stays scannable.
 */

import { cookies, headers } from "next/headers";

export type Locale = "en" | "nb";

export const LOCALE_COOKIE = "wc26-locale";

export type Dict = typeof EN;

const EN = {
  nav: {
    dashboard: "Dashboard",
    norge: "Follow Norway",
    matches: "Matches",
    teams: "Teams",
    players: "Players",
    scorers: "Top scorers",
    predictions: "Predictions",
    leagues: "Mini-leagues",
    bracket: "Bracket",
    tippemodell: "Tippemodell",
  },
  common: {
    search: "Search…",
    signIn: "Sign in",
    register: "Register",
    signOut: "Sign out",
    poweredBy: "Powered by",
    builtBy: "Built by",
    copyLink: "Copy link",
    copied: "Copied!",
    share: "Share",
    save: "Save",
    cancel: "Cancel",
  },
  dashboard: {
    countdown: "Countdown",
    liveTournament: "Live tournament",
    daysToKickoff: (n: number) => `${n} days to kickoff`,
    openerLine: (date: string) => `Opener: ${date} · Mexico vs South Africa at Estadio Azteca`,
    matches: "matches",
    group: "group",
    knockout: "knockout",
    today: "Today",
    upcoming: "Upcoming",
    firstMatches: "First matches",
    tournamentOpener: "Tournament opener",
    keyDates: "Key dates",
    heroLeague: {
      kicker: "Mini-league",
      title: "Create your World Cup league",
      body: "Invite friends with a link. Private leaderboard, weekly banter.",
    },
    heroPredict: {
      kicker: "Predictions",
      title: "Tip the opening match",
      body: "3 free guest tips before signing in. Mexico–RSA first up.",
    },
    heroNorway: {
      kicker: "Follow your team",
      title: "Norway in Group I",
      body: "Next match, group standings, Haaland tracker and scenarios.",
    },
  },
  predictions: {
    title: "Your tips for upcoming matches",
    subtitle: "3 pts for exact score · 1 pt for correct outcome. Tips lock at kickoff.",
    guestBanner: {
      title: "Try 3 free predictions — no account needed",
      body: "Your guest tips are stored on this device. Sign up after to keep tipping and join mini-leagues.",
    },
    open: (n: number) => `Open · ${n} ${n === 1 ? "match" : "matches"} ahead`,
    none: "No matches open for tips right now.",
    knockoutNote:
      "Knockout fixtures will fill in as group-stage standings determine the pairings (from 28 June). You can then tip every match through to the final on 19 July.",
  },
  leagues: {
    title: "Tip against your friends",
    subtitle:
      "Create a private league, share the invite link, and compare points throughout the tournament.",
    create: "Create a mini-league",
    join: "Join with invite code",
    yours: "Your leagues",
    none: "You're not in any mini-leagues yet. Create one below or join with an invite code.",
    leaderboard: "Leaderboard",
  },
  norge: {
    follow: "Follow Norway",
    title: "Norway at the 2026 World Cup",
    subtitle: "Group I · 3 matches · Ståle Solbakken · 4-3-3",
    tipMatches: "Tip Norway's matches",
    nextMatch: "Next Norway match",
    allMatches: "All Norway matches",
    standings: "Group I — standings",
    playersToWatch: "Players to watch",
    scenarioTitle: "What does Norway need to advance?",
  },
};

const NB: Dict = {
  nav: {
    dashboard: "Forside",
    norge: "Følg Norge",
    matches: "Kamper",
    teams: "Lag",
    players: "Spillere",
    scorers: "Toppscorer",
    predictions: "Tippe",
    leagues: "Mini-ligaer",
    bracket: "Sluttspill",
    tippemodell: "Tippemodell",
  },
  common: {
    search: "Søk…",
    signIn: "Logg inn",
    register: "Registrer",
    signOut: "Logg ut",
    poweredBy: "Drevet av",
    builtBy: "Laget av",
    copyLink: "Kopier lenke",
    copied: "Kopiert!",
    share: "Del",
    save: "Lagre",
    cancel: "Avbryt",
  },
  dashboard: {
    countdown: "Nedtelling",
    liveTournament: "Turneringen pågår",
    daysToKickoff: (n: number) => `${n} dager til kickoff`,
    openerLine: (date: string) => `Åpning: ${date} · Mexico mot Sør-Afrika på Estadio Azteca`,
    matches: "kamper",
    group: "gruppe",
    knockout: "knockout",
    today: "I dag",
    upcoming: "Kommende",
    firstMatches: "Første kamper",
    tournamentOpener: "Åpningskampen",
    keyDates: "Viktige datoer",
    heroLeague: {
      kicker: "Mini-liga",
      title: "Lag VM-ligaen din",
      body: "Inviter venner med en lenke. Privat leaderboard, ukentlig oppsummering.",
    },
    heroPredict: {
      kicker: "Tipping",
      title: "Tipp åpningskampen",
      body: "3 gratis gjeste-tips før du må logge inn. Mexico–RSA først ut.",
    },
    heroNorway: {
      kicker: "Følg laget ditt",
      title: "Norge i Gruppe I",
      body: "Neste kamp, gruppestilling, Haaland-tracker og scenarier.",
    },
  },
  predictions: {
    title: "Dine tips for kommende kamper",
    subtitle: "3 poeng for eksakt resultat · 1 poeng for riktig utfall. Tips låses ved kickoff.",
    guestBanner: {
      title: "Prøv 3 gratis tips — uten konto",
      body: "Gjeste-tipsene dine lagres på denne enheten. Lag konto etterpå for å fortsette og bli med i mini-ligaer.",
    },
    open: (n: number) => `Åpne · ${n} ${n === 1 ? "kamp" : "kamper"} fremover`,
    none: "Ingen kamper åpne for tipping akkurat nå.",
    knockoutNote:
      "Knockout-kampene legges til når gruppespillet er ferdig (fra 28. juni). Du kan da tippe hver eneste kamp helt frem til finalen 19. juli.",
  },
  leagues: {
    title: "Tipp mot vennene dine",
    subtitle:
      "Lag en privat liga, del invite-lenken, og sammenlign poeng gjennom hele turneringen.",
    create: "Lag en mini-liga",
    join: "Bli med via invite-kode",
    yours: "Dine ligaer",
    none: "Du er ikke med i noen mini-ligaer ennå. Lag en under eller bli med via invite-kode.",
    leaderboard: "Leaderboard",
  },
  norge: {
    follow: "Følg Norge",
    title: "Norge i fotball-VM 2026",
    subtitle: "Gruppe I · 3 kamper · Ståle Solbakken · 4-3-3",
    tipMatches: "Tipp Norges kamper",
    nextMatch: "Neste Norge-kamp",
    allMatches: "Alle Norges kamper",
    standings: "Gruppe I — stilling",
    playersToWatch: "Spillere å følge med på",
    scenarioTitle: "Hva må Norge gjøre for å gå videre?",
  },
};

const DICTS: Record<Locale, Dict> = { en: EN, nb: NB };

/**
 * Server-side: determine the active locale from cookie → Accept-Language → en.
 * Cookie wins so a manual toggle is sticky across requests.
 */
export function getLocale(): Locale {
  const fromCookie = cookies().get(LOCALE_COOKIE)?.value;
  if (fromCookie === "nb" || fromCookie === "en") return fromCookie;

  const acceptLang = headers().get("accept-language") ?? "";
  if (/^(nb|no|nn)(\b|[-_])/i.test(acceptLang)) return "nb";

  return "en";
}

export function getDictionary(): Dict {
  return DICTS[getLocale()];
}
