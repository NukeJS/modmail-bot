import type { APIEmbed } from 'discord.js';
import { Colors } from '../constants';
import {
  createSimpleEmbed,
  defineCommand,
  getCommandAliases,
  getCommandName,
  prefixed,
} from '../utils';

export default defineCommand(
  ['help', 'h', '?'],
  {
    description: 'Lists all commands or information about a specific command.',
    usage: ['(command)'],
    // examples: ['snippets'],
  },
  async ({ client, message, args: [name] }) => {
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
                )} (command) for more information about a specific command.`,
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

    const prefixedCommandName = prefixed(getCommandName(command));

    const commandEmbed: APIEmbed = {
      color: Colors.INFO,
      title: `${prefixedCommandName}`,
      fields: [],
      footer: {
        text: '<> = Required, () = Optional',
      },
    };

    const description = [
      command.meta.description,
      command.meta.permissions?.ticketOnly && '- This command can only be used inside of a ticket.',
      command.meta.permissions?.archivedTicketAllowed &&
        '- This command can be used inside of an archived ticket.',
    ].filter(Boolean);
    if (description.length) {
      commandEmbed.description = description.join('\n');
    }

    const aliases = getCommandAliases(command);
    if (aliases?.length) {
      commandEmbed.fields?.push({
        name: 'Aliases',
        value: aliases.map((alias) => `\`${prefixed(alias)}\``).join(', '),
      });
    }

    if (command.meta.usage?.length) {
      commandEmbed.fields?.push({
        name: 'Usage',
        value: command.meta.usage
          .map((usage) => `\`${`${prefixedCommandName}${` ${usage}`.trim()}`}\``)
          .join('\n'),
      });
    }

    // if (command.meta.examples?.length) {
    //   commandEmbed.fields?.push({
    //     name: 'Example',
    //     value: [
    //       !command.meta.argsRequired && `\`${prefixedCommandName}\``,
    //       command.meta.examples
    //         .map((example) => `\`${prefixedCommandName} ${example}\``)
    //         .join('\n'),
    //     ]
    //       .filter(Boolean)
    //       .join('\n'),
    //   });
    // }

    await message.reply({
      embeds: [commandEmbed],
    });
  },
);
