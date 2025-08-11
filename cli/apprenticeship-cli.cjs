// Compiled JS for apprenticeship-cli
// This file is generated for test replay compatibility

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { GhostMentor } = require('../framework/mentors/ghost-mentor-plugin.cjs');

const apprenticeshipEventsPath = path.join(__dirname, '../framework/observability/apprenticeship-events.jsonl');

function emitEvent(event) {
  fs.appendFileSync(apprenticeshipEventsPath, JSON.stringify(event) + '\n');
}

const argv = yargs(hideBin(process.argv))
  .option('mode', {
    alias: 'm',
    choices: ['guided', 'challenge', 'review-only'],
    demandOption: true,
    describe: 'Apprenticeship mode to run',
    type: 'string',
  })
  .option('blueprint', {
    alias: 'b',
    demandOption: true,
    describe: 'Path to blueprint.yaml',
    type: 'string',
  })
  .help().argv;

const { mode, blueprint } = argv;
const blueprintContent = fs.readFileSync(blueprint, 'utf-8');

emitEvent({
  event: 'apprenticeship_mode_started',
  mode,
  blueprint,
  timestamp: new Date().toISOString(),
});

console.log(`\n[Apprenticeship Mode: ${mode}]`);
console.log(`Loaded blueprint: ${blueprint}`);

if (mode === 'guided') {
  console.log('Guided mode: Mentor will provide step-by-step feedback.');
  const mentor = new GhostMentor();
  const feedback = mentor.provideFeedback({ answer: 'initial reflection' });
  console.log('Mentor Feedback:', feedback);
  emitEvent({ event: 'mentor_feedback', feedback, timestamp: new Date().toISOString() });
} else if (mode === 'challenge') {
  console.log('Challenge mode: Complete tasks without hints. Mentor will review at the end.');
  emitEvent({ event: 'challenge_started', timestamp: new Date().toISOString() });
} else if (mode === 'review-only') {
  console.log('Review-only mode: Mentor will review your completed work.');
  const mentor = new GhostMentor();
  const feedback = mentor.provideFeedback({ answer: 'final submission' });
  console.log('Mentor Review:', feedback);
  emitEvent({ event: 'mentor_review', feedback, timestamp: new Date().toISOString() });
}

emitEvent({
  event: 'apprenticeship_mode_completed',
  mode,
  blueprint,
  timestamp: new Date().toISOString(),
});
