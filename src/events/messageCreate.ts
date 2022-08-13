import { DMChannel, Message } from 'discord.js';
import type { ModmailClient } from '../bot';

const onMessageCreate = (client: ModmailClient, message: Message) => {
  if (message.author.bot || message.guildId === process.env.MAIN_SERVER_ID) return;

  if (message.channel instanceof DMChannel) {
    // Is DM, handle this
  }
};

export default onMessageCreate;
