// One place for everything that names the site. Change the brand or domain
// here and every page, meta tag and schema block follows.

export const SITE = {
  name: "Trivia Questions Digest",
  domain: "triviaquestionsdigest.com",
  url: "https://triviaquestionsdigest.com",
  tagline: "Daily Trivia, Fun Facts and Map Quizzes",
  description:
    "A free daily trivia quiz, hand-written trivia questions and answers by category, fun facts, and click-the-map quizzes for US states, countries, capitals and flags.",
  language: "en-US",
  locale: "en_US",
  foundingYear: 2026,

  // A real inbox on the domain (Cloudflare Email Routing works).
  email: "hello@triviaquestionsdigest.com",

  // Optional form backend URL; empty shows the email address only.
  contactFormEndpoint: "",

  // Filled in when this site is approved; until then no ad script loads.
  adsensePublisherId: "",
  // The account's publisher ID, served in /ads.txt from day one so AdSense
  // can verify the site when it is added to the account.
  adsTxtPublisher: "pub-4674211063760769",

  verification: {
    google: "",
    bing: "",
    yandex: "",
  },

  // IndexNow key, served at /indexnow-key.txt. Keep stable.
  indexNowKey: "7f3c91e2b84a4d06a5e1c9d2f0b8e413",
};

export const AUTHOR = {
  name: "Eren Şimşir",
  slug: "eren-simsir",
  role: "Founder, Editor & Software Engineer",
  photo: "/images/eren-simsir.jpg",
  linkedin: "https://www.linkedin.com/in/ernsmsr/",
  github: "https://github.com/cynorra",
  shortBio:
    "Computer engineer (M.Sc. student at Kocaeli University, B.Sc. Düzce University) with a double major in industrial engineering. Writes and checks every question on this site, built the daily quiz and the map quiz engine, and cross-checks every country and capital against two datasets.",
};

export const NAV = [
  { href: "/daily-trivia/", label: "Daily trivia" },
  { href: "/general-knowledge-trivia/", label: "Trivia" },
  { href: "/map-quizzes/", label: "Map quizzes" },
  { href: "/fun-facts/", label: "Fun facts" },
  { href: "/christmas-trivia/", label: "Christmas" },
  { href: "/guides/", label: "Guides" },
];

export const FOOTER_LINKS = [
  { href: "/about/", label: "About" },
  { href: `/author/${AUTHOR.slug}/`, label: "Author" },
  { href: "/how-we-write-questions/", label: "How we write questions" },
  { href: "/how-we-make-our-maps/", label: "How we make our maps" },
  { href: "/editorial-policy/", label: "Editorial policy" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy policy" },
  { href: "/terms/", label: "Terms of use" },
  { href: "/disclaimer/", label: "Disclaimer" },
];

// Where the methodology lives and what the "checked" date means on quiz pages.
// Map, flag and capitals pages link to the map methodology instead.
export const MAP_METHOD = { href: "/how-we-make-our-maps/", label: "How we make our maps", checkedLabel: "Data checked" };
export const METHOD = { href: "/how-we-write-questions/", label: "How we write questions", checkedLabel: "Answers checked" };
