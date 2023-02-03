import { Command } from './lib/types';

const BACKUP_STRATEGIES: string[][] = [
  ['E', 'R', 'F'],
  ['E', 'L', 'F'],
  ['E', 'L', 'L', 'F'],
  ['E', 'B', 'R', 'F'],
  ['E', 'B', 'B', 'L', 'F'],
  ['E', 'F', 'F'],
  ['E', 'F', 'L', 'F', 'L', 'F'],
];

/** Backup Strategies converted to the array of Command objects and reversed for the stacked execution */
export const BackupStrategies = BACKUP_STRATEGIES.reverse().map((array) =>
  array.map((str) => str as Command)
);
