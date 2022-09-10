import type { ModmailClient } from '../bot';
import { prisma } from '../db';
import { getInboxGuild, getMainGuild } from '../utils';

const onReady = async (client: ModmailClient) => {
  const status = process.env.STATUS;
  if (status) {
    client.user?.setActivity(status);
  }

  const mainGuild = await getMainGuild();
  if (!mainGuild) {
    throw new Error('Bot is not inside of main guild.');
  }
  client.mainGuild = mainGuild;

  const inboxGuild = await getInboxGuild();
  if (!inboxGuild) {
    throw new Error('Bot is not inside of inbox guild.');
  }
  client.inboxGuild = inboxGuild;

  const deletedTickets = client.tickets.filter(
    ({ channelId }) => !client.inboxGuild.channels.cache.get(channelId),
  );

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
