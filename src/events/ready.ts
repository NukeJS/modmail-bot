import type { ModmailClient } from '../bot';
import { prisma } from '../db';
import { getInboxGuild } from '../utils';

const onReady = async (client: ModmailClient) => {
  const status = process.env.STATUS;
  if (status) {
    client.user?.setActivity(status);
  }

  const inboxGuild = await getInboxGuild();
  if (!inboxGuild) {
    throw new Error('Bot is not inside of inbox guild.');
  }
  // eslint-disable-next-line no-param-reassign
  client.inboxGuild = inboxGuild;

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
