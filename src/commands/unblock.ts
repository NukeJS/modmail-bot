import { prisma } from '../db';
import type { Command } from '../types/command';
import { createSimpleEmbed, getUserByMentionOrId } from '../utils';

const unblockCommand: Command = {
  name: 'unblock',
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
    if (!existingBlockedUser) {
      await message.reply({
        embeds: [
          createSimpleEmbed('User is not blocked.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    await Promise.all([
      prisma.blockedUser.delete({
        where: {
          id: existingBlockedUser.id,
        },
      }),
      message.reply({
        embeds: [
          createSimpleEmbed('User has been unblocked.', {
            type: 'success',
          }),
        ],
      }),
    ]);
    client.blockedUsers.delete(existingBlockedUser.id);
  },
};

export default unblockCommand;
