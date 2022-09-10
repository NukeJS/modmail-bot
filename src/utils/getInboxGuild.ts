import type { Guild } from 'discord.js';
import { client } from '..';

let inboxGuildCache: Guild | undefined;
export const getInboxGuild = async () => {
  if (inboxGuildCache) return inboxGuildCache;

  inboxGuildCache = await client.guilds.fetch(process.env.INBOX_SERVER_ID!);

  return inboxGuildCache;
};
