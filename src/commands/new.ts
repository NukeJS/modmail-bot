import { ChannelType } from 'discord.js';
import {
  defineCommand,
  createSuccessEmbed,
  getUserByMentionOrId,
  createErrorEmbed,
} from '../utils';

export default defineCommand(
  'new',
  {
    description: 'Create a new ticket for the specified user.',
    usage: ['<user>', '<user id>'],
  },
  async ({ prisma, client, message, args }) => {
    const user = await getUserByMentionOrId({ message, args });
    if (!user) {
      await message.reply({
        embeds: [createErrorEmbed().setDescription('User not found.')],
      });
      return;
    }

    const existingBlockedUser = client.blockedUsers.find(
      (blockedUser) => blockedUser.userId === user.id,
    );
    if (existingBlockedUser) {
      await message.reply({
        embeds: [createErrorEmbed().setDescription('User is blocked.')],
      });
      return;
    }

    const existingTicket = client.tickets.find(
      (ticket) => ticket.userId === user.id && !ticket.isArchived,
    );
    if (existingTicket) {
      await message.reply({
        embeds: [
          createErrorEmbed().setDescription(
            `There's already an active ticket with this user in <#${existingTicket.channelId}>.`,
          ),
        ],
      });
      return;
    }

    const newTicketChannel = await client.inboxGuild.channels.create({
      name: `ticket-${user.id}`,
      type: ChannelType.GuildText,
      topic: `Ticket channel for user: "${user.tag}", ID: "${user.id}".`,
      reason: `Created ticket channel for user: "${user.tag}".`,
      parent: process.env.OPEN_TICKETS_CATEGORY_ID,
    });
    const ticket = await prisma.ticket.create({
      data: {
        userId: user.id,
        channelId: newTicketChannel.id,
      },
    });
    client.tickets.set(ticket.id, ticket);

    await message.reply({
      embeds: [
        createSuccessEmbed().setDescription(
          `Ticket for ${user.tag} has been created in <#${newTicketChannel.id}>.`,
        ),
      ],
    });
  },
);
