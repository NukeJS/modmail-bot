import type { Ticket } from '@prisma/client';
import type { Message } from 'discord.js';
import type { ModmailClient } from '../bot';

export type CommandRunFunction = (context: {
  client: ModmailClient;
  message: Message;
  args: string[];
  prisma: typeof import('../db').prisma;
  ticket: Ticket | undefined;
}) => Promise<void> | void;

export interface CommandMeta {
  description?: string;
  usage?: string[];
  permissions?: {
    ticketOnly?: boolean;
    archivedTicketAllowed?: boolean;
  };
}

export interface Command {
  meta: { name: string | string[] } & CommandMeta;
  run: CommandRunFunction;
}
