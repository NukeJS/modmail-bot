import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed } from '../utils';

export const meta: CommandMeta = {
  name: ['silentclose', 'sc'],
  description:
    "Silently close the ticket where the command is used.\nThis means the user won't receive a message about the ticket being closed.",
  permissions: {
    ticketChannelOnly: true,
    allowInArchivedTicketChannel: true,
  },
};

export const run: CommandRunFunction = async ({ message, ticket }) => {
  if (!ticket) return;

  await message.reply({
    embeds: [
      createSimpleEmbed('Closing ticket...', {
        type: 'info',
      }),
    ],
  });
  await message.channel.delete();
};
