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
   * If true, command can't be used
   */
  disabled?: boolean;
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
