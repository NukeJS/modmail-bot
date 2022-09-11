import { formatDistance } from 'date-fns';
import { Colors } from 'discord.js';
import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed, getUserByMentionOrId } from '../utils';

export const meta: CommandMeta = {
  name: 'user',
  description:
    'Lists information about the specified user.\n\nCan also be used inside of a ticket without specifying a user to list information about the user that created the ticket.',
  aliases: ['u'],
  usages: ['(user)', '(user id)'],
  examples: ['@Nuke#9476', '237878725130059777'],
  permissions: {
    allowInArchivedTicketChannel: true,
  },
};

export const run: CommandRunFunction = async ({ message, args, ticket }) => {
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
            inline: true,
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
};
