import type { Ticket } from '@prisma/client';
import type { Message } from 'discord.js';
import type { ModmailClient } from '../bot';

export interface CommandContext {
  client: ModmailClient;
  message: Message;
  args: string[];
  ticket: Ticket | undefined;
}

export interface Command {
  /**
   * Name of the command
   */
  name: string;
  /**
   * Aliases of the command
   */
  aliases?: string[];
  /**
   * Description of the command
   */
  description: string;
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
  /**
   * Run function
   */
  run: (context: CommandContext) => Promise<void> | void;
}
