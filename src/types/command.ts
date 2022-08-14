import type { Client, Message } from 'discord.js';

export interface CommandContext {
  client: Client;
  message: Message;
  args: string[];
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
     * If `true`, command can only be used in a thread
     */
    threadOnly?: boolean;
  };
  /**
   * Run function
   */
  run: (context: CommandContext) => Promise<void> | void;
}
