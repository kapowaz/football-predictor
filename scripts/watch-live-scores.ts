import { API_KEY, parseCompetitionArg } from './common';
import type { ScriptCompetition } from './common';
import { generateForCompetition } from './generate-live-scores';

if (!API_KEY) {
  console.error('Error: FOOTBALL_DATA_API_KEY not found in environment');
  console.error('Please create a .env file with your API key (see .env.example)');
  process.exit(1);
}

const POLL_INTERVAL_MS = 60_000;

const formatTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const runCycle = async (competitions: ScriptCompetition[]): Promise<void> => {
  const summaries: string[] = [];

  for (const comp of competitions) {
    try {
      const { inPlayCount, totalScored } = await generateForCompetition(comp);
      summaries.push(`${comp.footballDataCode}: ${inPlayCount} in-play, ${totalScored} scored`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      summaries.push(`${comp.footballDataCode}: ERROR - ${message}`);
    }
  }

  console.log(`[${formatTime()}] ${summaries.join(' | ')}`);
};

const main = async (): Promise<void> => {
  const competitions = parseCompetitionArg();
  console.log(`Watching live scores for ${competitions.map((c) => c.name).join(', ')}...`);
  console.log(`Polling every ${POLL_INTERVAL_MS / 1000}s. Press Ctrl+C to stop.\n`);

  await runCycle(competitions);

  const interval = setInterval(() => {
    runCycle(competitions);
  }, POLL_INTERVAL_MS);

  const shutdown = () => {
    console.log('\nStopping live scores watcher...');
    clearInterval(interval);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

main();
