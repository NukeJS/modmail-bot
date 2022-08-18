import type { APIEmbed } from 'discord.js';
import { Colors } from '../constants';
import type { Command } from '../types/command';
import { createSimpleEmbed } from '../utils';

const helpCommand: Command = {
  name: 'help',
  aliases: ['?'],
  description: 'Lists all commands or information about a specific command.',
  usages: ['(command)'],
  examples: ['snippets'],
  run: async ({ client, message, args: [commandName] }) => {
    if (!commandName?.length) {
      await message.reply({
        embeds: [
          createSimpleEmbed(client.commands.map((_command) => `\`${_command.name}\``).join(', '), {
            title: 'Available Commands',
            type: 'info',
            footer: {
              text: `Type ${process.env.PREFIX}help (command) for more information.`,
            },
          }),
        ],
      });
      return;
    }

    const command =
      client.commands.get(commandName.toLowerCase()) ||
      client.commands.get(client.aliases.get(commandName.toLowerCase())!);
    if (!command) {
      await message.reply({
        embeds: [
          createSimpleEmbed("A command with that name or alias doesn't exist.", {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const commandEmbed: APIEmbed = {
      color: Colors.INFO,
      title: `${process.env.PREFIX}${command.name}`,
      fields: [],
      footer: {
        text: '<> = Required, () = Optional',
      },
    };

    let description = `${command.description}\n`;
    if (command.permissions?.ticketChannelOnly) {
      description += '**Note**: This command can only be used inside of a ticket.\n';
    }
    commandEmbed.description = description;

    if (command.aliases?.length) {
      commandEmbed.fields?.push({
        name: 'Aliases',
        value: command.aliases.map((_alias) => `\`${process.env.PREFIX}${_alias}\``).join(', '),
      });
    }

    commandEmbed.fields?.push({
      name: 'Usage',
      value: [
        !command.argsRequired && `\`${process.env.PREFIX}${command.name}\``,
        command.usages?.length &&
          command.usages
            ?.map((_usage) => `\`${process.env.PREFIX}${command.name} ${_usage}\``)
            .join('\n'),
      ]
        .filter(Boolean)
        .join('\n'),
    });

    if (command.examples?.length) {
      commandEmbed.fields?.push({
        name: 'Examples',
        value: [
          !command.argsRequired && `\`${process.env.PREFIX}${command.name}\``,
          command.examples
            .map((_example) => `\`${process.env.PREFIX}${command.name} ${_example}\``)
            .join('\n'),
        ]
          .filter(Boolean)
          .join('\n'),
      });
    }

    await message.reply({
      embeds: [commandEmbed],
    });
  },
};

export default helpCommand;
