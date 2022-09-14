import type { ModmailClient } from '../bot';
import { prisma } from '../db';
import { getInboxGuild, getMainGuild } from '../utils';

const onReady = async (client: ModmailClient) => {
  const status = process.env.STATUS;
  if (status) {
    client.user?.setActivity(status);
  }

  const [mainGuild, inboxGuild] = await Promise.all([getMainGuild(), getInboxGuild()]);
  if (!mainGuild || !inboxGuild) {
    throw new Error('Bot is not inside of main guild or inbox guild.');
  }
  client.mainGuild = mainGuild;
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

  console.log('Bot is ready!');
};

export default onReady;
