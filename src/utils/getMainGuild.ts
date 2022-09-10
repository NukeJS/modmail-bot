import type { Guild } from 'discord.js';
import { client } from '..';

let mainGuildCache: Guild | undefined;
export const getMainGuild = async () => {
  if (mainGuildCache) return mainGuildCache;

  mainGuildCache = await client.guilds.fetch(process.env.MAIN_SERVER_ID!);

  return mainGuildCache;
};
