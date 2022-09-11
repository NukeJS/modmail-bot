import { TextChannel } from 'discord.js';
import { prisma } from '../db';
import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed, sendDirectMessage } from '../utils';

export const meta: CommandMeta = {
  name: 'archive',
  description: 'Archive the ticket where the command is used.',
  permissions: {
    ticketChannelOnly: true,
  },
};

export const run: CommandRunFunction = async ({ client, message, ticket }) => {
  if (!ticket) return;

  const user = await client.users.fetch(ticket.userId);
  const channel = await client.channels.fetch(ticket.channelId);

  const [archivedTicket] = await Promise.all([
    prisma.ticket.update({
      data: {
        isArchived: true,
      },
      where: {
        id: ticket.id,
      },
    }),
    channel instanceof TextChannel && channel.setParent(process.env.ARCHIVED_TICKETS_CATEGORY_ID!),
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
};
