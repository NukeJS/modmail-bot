import type { APIEmbed } from 'discord.js';
import { Colors } from '../constants';
import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed, getCommandAliases, getCommandName, prefixed } from '../utils';

export const meta: CommandMeta = {
  name: ['help', 'h', '?'],
  description: 'Lists all commands or information about a specific command.',
  usages: ['(command)'],
  examples: ['snippets'],
};

export const run: CommandRunFunction = async ({ client, message, args: [name] }) => {
  if (!name?.length) {
    await message.reply({
      embeds: [
        createSimpleEmbed(
          client.commands.map((command) => `\`${getCommandName(command)}\``).join(', '),
          {
            title: 'Available Commands',
            type: 'info',
            footer: {
              text: `Type ${prefixed(
                'help',
              )} (command) for more information about that specific command.`,
            },
          },
        ),
      ],
    });
    return;
  }

  const command =
    client.commands.get(name.toLowerCase()) ||
    client.commands.get(client.aliases.get(name.toLowerCase())!);
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

  const commandName = getCommandName(command);
  const commandEmbed: APIEmbed = {
    color: Colors.INFO,
    title: `${prefixed(commandName)}`,
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

  const aliases = getCommandAliases(command);
  if (aliases) {
    commandEmbed.fields?.push({
      name: 'Aliases',
      value: aliases.map((alias) => `\`${prefixed(alias)}\``).join(', '),
    });
  }

  commandEmbed.fields?.push({
    name: 'Usage',
    value: [
      !command.meta.argsRequired && `\`${prefixed(commandName)}\``,
      command.meta.usages?.length &&
        command.meta.usages?.map((usage) => `\`${prefixed(commandName)} ${usage}\``).join('\n'),
    ]
      .filter(Boolean)
      .join('\n'),
  });

  if (command.meta.examples?.length) {
    commandEmbed.fields?.push({
      name: 'Example',
      value: [
        !command.meta.argsRequired && `\`${prefixed(commandName)}\``,
        command.meta.examples
          .map((example) => `\`${prefixed(commandName)} ${example}\``)
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
