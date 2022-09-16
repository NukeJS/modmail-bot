import { formatDistance } from 'date-fns';
import { defineCommand, getUserByMentionOrId, createErrorEmbed, createInfoEmbed } from '../utils';

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
        embeds: [createErrorEmbed().setDescription('User not found.')],
      });
      return;
    }

    if (!user) {
      user = message.author;
    }

    await message.reply({
      embeds: [
        createInfoEmbed()
          .setAuthor({
            iconURL: user.avatarURL({ size: 32 }) || undefined,
            name: user.tag,
          })
          .setFields(
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
          ),
      ],
    });
  },
);
