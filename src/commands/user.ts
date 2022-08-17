import { formatDistance } from 'date-fns';
import { Colors } from 'discord.js';
import type { Command } from '../types/command';
import { createSimpleEmbed, getUserByMentionOrId } from '../utils';

const userCommand: Command = {
  name: 'user',
  aliases: ['u'],
  run: async ({ message, args, ticket }) => {
    let user = await getUserByMentionOrId({ message, args, ticket });
    if (args.length && !user) {
      await message.reply({
        embeds: [
          createSimpleEmbed('User not found.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    if (!user) {
      user = message.author;
    }

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
