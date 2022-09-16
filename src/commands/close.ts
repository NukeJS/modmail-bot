import { defineEmbed, defineCommand, sendDirectMessage } from '../utils';

export default defineCommand(
  ['close', 'c'],
  {
    description: 'Close the ticket where the command is used.',
    permissions: {
      ticketOnly: true,
      archivedTicketAllowed: true,
    },
  },
  async ({ client, message, ticket }) => {
    if (!ticket) return;

    const user = await client.users.fetch(ticket.userId);

    await message.reply({
      embeds: [
        defineEmbed('Closing ticket...', {
          type: 'info',
        }),
      ],
    });

    await Promise.all([
      message.channel.delete(),
      !ticket.isArchived &&
        sendDirectMessage(message, user, {
          embeds: [
            defineEmbed('Feel free to open a new one by sending me a message.', {
              title: 'Ticket Closed',
              type: 'info',
            }),
          ],
        }),
    ]);
  },
);
