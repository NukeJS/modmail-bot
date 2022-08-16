import type { Message } from 'discord.js';

export const getMentionedUserOrId = (message: Message, args: string[]) =>
  message.mentions.users.first() || message.client.users.cache.get(args[0]);
