import { defineCommand, getUserByMentionOrId, createErrorEmbed } from '../utils';

export default defineCommand(
  ['userid', 'uid'],
  {
    description: `Lists the ID of the specified user.
      Can also be used inside of a ticket without specifying a user to list the ID of the user that created the ticket.`,
    usage: ['(user)'],
    // examples: ['@Nuke#9476'],
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

    await message.reply(`${user.id}`);
  },
);
