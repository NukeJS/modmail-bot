import type { APIEmbed } from 'discord.js';
import { Colors } from '../constants';
import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed } from '../utils';

export const meta: CommandMeta = {
  name: 'help',
  aliases: ['?'],
  description: 'Lists all commands or information about a specific command.',
  usages: ['(command)'],
  examples: ['snippets'],
};

export const run: CommandRunFunction = async ({ client, message, args: [commandName] }) => {
  if (!commandName?.length) {
    await message.reply({
      embeds: [
        createSimpleEmbed(
          client.commands.map((_command) => `\`${_command.meta.name}\``).join(', '),
          {
            title: 'Available Commands',
            type: 'info',
            footer: {
              text: `Type ${process.env.PREFIX}help (command) for more information about that specific command.`,
            },
          },
        ),
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
    title: `${process.env.PREFIX}${command.meta.name}`,
    fields: [],
    footer: {
      text: '<> = Required, () = Optional',
    },
  };

  let description = `${command.meta.description}\n`;
  if (command.meta.permissions?.ticketChannelOnly) {
    description += '- This command can only be used inside of a ticket.\n';
  }
  if (command.meta.permissions?.allowInArchivedTicketChannel) {
    description += '- This command can be used inside of an archived ticket.\n';
  }
  commandEmbed.description = description;

  if (command.meta.aliases?.length) {
    commandEmbed.fields?.push({
      name: 'Aliases',
      value: command.meta.aliases.map((_alias) => `\`${process.env.PREFIX}${_alias}\``).join(', '),
    });
  }

  commandEmbed.fields?.push({
    name: 'Usage',
    value: [
      !command.meta.argsRequired && `\`${process.env.PREFIX}${command.meta.name}\``,
      command.meta.usages?.length &&
        command.meta.usages
          ?.map((_usage) => `\`${process.env.PREFIX}${command.meta.name} ${_usage}\``)
          .join('\n'),
    ]
      .filter(Boolean)
      .join('\n'),
  });

  if (command.meta.examples?.length) {
    commandEmbed.fields?.push({
      name: 'Example',
      value: [
        !command.meta.argsRequired && `\`${process.env.PREFIX}${command.meta.name}\``,
        command.meta.examples
          .map((_example) => `\`${process.env.PREFIX}${command.meta.name} ${_example}\``)
          .join('\n'),
      ]
        .filter(Boolean)
        .join('\n'),
    });
  }

  await message.reply({
    embeds: [commandEmbed],
  });
};
