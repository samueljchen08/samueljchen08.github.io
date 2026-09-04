/**
 * Single source of truth for everything the résumé PDF also states.
 * The homepage and /resume/ both read from here, so they cannot drift.
 * Keep in sync with public/samuel-chen-resume.pdf.
 */

export interface Role {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  /** Engineering roles lead on the homepage; finance roles support. */
  track: 'engineering' | 'finance';
  /** Two, one sentence each. The résumé page and the homepage card both show both. */
  bullets: string[];
  /** Two or three letters for the card's square tile when there is no logo file. */
  mark: string;
  /** A square logo in `public/logos/`. Falls back to `mark` when absent. */
  logo?: string;
  /** Where the company card links, when the company has a site worth visiting. */
  href?: string;
}

export interface Activity {
  name: string;
  role?: string;
  start?: string;
  end?: string;
  bullets?: string[];
}

export const person = {
  name: 'Samuel Chen',
  email: 'samchen@mit.edu',
  phone: '(206) 475-8031',
  locations: ['Cambridge, MA', 'Bellevue, WA'],
  github: 'https://github.com/samueljchen08',
  linkedin: 'https://www.linkedin.com/in/samuelj-chen',
  resumePdf: '/samuel-chen-resume.pdf',
} as const;

/**
 * E.164 for `tel:` links. The site is shared cold and read abroad, so the US country
 * code stays on the dialable form even though the printed number omits it.
 */
export const phoneHref = `tel:+1${person.phone.replace(/\D/g, '')}`;

export const education = {
  school: 'Massachusetts Institute of Technology',
  location: 'Cambridge, MA',
  degree: 'BS in Computer Science — Artificial Intelligence',
  minor: 'Minor in Finance',
  gpa: '4.95/5.0',
  expected: 'May 2027',
  coursework: [
    'Representation, Inference, and Reasoning in AI',
    'Natural Language Processing',
    'Computer Vision',
    'Machine Learning',
    'Algorithms',
    'Dynamic System Modeling and Control Design',
    'Discrete Math',
    'Probability & Statistics',
    'Linear Algebra',
    'Differential Equations',
    'Probability and Random Variables',
    'Fundamentals of Programming',
    'Web Labs',
    'Managerial Finance',
    'Mergers, Acquisitions and Private Equity',
    'Corporate Finance Lab',
    'Corporate Accounting',
  ],
} as const;

export const roles: Role[] = [
  {
    company: 'Nexus AI (Courtex)',
    title: 'Co-Founder',
    location: 'Cambridge, MA',
    start: 'Apr 2025',
    end: 'Present',
    track: 'engineering',
    mark: 'NX',
    href: 'https://www.nexusbasketball.org/',
    bullets: [
      'Built ML pipelines and a retrieval-augmented scouting platform over multi-season NCAA data to forecast player performance and transfer fit.',
      'Established partnerships with 20+ Division I programs, including national runner-up Houston.',
    ],
  },
  {
    company: 'Goldman Sachs',
    title: 'FIG Investment Banking Intern',
    location: 'New York, NY',
    start: 'Jun 2026',
    end: 'Aug 2026',
    track: 'finance',
    mark: 'GS',
    bullets: [
      'Supported 8 M&A and coverage teams across Financial Institutions with valuation and transaction analysis.',
      'Contributed to the buy-side advisory on the ~$5.5B acquisition of Steadfast Group.',
    ],
  },
  {
    company: 'Barings',
    title: 'Capital Solutions Intern',
    location: 'Charlotte, NC',
    start: 'Jun 2025',
    end: 'Aug 2025',
    track: 'finance',
    mark: 'B',
    bullets: [
      'Led memo drafting for 4 debt and equity investments, building the cash-flow and returns analysis behind each.',
      'Pitched an exit strategy for a ~$50M oil and gas investment using a dynamic DCF and sum-of-the-parts model.',
    ],
  },
  {
    company: 'Cercano Management (Vulcan Capital)',
    title: 'Public Equities Intern',
    location: 'Bellevue, WA',
    start: 'Jun 2024',
    end: 'Aug 2024',
    track: 'finance',
    mark: 'CM',
    bullets: [
      'Engineered 7 Python tools automating trading research and backtesting, from benchmark tracking to rolling correlations.',
      'Screened 3,000+ companies on FCF margin, EPS growth and ROIC for a $10B+ fund.',
    ],
  },
  {
    company: 'MIT Sloan School of Management',
    title: 'Researcher',
    location: 'Cambridge, MA',
    start: 'May 2024',
    end: 'Sep 2024',
    track: 'engineering',
    mark: 'MIT',
    bullets: [
      'Coded 5 Monte Carlo season simulators in Python measuring dominance and competitive balance across major team sports.',
      'Analyzed 15+ sports to test how durable dominance relates to competitiveness.',
    ],
  },
];
export const activities: Activity[] = [
  {
    name: 'MIT Varsity Basketball',
    role: 'Recruited Collegiate Athlete (Point Guard)',
    start: 'Sep 2023',
    end: 'May 2026',
    bullets: [
      'Appeared in all 24 games as a freshman and played 6th most minutes on team, averaging 15.4 minutes per game',
      'Scored 10 points, grabbed 4 rebounds, and distributed 4 assists against the #4 D3 team in the country, Keene State',
      '6th in points and 8th in assists in Washington State High School Basketball, 4-year varsity starter in largest division (4A)',
    ],
  },
  // USER-SUPPLIED title (2026-09-03); the résumé PDF lists the club without a title.
  { name: 'Sloan Business Club', role: 'Managing Director of Finance' },
  // USER-SUPPLIED title (2026-09-03); the résumé PDF lists the club without a title.
  { name: 'StartLabs', role: 'VP of External Relations' },
  { name: 'Splash' },
  { name: 'Brass Rat Investments', role: 'Tech Sector Analyst' },
];

/**
 * The languages this résumé claims on their own. Everything else shown under
 * "technical" is derived from the projects' own stacks — see data/skills.ts — so the
 * list cannot claim a skill no project on the site actually demonstrates.
 */
export const skills = ['Python', 'HTML', 'CSS', 'JavaScript'];

export const interests = [
  'Basketball',
  'Personal Investing',
  'Podcasts',
  'Biking',
  'Skiing',
  'Hiking',
  'Working out',
  'Fantasy Football',
];
