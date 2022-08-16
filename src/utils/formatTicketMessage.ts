import type { Message } from 'discord.js';

export const formatTicketMessage = (message: Message) =>
  `**${message.author.tag}**: ${message.content}`;
