import { prisma } from '../db';
import type { Command } from '../types/command';

const block: Command = {
  name: 'block',
  permissions: {
    ticketChannelOnly: true,
  },
  run: async ({ client, message, ticket }) => {
    if (!ticket) return;

    const user = client.users.cache.get(ticket.userId);
    if (!user) return;

    const [blockedUser] = await Promise.all([
      prisma.blockedUser.create({
        data: {
          userId: user.id,
        },
      }),
      user.send("**TICKET CLOSED**\nYou've been blocked."),
      message.channel.delete(),
    ]);
    client.blockedUsers.set(blockedUser.id, blockedUser);
  },
};

export default block;
