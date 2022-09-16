import { defineCommand, sendDirectMessage, createInfoEmbed } from '../utils';

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
      embeds: [createInfoEmbed().setDescription('Closing ticket...')],
    });

    await Promise.all([
      message.channel.delete(),
      !ticket.isArchived &&
        sendDirectMessage(message, user, {
          embeds: [
            createInfoEmbed()
              .setTitle('Ticket Closed')
              .setDescription('Feel free to open a new one by sending me a message.'),
          ],
        }),
    ]);
  },
);
