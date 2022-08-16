import type { ModmailClient } from '../bot';
import { prisma } from '../db';

const onReady = async (client: ModmailClient) => {
  const status = process.env.STATUS;
  if (status) {
    client.user?.setActivity(status);
  }

  const deletedTickets = client.tickets.filter(
    ({ channelId }) => !client.inboxGuild.channels.cache.get(channelId),
  );
  // eslint-disable-next-line no-param-reassign
  client.tickets = client.tickets.filter(
    ({ channelId }) => !!client.inboxGuild.channels.cache.get(channelId),
  );
  await prisma.ticket.deleteMany({
    where: {
      channelId: {
        in: deletedTickets.map(({ channelId }) => channelId),
      },
    },
  });
};

export default onReady;
