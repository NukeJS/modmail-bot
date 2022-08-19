import type { Command } from '../types/command';
import { createSimpleEmbed, sendDirectMessage } from '../utils';

const closeCommand: Command = {
  name: 'close',
  aliases: ['c'],
  description: 'Close the ticket where the command is used.',
  permissions: {
    ticketChannelOnly: true,
    allowInArchivedTicketChannel: true,
  },
  run: async ({ client, message, ticket }) => {
    if (!ticket) return;

    const user = await client.users.fetch(ticket.userId);

    await message.reply({
      embeds: [
        createSimpleEmbed('Closing ticket...', {
          type: 'info',
        }),
      ],
    });
    await Promise.all([
      message.channel.delete(),
      !ticket.isArchived &&
        sendDirectMessage(message, user, {
          embeds: [
            createSimpleEmbed('Feel free to open a new one by sending me a message.', {
              title: 'Ticket Closed',
              type: 'info',
            }),
          ],
        }),
    ]);
  },
};

export default closeCommand;
