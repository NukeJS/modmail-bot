import type { Ticket } from '@prisma/client';
import type { Message } from 'discord.js';

export interface Options {
  message: Message;
  args: string[];
  ticket?: Ticket;
}

export const getUserByMentionOrId = async ({ message, args, ticket }: Options) => {
  if (!args.length && !ticket) return;
  if (args.length) {
    return message.mentions.users.first() || message.client.users.fetch(args[0]).catch(() => null);
  }
  if (ticket) return message.client.users.fetch(ticket.userId);
  return undefined;
};
