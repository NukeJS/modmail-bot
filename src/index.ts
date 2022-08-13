import 'dotenv/config';
import { ModmailClient } from './bot';

export const client = new ModmailClient({
  intents: ['Guilds', 'GuildMessages', 'MessageContent', 'DirectMessages'],
});

client.login(process.env.TOKEN);
