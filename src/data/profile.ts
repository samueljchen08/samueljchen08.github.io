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
  /** Ordered so the first two are the most engineering-relevant — the homepage shows only those. */
  bullets: string[];
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
    bullets: [
      'Built end-to-end machine learning pipelines on multi-season NCAA basketball datasets to forecast player performance, transfer fit, and outcomes, including data ingestion, feature engineering, model training, backtesting, and error analysis',
      'Built a retrieval-augmented LLM scouting platform that grounds natural-language analysis in structured player and team data, enabling coaches to query players, evaluate roster needs, and generate automated scouting insights',
      'Trained and evaluated predictive models for player performance and transfer fit using temporally separated train/test sets; performed feature engineering, hyperparameter tuning, and error analysis to study out-of-sample generalization',
      'Established partnerships with 20+ Division 1 basketball programs, including national runner-up Houston University',
    ],
  },
  {
    company: 'Goldman Sachs',
    title: 'FIG Investment Banking Intern',
    location: 'New York, NY',
    start: 'Jun 2026',
    end: 'Aug 2026',
    track: 'finance',
    bullets: [
      'Supported 8 M&A and coverage teams across Financial Institutions, performing company and industry research, valuation and transaction analysis, and preparation of materials for senior bankers and client discussions',
      'Contributed to the buy-side advisory for KKR, Dragoneer, and Amwins on the ~$5.5B acquisition of Steadfast Group, analyzing transaction dynamics, valuation, strategic rationale, and insurance brokerage industry considerations',
    ],
  },
  {
    company: 'Barings',
    title: 'Capital Solutions (Private Equity and Special Situations) Intern',
    location: 'Charlotte, NC',
    start: 'Jun 2025',
    end: 'Aug 2025',
    track: 'finance',
    bullets: [
      'Screened and led investment memo drafting for 4 potential debt and equity investments using cash flow models and returns analysis in combination with market research, investor presentations and management calls',
    ],
  },
  {
    company: 'Cercano Management (Vulcan Capital)',
    title: 'Public Equities Intern',
    location: 'Bellevue, WA',
    start: 'Jun 2024',
    end: 'Aug 2024',
    track: 'finance',
    bullets: [
      'Engineered 7 financial tools in Python to automate trading research and backtesting, including portfolio tracking against benchmarks, industry margins/growth, momentum/moving averages, volatility in levered indices, and rolling correlations',
      'Screened over 3,000 companies to find top-quartile performers in FCF margin, EPS growth, ROIC, YTD performance, and more to complement fundamental approach for portfolio manager’s investment decisions for $10+ billion-dollar fund',
    ],
  },
  {
    company: 'MIT Sloan School of Management',
    title: 'Researcher',
    location: 'Cambridge, MA',
    start: 'May 2024',
    end: 'Sep 2024',
    track: 'engineering',
    bullets: [
      'Built probabilistic Monte Carlo season simulators in Python that model team skill distributions, derive matchup win probabilities, and fit simulation parameters to historical NBA, NFL, NHL, MLB, and European soccer outcomes',
      'Conducted cross-sport empirical analysis across 15+ leagues and competitions, engineering quantitative measures of competitive balance and durable dominance and using regression analysis to study relationships between parity, performance dispersion, and sustained team success',
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
  { name: 'Brass Rat Investments' },
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
