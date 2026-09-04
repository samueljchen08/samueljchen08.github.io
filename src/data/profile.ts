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
  locations: ['Cambridge, MA', 'Bellevue, WA'],
  github: 'https://github.com/samueljchen08',
  linkedin: 'https://www.linkedin.com/in/samuelj-chen',
  resumePdf: '/samuel-chen-resume.pdf',
} as const;

export const education = {
  school: 'Massachusetts Institute of Technology',
  location: 'Cambridge, MA',
  degree: 'BS in Computer Science — Artificial Intelligence',
  minor: 'Minor in Finance',
  gpa: '4.95/5.0',
  expected: 'May 2027',
  coursework: [
    {
      name: 'Computer Science — Artificial Intelligence',
      courses: [
        'Natural Language Processing',
        'Computer Vision',
        'Representation, Inference, and Reasoning in AI',
        'Machine Learning',
        'Algorithms and Data Structures',
        'Dynamic System Modeling and Control Design',
        'Probability and Statistics',
        'Probability and Random Variables',
        // The remainder, ordered hardest first.
        'Optimization Methods',
        'Computational Cognitive Science',
        'Fundamentals of Programming',
        'Discrete Math',
        'Linear Algebra',
        'Web Labs',
        'Intro to Computational Thinking and Data Science',
        'Intro to CS in Python',
      ],
    },
    {
      name: 'Finance',
      courses: [
        'Mergers, Acquisitions, and Private Equity',
        'Lab in Corporate Finance',
        'Corporate Financial Accounting',
        'Taxes and Business Strategy',
        'Managerial Finance',
        'Explorations in Management',
      ],
    },
    {
      name: 'General Institute Requirements',
      courses: [
        'Calculus I',
        'Calculus II',
        'Physics I',
        'Physics II',
        'Chemistry',
        'Biology',
      ],
    },
    {
      name: 'Humanities',
      courses: [
        'What is Capitalism',
        'Psychological Science',
        'Reading Poetry',
        'Visual Story: Graphic Novel',
        'Global Chinese Food',
        'Intro to Acting',
        'Voice and Speech',
        'Bodies in Motion',
      ],
    },
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
    logo: '/logos/nexus-ai.jpg',
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
    logo: '/logos/goldman-sachs.jpg',
    bullets: [
      'Supported eight M&A and coverage teams across Financial Institutions with valuation and transaction analysis.',
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
    logo: '/logos/barings.jpg',
    bullets: [
      'Led memo drafting for four debt and equity investments, building the cash-flow and returns analysis behind each.',
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
    logo: '/logos/cercano.jpg',
    bullets: [
      'Engineered seven Python tools automating trading research and backtesting, from benchmark tracking to rolling correlations.',
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
    logo: '/logos/mit-sloan.jpg',
    bullets: [
      'Coded five Monte Carlo season simulators in Python measuring dominance and competitive balance across major team sports.',
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
  { name: 'StartLabs', role: 'VP of Corporate Relations' },
  { name: 'Splash' },
  { name: 'Brass Rat Investments', role: 'Tech Sector Analyst' },
];

/**
 * The languages this résumé claims on their own. Everything else shown under
 * "technical" is derived from the projects' own stacks — see data/skills.ts — so the
 * list cannot claim a skill no project on the site actually demonstrates.
 */
export const skills = ['Python', 'HTML', 'CSS', 'JavaScript'];

export interface Interest {
  label: string;
  /** An interest with something to show links out; the rest are plain chips. */
  href?: string;
  /** Says where the link goes, since "Basketball" alone would not. */
  description?: string;
}

export const interests: Interest[] = [
  {
    label: 'Basketball',
    href: 'https://www.youtube.com/watch?v=-vFuig1jOgU',
    description: 'game highlights on YouTube',
  },
  { label: 'Personal Investing' },
  { label: 'Podcasts' },
  { label: 'Biking' },
  { label: 'Skiing' },
  { label: 'Hiking' },
  { label: 'Working out' },
  { label: 'Fantasy Football' },
];
