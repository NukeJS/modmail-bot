import { prisma } from '../db';
import type { Command } from '../types/command';
import { getUserByMentionOrId } from '../utils';

const unblockCommand: Command = {
  name: 'unblock',
  run: async ({ client, message, args, ticket }) => {
    const user = await getUserByMentionOrId(message, args);
    if (!ticket && !user) {
      await message.reply('User not found.');
      return;
    }

    const existingBlockedUser = client.blockedUsers.find(
      (_blockedUser) => _blockedUser.userId === user?.id || _blockedUser.userId === ticket?.userId,
    );
    if (!existingBlockedUser) {
      await message.reply('User is not blocked.');
      return;
    }

    await Promise.all([
      prisma.blockedUser.delete({
        where: {
          id: existingBlockedUser.id,
        },
      }),
      message.reply('User has been unblocked.'),
    ]);
    client.blockedUsers.delete(existingBlockedUser.id);
  },
};

export default unblockCommand;
