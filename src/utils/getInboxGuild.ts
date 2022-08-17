import type { Guild } from 'discord.js';
import { client } from '..';

let inboxGuild: Guild | undefined;
export const getInboxGuild = async () => {
  if (inboxGuild) return inboxGuild;

  inboxGuild = await client.guilds.fetch(process.env.INBOX_SERVER_ID!);

  return inboxGuild;
};
