import type { Command } from '../types/command';
import { createSimpleEmbed } from '../utils';

const closeCommand: Command = {
  name: 'close',
  aliases: ['c'],
  permissions: {
    ticketChannelOnly: true,
  },
  run: async ({ client, message, ticket }) => {
    if (!ticket) return;

    const user = await client.users.fetch(ticket.userId);
    if (!user) return;

    await message.reply({
      embeds: [
        createSimpleEmbed('Closing ticket...', {
          type: 'info',
        }),
      ],
    });
    await Promise.all([
      user.send({
        embeds: [
          createSimpleEmbed('Feel free to open a new one by sending me a message.', {
            title: 'Ticket Closed',
            type: 'info',
          }),
        ],
      }),
      message.channel.delete(),
    ]);
  },
};

export default closeCommand;
