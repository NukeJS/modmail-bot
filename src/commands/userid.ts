import type { CommandMeta, CommandRunFunction } from '../types';
import { createSimpleEmbed, getUserByMentionOrId } from '../utils';

export const meta: CommandMeta = {
  name: 'userid',
  description:
    'Lists the ID of the specified user.\n\nCan also be used inside of a ticket without specifying a user to list the ID of the user that created the ticket.',
  aliases: ['uid'],
  usages: ['(user)'],
  examples: ['@Nuke#9476'],
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

  await message.reply(`${user.id}`);
};
