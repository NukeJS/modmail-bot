import type { Command } from '../types/command';

const close: Command = {
  name: 'close',
  aliases: ['c'],
  permissions: {
    ticketChannelOnly: true,
  },
  run: async ({ client, message, ticket }) => {
    if (!ticket) return;

    const user = client.users.cache.get(ticket.userId);
    if (!user) return;

    await message.reply('Closing ticket...');
    await Promise.all([
      user.send(
        '**TICKET CLOSED**\nThis ticket is now closed. Feel free to open a new one by sending me a message!',
      ),
      message.channel.delete(),
    ]);
  },
};

export default close;
