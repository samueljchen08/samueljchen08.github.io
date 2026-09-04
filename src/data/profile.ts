/**
 * Single source of truth for everything the resume PDF also says.
 * The homepage and /resume both read from here, so they cannot drift.
 * Every field is transcribed from `public/samuel-chen-resume.pdf`. Do not embellish.
 */

export const person = {
  name: 'Samuel Chen',
  school: 'Massachusetts Institute of Technology',
  degree: 'BS in Computer Science — Artificial Intelligence',
  minor: 'Minor in Finance',
  graduation: 'Expected May 2027',
  gpa: '4.95 / 5.00',
  homeBase: 'Bellevue, WA',
  termBase: 'Cambridge, MA',
  email: 'samchen@mit.edu',
  phone: '(206) 475-8031',
  phoneHref: '+12064758031',
  github: 'https://github.com/samueljchen08',
  githubLabel: 'github.com/samueljchen08',
  linkedin: 'https://www.linkedin.com/in/samuelj-chen',
  linkedinLabel: 'linkedin.com/in/samuelj-chen',
  resumePdf: '/samuel-chen-resume.pdf',
} as const;

export const scope =
  'AI systems, and the measurement machinery that decides whether they actually worked.';

export const coursework = [
  'Representation, Inference, and Reasoning in AI',
  'Natural Language Processing',
  'Computer Vision',
  'Machine Learning',
  'Algorithms',
  'Dynamic System Modeling and Control Design',
  'Discrete Math',
  'Probability and Random Variables',
  'Linear Algebra',
  'Differential Equations',
];

export const activities = [
  'Varsity Basketball',
  'Sloan Business Club',
  'Brass Rat Investments',
  'StartLabs',
  'Splash',
];

export type Role = {
  org: string;
  title: string;
  location: string;
  start: string;
  end: string;
  /** 'engineering' leads the page; 'markets' sits below it. */
  track: 'engineering' | 'markets';
  /** One line stating what this role proves to an engineer reading it. */
  proves: string;
  points: string[];
};

export const roles: Role[] = [
  {
    org: 'Nexus AI (Courtex)',
    title: 'Co-Founder',
    location: 'Cambridge, MA',
    start: 'Apr 2025',
    end: 'Present',
    track: 'engineering',
    proves: 'End-to-end ML pipelines and a retrieval-augmented scouting stack, built for coaching staffs.',
    points: [
      'Built end-to-end machine learning pipelines on multi-season NCAA basketball datasets to forecast player performance, transfer fit, and outcomes — data ingestion, feature engineering, model training, backtesting, and error analysis.',
      'Built a retrieval-augmented LLM scouting stack that grounds natural-language analysis in structured player and team data, letting coaches query players, evaluate roster needs, and generate automated scouting insights.',
      'Trained and evaluated predictive models using temporally separated train/test splits, with hyperparameter tuning and error analysis to study out-of-sample generalization.',
      'Established partnerships with 20+ Division I basketball programs, including national runner-up Houston.',
    ],
  },
  {
    org: 'MIT Sloan School of Management',
    title: 'Researcher',
    location: 'Cambridge, MA',
    start: 'May 2024',
    end: 'Sep 2024',
    track: 'engineering',
    proves: 'Empirical method and simulation, fit against real historical outcomes.',
    points: [
      'Conducted cross-sport empirical analysis across 15+ leagues and competitions, engineering quantitative measures of competitive balance, durable dominance, performance dispersion, and sustained team success.',
      'Built probabilistic Monte Carlo season simulators in Python that model team skill distributions, derive matchup win probabilities, and fit simulation parameters to historical NBA, NFL, NHL, MLB, and European outcomes.',
    ],
  },
  {
    org: 'Goldman Sachs',
    title: 'FIG Investment Banking Intern',
    location: 'New York, NY',
    start: 'Jun 2026',
    end: 'Aug 2026',
    track: 'markets',
    proves: 'Analytical work under deadline pressure with real money attached to being right.',
    points: [
      'Supported 8 M&A and coverage teams across Financial Institutions, performing company and industry research, valuation and transaction analysis, and preparation of materials for senior bankers and client discussions.',
      'Contributed to the buy-side advisory for KKR, Dragoneer, and Amwins on the ~$5.5B acquisition of Steadfast Group, analyzing transaction dynamics, valuation, strategic rationale, and insurance brokerage industry considerations.',
    ],
  },
  {
    org: 'Barings',
    title: 'Capital Solutions (Private Equity and Special Situations) Intern',
    location: 'Charlotte, NC',
    start: 'Jun 2025',
    end: 'Aug 2025',
    track: 'markets',
    proves: 'Modeling a decision end to end and defending the conclusion in writing.',
    points: [
      'Screened and led investment memo drafting for 4 potential debt and equity investments using cash flow models and returns analysis, combined with market research, investor presentations, and management calls.',
    ],
  },
  {
    org: 'Cercano Management (Vulcan Capital)',
    title: 'Public Equities Intern',
    location: 'Bellevue, WA',
    start: 'Jun 2024',
    end: 'Aug 2024',
    track: 'markets',
    proves: "Python tooling built for a portfolio manager's real investment decisions.",
    points: [
      'Engineered 7 financial tools in Python to automate trading research and backtesting, including portfolio tracking against benchmarks, industry margins and growth, momentum and moving averages, volatility in levered indices, and rolling correlations.',
      "Screened over 3,000 companies to find top-quartile performers in FCF margin, EPS growth, ROIC, and YTD performance, complementing the fundamental approach for a portfolio manager's investment decisions at a $10B+ fund.",
    ],
  },
];

export const athletics = {
  program: 'MIT Varsity Basketball',
  title: 'Recruited Collegiate Athlete (Point Guard)',
  start: 'Sept 2023',
  end: 'May 2026',
  points: [
    'Appeared in all 24 games as a freshman and played the 6th most minutes on the team, averaging 15.4 minutes per game.',
    'Scored 10 points, grabbed 4 rebounds, and distributed 4 assists against Keene State, the #4 Division III team in the country.',
    '6th in points and 8th in assists in Washington State high school basketball, a four-year varsity starter in the largest division (4A).',
  ],
};

export const interests = [
  'Basketball',
  'Personal investing',
  'Podcasts',
  'Biking',
  'Skiing',
  'Hiking',
  'Fantasy football',
];

export const skills = {
  languages: ['Python', 'JavaScript', 'HTML', 'CSS', 'SQL'],
  tools: ['PyTorch', 'XGBoost', 'scikit-learn', 'Ultralytics YOLO', 'OpenCV', 'pandas', 'SQLite'],
};
