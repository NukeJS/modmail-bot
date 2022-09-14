import type { CommandMeta, CommandRunFunction, Command } from '../types';

export const defineCommand = (
  name: Command['meta']['name'],
  meta: CommandMeta,
  callback: CommandRunFunction,
): Command => ({
  meta: {
    name,
    ...meta,
  },
  run: callback,
});
