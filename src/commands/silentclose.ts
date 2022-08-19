import type { Command } from '../types/command';
import { createSimpleEmbed } from '../utils';

const silentCloseCommand: Command = {
  name: 'silentclose',
  aliases: ['sc'],
  description:
    "Silently close the ticket where the command is used.\nThis means the user won't receive a message about the ticket being closed.",
  permissions: {
    ticketChannelOnly: true,
    allowInArchivedTicketChannel: true,
  },
  run: async ({ message, ticket }) => {
    if (!ticket) return;

    await message.reply({
      embeds: [
        createSimpleEmbed('Closing ticket...', {
          type: 'info',
        }),
      ],
    });
    await message.channel.delete();
  },
};

export default silentCloseCommand;
