import { formatDistance } from 'date-fns';
import { Colors } from 'discord.js';
import type { Command } from '../types/command';

const userCommand: Command = {
  name: 'user',
  aliases: ['u'],
  permissions: {
    ticketChannelOnly: true,
  },
  run: async ({ client, message, ticket }) => {
    if (!ticket) return;

    const user = await client.users.fetch(ticket.userId);
    if (!user) return;

    await message.reply({
      embeds: [
        {
          color: Colors.Blurple,
          author: {
            icon_url: user.avatarURL({ size: 32 }) || undefined,
            name: user.tag,
          },
          fields: [
            {
              name: 'User ID',
              value: `\`${user.id}\``,
            },
            {
              name: 'Account Created',
              value: formatDistance(new Date(user.createdTimestamp), new Date(), {
                addSuffix: true,
                includeSeconds: true,
              }),
            },
          ],
        },
      ],
    });
  },
};

export default userCommand;
