import type { Client, Message } from 'discord.js';

export interface CommandContext {
  client: Client;
  message: Message;
  args: string[];
}

export interface Command {
  name: string;
  aliases?: string[];
  run: (context: CommandContext) => Promise<void> | void;
}
