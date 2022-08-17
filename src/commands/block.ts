import { prisma } from '../db';
import type { Command } from '../types/command';
import { createSimpleEmbed, getUserByMentionOrId } from '../utils';

const blockCommand: Command = {
  name: 'block',
  run: async ({ client, message, args, ticket }) => {
    const user = await getUserByMentionOrId({ message, args, ticket });
    if (!ticket && !user) {
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
        user?.send({
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
  },
};

export default blockCommand;
