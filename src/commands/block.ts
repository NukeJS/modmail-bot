import { prisma } from '../db';
import type { Command } from '../types/command';
import { getUserByMentionOrId } from '../utils';

const blockCommand: Command = {
  name: 'block',
  run: async ({ client, message, args, ticket }) => {
    const user = await getUserByMentionOrId(message, args);
    if (!ticket && !user) {
      await message.reply('User not found.');
      return;
    }

    const existingBlockedUser = client.blockedUsers.find(
      (_blockedUser) => _blockedUser.userId === user?.id || _blockedUser.userId === ticket?.userId,
    );
    if (existingBlockedUser) {
      await message.reply('User is already blocked.');
      return;
    }

    const blockedUser = await prisma.blockedUser.create({
      data: {
        userId: user!.id,
      },
    });
    client.blockedUsers.set(blockedUser.id, blockedUser);

    if (ticket) {
      await Promise.all([
        user?.send("**TICKET CLOSED**\nYou've been blocked."),
        message.channel.delete(),
      ]);
    }
  },
};

export default blockCommand;
