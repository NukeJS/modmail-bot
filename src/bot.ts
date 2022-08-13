import { Client, ClientOptions, Collection } from 'discord.js';
import * as fs from 'fs-extra';
import type { Command } from './types/command';

export class ModmailClient extends Client {
  private commands: Collection<string, Command>;
  private aliases: Collection<string, string>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.aliases = new Collection();

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
}
