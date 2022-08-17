import { prisma } from '../db';
import type { Command } from '../types/command';
import { createSimpleEmbed } from '../utils';

const archiveCommand: Command = {
  name: 'archive',
  permissions: {
    ticketChannelOnly: true,
  },
  run: async ({ client, message, ticket }) => {
    if (!ticket) return;

    const user = await client.users.fetch(ticket.userId);

    const [archivedTicket] = await Promise.all([
      prisma.ticket.update({
        data: {
          isArchived: true,
        },
        where: {
          id: ticket.id,
        },
      }),
      user?.send({
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
        createSimpleEmbed('You can no longer send messages to the user.', {
          title: 'Ticket Archived',
          type: 'success',
        }),
      ],
    });
  },
};

export default archiveCommand;
