import {
  defineCommand,
  getCommandAliases,
  getCommandName,
  prefixed,
  createInfoEmbed,
  createErrorEmbed,
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
          createInfoEmbed()
            .setTitle('Available Commands')
            .setDescription(
              client.commands.map((command) => `\`${getCommandName(command)}\``).join(', '),
            )
            .setFooter({
              text: `Type ${prefixed(
                'help',
              )} (command) for more information about a specific command.`,
            }),
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
          createErrorEmbed().setDescription("A command with that name or alias doesn't exist."),
        ],
      });
      return;
    }

    const prefixedCommandName = prefixed(getCommandName(command));

    const commandEmbed = createInfoEmbed()
      .setTitle(prefixedCommandName)
      .setDescription(
        [
          `${command.meta.description}\n`,
          command.meta.permissions?.ticketOnly &&
            '- This command can only be used inside of a ticket.',
          command.meta.permissions?.archivedTicketAllowed &&
            '- This command can be used inside of an archived ticket.',
        ]
          .filter(Boolean)
          .join('\n'),
      )
      .setFooter({ text: '<> = Required, () = Optional' });

    const aliases = getCommandAliases(command);
    if (aliases?.length) {
      commandEmbed.addFields({
        name: 'Aliases',
        value: aliases.map((alias) => `\`${prefixed(alias)}\``).join(', '),
      });
    }

    if (command.meta.usage?.length) {
      commandEmbed.addFields({
        name: 'Usage',
        value: command.meta.usage
          .map((usage) => `\`${`${prefixedCommandName} ${`${usage}`}`.trim()}\``)
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
