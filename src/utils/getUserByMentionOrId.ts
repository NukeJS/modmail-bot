import type { Message } from 'discord.js';

export const getUserByMentionOrId = async (message: Message, args: string[]) => {
  if (!args.length) return;

  return message.mentions.users.first() || message.client.users.fetch(args[0]);
};
