import type { Command } from '../types';

export const getCommandAliases = (command: Command) => {
  if (
    !command.meta.name ||
    !Array.isArray(command.meta.name) ||
    (Array.isArray(command.meta.name) && !command.meta.name.slice(1).length)
  ) {
    return undefined;
  }
  return command.meta.name.slice(1);
};
