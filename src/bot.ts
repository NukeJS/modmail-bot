import type { BlockedUser, Ticket } from '@prisma/client';
import { Client, ClientOptions, Collection, Guild } from 'discord.js';
import fs from 'fs-extra';
import { prisma } from './db';
import type { Command } from './types/command';
import { getInboxGuild } from './utils';

export class ModmailClient extends Client {
  commands: Collection<string, Command>;
  aliases: Collection<string, string>;
  tickets: Collection<Ticket['id'], Ticket>;
  blockedUsers: Collection<BlockedUser['id'], BlockedUser>;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  inboxGuild: Guild;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.aliases = new Collection();
    this.tickets = new Collection();
    this.blockedUsers = new Collection();

    this.init();
    this.loadCommands();
    this.loadEvents();
  }

  private async loadCommands() {
    const commandFiles = (await fs.readdir(`${__dirname}/commands`)).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts'),
    );
    commandFiles.forEach(async (commandFile) => {
      const commandImport = await import(`./commands/${commandFile}`);
      if (!commandImport) return;

      const command: Command = commandImport.default;
      this.commands.set(command.name || commandFile.split('.')[0], command);

      if (command.aliases) {
        command.aliases.forEach((alias) => this.aliases.set(alias, command.name));
      }
    });
  }

  private async loadEvents() {
    const eventFiles = (await fs.readdir(`${__dirname}/events`)).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts'),
    );
    eventFiles.forEach(async (eventFile) => {
      const eventImport = await import(`./events/${eventFile}`);
      if (!eventImport) return;

      const event = eventImport.default;
      const eventName = eventFile.split('.')[0];
      this.on(eventName, event.bind(null, this));
    });
  }

  private async init() {
    this.on('ready', () => {
      const inboxGuild = getInboxGuild();
      if (!inboxGuild) {
        throw new Error('Bot is not inside of inbox guild.');
      }

      this.inboxGuild = inboxGuild;
    });

    const tickets = await prisma.ticket.findMany();
    // eslint-disable-next-line no-param-reassign
    this.tickets = new Collection(tickets.map((ticket) => [ticket.id, ticket]));

    const blockedUsers = await prisma.blockedUser.findMany();
    // eslint-disable-next-line no-param-reassign
    this.blockedUsers = new Collection(
      blockedUsers.map((blockedUser) => [blockedUser.id, blockedUser]),
    );
  }
}
