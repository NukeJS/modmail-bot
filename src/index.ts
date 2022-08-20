import 'dotenv/config';
import { Partials } from 'discord.js';
import { ModmailClient } from './bot';
import { checkEnvironmentVariables } from './utils';

checkEnvironmentVariables();

export const client = new ModmailClient({
  partials: [Partials.Channel],
  intents: ['Guilds', 'GuildMessages', 'MessageContent', 'DirectMessages'],
});

client.login(process.env.TOKEN);
