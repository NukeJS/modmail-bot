import type { Guild } from 'discord.js';
import { client } from '..';

let inboxGuild: Guild | undefined;
export const getInboxGuild = () => {
  if (inboxGuild) return inboxGuild;

  inboxGuild = client.guilds.cache.get(process.env.INBOX_SERVER_ID!);

  return inboxGuild;
};
