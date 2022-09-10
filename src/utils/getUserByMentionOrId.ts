import type { Ticket } from '@prisma/client';
import type { Message } from 'discord.js';

export const getUserByMentionOrId = async ({
  message,
  args,
  ticket,
}: {
  message: Message;
  args: string[];
  ticket?: Ticket;
}) => {
  if (!args.length && !ticket) return;
  if (args.length) {
    return message.mentions.users.first() || message.client.users.fetch(args[0]).catch(() => null);
  }
  if (ticket) return message.client.users.fetch(ticket.userId);
  return undefined;
};
