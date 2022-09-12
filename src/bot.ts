import type { BlockedUser, Snippet, Ticket } from '@prisma/client';
import { Client, ClientOptions, Collection, Guild } from 'discord.js';
import fg from 'fast-glob';
import { prisma } from './db';
import type { Command } from './types/command';
import { getCommandAliases, getCommandName } from './utils';

export class ModmailClient extends Client {
  commands: Collection<string, Command>;
  aliases: Collection<string, string>;

  tickets: Collection<Ticket['id'], Ticket>;
  blockedUsers: Collection<BlockedUser['id'], BlockedUser>;
  snippets: Collection<Snippet['id'], Snippet>;

  // @ts-ignore
  inboxGuild: Guild;
  // @ts-ignore
  mainGuild: Guild;

  constructor(options: ClientOptions) {
    super(options);

    this.commands = new Collection();
    this.aliases = new Collection();

    this.tickets = new Collection();
    this.blockedUsers = new Collection();
    this.snippets = new Collection();

    this.init();
    this.loadCommands();
    this.loadEvents();
  }

  private async loadCommands() {
    const commandFiles = await fg(['src/commands/**/*.{js,ts}'], {
      objectMode: true,
      absolute: true,
    });

    commandFiles.forEach(async (commandFile) => {
      const command = (await import(commandFile.path)) as Command | undefined;
      if (!command) return;

      const commandName = getCommandName(command) || commandFile.name.split('.')[0];
      this.commands.set(commandName, command);

      getCommandAliases(command)?.forEach((alias) => this.aliases.set(alias, commandName));
    });
  }

  private async loadEvents() {
    const eventFiles = await fg(['src/events/**/*.{js,ts}'], {
      objectMode: true,
      absolute: true,
    });

    eventFiles.forEach(async (eventFile) => {
      const eventImport = await import(eventFile.path);
      if (!eventImport) return;

      const event = eventImport.default;
      const eventName = eventFile.name.split('.')[0];
      this.on(eventName, event.bind(null, this));
    });
  }

  private async init() {
    const tickets = await prisma.ticket.findMany();
    this.tickets = new Collection(tickets.map((ticket) => [ticket.id, ticket]));

    const blockedUsers = await prisma.blockedUser.findMany();
    this.blockedUsers = new Collection(
      blockedUsers.map((blockedUser) => [blockedUser.id, blockedUser]),
    );

    const snippets = await prisma.snippet.findMany();
    this.snippets = new Collection(snippets.map((snippet) => [snippet.id, snippet]));
  }
}
