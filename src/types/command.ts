import type { Ticket } from '@prisma/client';
import type { Message } from 'discord.js';
import type { ModmailClient } from '../bot';

export interface CommandMeta {
  /**
   * Name(s) of the command
   */
  name?: string | string[];
  /**
   * Description of the command
   */
  description?: string;
  /**
   * Usages of the command
   */
  usages?: string[];
  /**
   * Usage examples of the command
   */
  examples?: string[];
  /**
   * Whether or not arguments are required for the command
   */
  argsRequired?: boolean;
  /**
   * Permissions object
   */
  permissions?: {
    /**
     * If `true`, command can only be used inside a ticket channel
     */
    ticketChannelOnly?: boolean;
    allowInArchivedTicketChannel?: boolean;
  };
}

/**
 * Run function
 */
export type CommandRunFunction = (context: {
  client: ModmailClient;
  message: Message;
  args: string[];
  ticket: Ticket | undefined;
}) => Promise<void> | void;

export interface Command {
  meta: CommandMeta;
  run: CommandRunFunction;
}
