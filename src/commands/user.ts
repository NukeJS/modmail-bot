import { formatDistance } from 'date-fns';
import { Colors } from 'discord.js';
import { defineEmbed, defineCommand, getUserByMentionOrId } from '../utils';

export default defineCommand(
  ['user', 'u'],
  {
    description: `Lists information about the specified user.
      Can also be used inside of a ticket without specifying a user to list information about the user that created the ticket.`,
    usage: ['(user)', '(user id)'],
    // examples: ['@Nuke#9476', '237878725130059777'],
    permissions: {
      archivedTicketAllowed: true,
    },
  },
  async ({ message, args, ticket }) => {
    let user = await getUserByMentionOrId({ message, args, ticket });
    if (args.length && !user) {
      await message.reply({
        embeds: [
          defineEmbed('User not found.', {
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
  },
);
