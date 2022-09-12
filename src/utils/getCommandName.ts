import type { Command } from '../types';

export const getCommandName = (command: Command) => {
  if (!command.meta.name) return undefined;
  if (Array.isArray(command.meta.name)) return command.meta.name[0];
  return command.meta.name;
};
