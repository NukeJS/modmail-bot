import { TextChannel } from 'discord.js';
import { createSimpleEmbed, defineCommand, sendDirectMessage } from '../utils';

export default defineCommand(
  'archive',
  {
    description: 'Archive the ticket where the command is used.',
    permissions: {
      ticketOnly: true,
    },
  },
  async ({ prisma, client, message, ticket }) => {
    if (!ticket) return;

    const [user, channel] = await Promise.all([
      client.users.fetch(ticket.userId),
      client.channels.fetch(ticket.channelId),
    ]);

    const [archivedTicket] = await Promise.all([
      prisma.ticket.update({
        data: {
          isArchived: true,
        },
        where: {
          id: ticket.id,
        },
      }),
      channel instanceof TextChannel &&
        channel.setParent(process.env.ARCHIVED_TICKETS_CATEGORY_ID!),

      sendDirectMessage(message, user, {
        embeds: [
          createSimpleEmbed('Feel free to open a new one by sending me a message.', {
            title: 'Ticket Closed',
            type: 'info',
          }),
        ],
      }),
    ]);
    client.tickets.set(archivedTicket.id, archivedTicket);

    await message.reply({
      embeds: [
        createSimpleEmbed('You can no longer send messages to this user.', {
          title: 'Ticket Archived',
          type: 'success',
        }),
      ],
    });
  },
);
