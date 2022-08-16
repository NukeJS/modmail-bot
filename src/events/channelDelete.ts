import { DMChannel, GuildChannel } from 'discord.js';
import type { ModmailClient } from '../bot';
import { prisma } from '../db';

const onChannelDelete = async (client: ModmailClient, channel: DMChannel | GuildChannel) => {
  if (!(channel instanceof GuildChannel)) return;
  if (channel.guildId !== client.inboxGuild.id) return;

  const ticket = client.tickets.find((_ticket) => _ticket.channelId === channel.id);
  if (!ticket) return;

  await prisma.ticket.delete({
    where: {
      id: ticket.id,
    },
  });
  client.tickets.delete(ticket.id);
};

export default onChannelDelete;
