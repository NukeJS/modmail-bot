import { prisma } from '../db';
import type { Command } from '../types/command';
import { getMentionedUserOrId } from '../utils';

const unblock: Command = {
  name: 'unblock',
  run: async ({ client, message, args, ticket }) => {
    const user = getMentionedUserOrId(message, args);
    if (args.length && !user) {
      await message.reply('User not found.');
      return;
    }

    const blockedUser = client.blockedUsers.find(
      (_blockedUser) => _blockedUser.userId === user?.id || _blockedUser.userId === ticket?.userId,
    );
    if (!blockedUser) {
      await message.reply('User is not blocked.');
      return;
    }

    await Promise.all([
      prisma.blockedUser.delete({
        where: {
          id: blockedUser.id,
        },
      }),
      message.reply('User has been unblocked.'),
    ]);
    client.blockedUsers.delete(blockedUser.id);
  },
};

export default unblock;
