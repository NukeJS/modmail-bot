import { prisma } from '../db';
import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed, getUserByMentionOrId, sendDirectMessage } from '../utils';

export const meta: CommandMeta = {
  name: 'block',
  description:
    'Block a user from using the bot.\n\nCan also be used inside of a ticket without specifying a user to block the user that created the ticket.',
  usages: ['(user)', '(user id)'],
  examples: ['@Nuke#9476', '237878725130059777'],
};

export const run: CommandRunFunction = async ({ client, message, args, ticket }) => {
  const user = await getUserByMentionOrId({ message, args, ticket });
  if (!user) {
    await message.reply({
      embeds: [
        createSimpleEmbed('User not found.', {
          type: 'danger',
        }),
      ],
    });
    return;
  }

  const existingBlockedUser = client.blockedUsers.find(
    (_blockedUser) => _blockedUser.userId === user?.id || _blockedUser.userId === ticket?.userId,
  );
  if (existingBlockedUser) {
    await message.reply({
      embeds: [
        createSimpleEmbed('User is already blocked.', {
          type: 'danger',
        }),
      ],
    });
    return;
  }

  const blockedUser = await prisma.blockedUser.create({
    data: {
      userId: user?.id || ticket!.userId,
    },
  });
  client.blockedUsers.set(blockedUser.id, blockedUser);

  if (ticket) {
    await Promise.all([
      sendDirectMessage(message, user, {
        embeds: [
          createSimpleEmbed("You've been blocked.", {
            title: 'Ticket Closed',
            type: 'info',
          }),
        ],
      }),
      message.channel.delete(),
    ]);
  }
};
