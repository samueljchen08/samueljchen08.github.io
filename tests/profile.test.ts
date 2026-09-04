import { test } from 'node:test';
import assert from 'node:assert/strict';
import { person, education, roles, activities, skills, interests } from '../src/data/profile.ts';

test('person has every public contact channel', () => {
  assert.equal(person.name, 'Samuel Chen');
  assert.equal(person.email, 'samchen@mit.edu');
  assert.equal(person.github, 'https://github.com/samueljchen08');
  assert.equal(person.linkedin, 'https://www.linkedin.com/in/samuelj-chen');
  assert.equal(person.resumePdf, '/samuel-chen-resume.pdf');
  assert.deepEqual(person.locations, ['Cambridge, MA', 'Bellevue, WA']);
});

test('education matches the résumé PDF', () => {
  assert.equal(education.gpa, '4.95/5.0');
  assert.equal(education.expected, 'May 2027');
  assert.ok(education.coursework.includes('Natural Language Processing'));
});

test('roles are in site order with a track on each', () => {
  assert.deepEqual(
    roles.map((r) => r.company),
    ['Nexus AI (Courtex)', 'Goldman Sachs', 'Barings', 'Cercano Management (Vulcan Capital)', 'MIT Sloan School of Management'],
  );
  for (const r of roles) {
    assert.ok(['engineering', 'finance'].includes(r.track), `${r.company} has a track`);
    assert.ok(r.bullets.length >= 1, `${r.company} has bullets`);
  }
});

test('activities start with basketball and carry the user-supplied titles', () => {
  assert.equal(activities[0].name, 'MIT Varsity Basketball');
  const byName = Object.fromEntries(activities.map((a) => [a.name, a]));
  assert.equal(byName['Sloan Business Club'].role, 'Managing Director of Finance');
  assert.equal(byName['StartLabs'].role, 'VP of Corporate Relations');
});

test('skills and interests are non-empty', () => {
  assert.ok(skills.length >= 4);
  const basketball = interests.find((i) => i.label === 'Basketball');
  assert.ok(basketball, 'Basketball is listed');
  assert.match(basketball.href ?? '', /youtube\.com/, 'Basketball links to the highlight reel');
  assert.ok(
    interests.filter((i) => i.href).length === 1,
    'only the interest with something to show is a link',
  );
});
