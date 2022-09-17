import { defineCommand, getUserByMentionOrId, createErrorEmbed, createInfoEmbed } from '../utils';

export default defineCommand(
  ['blocked', 'blacklisted'],
  {
    description:
      'Lists all blocked user IDs, or displays whether or not the given user is blocked.',
    usage: ['(user)', '(user id)'],
  },
  async ({ client, message, args }) => {
    const user = await getUserByMentionOrId({ message, args });
    if (args.length && !user) {
      await message.reply({
        embeds: [createErrorEmbed().setDescription('User not found.')],
      });
      return;
    }

    if (user) {
      await message.reply({
        embeds: [
          createInfoEmbed().setDescription(
            client.blockedUsers.find((blockedUser) => blockedUser.userId === user.id)
              ? 'User is blocked.'
              : 'User is not blocked.',
          ),
        ],
      });
      return;
    }

    await message.reply({
      embeds: [
        createInfoEmbed()
          .setTitle(`Blocked Users (${client.blockedUsers.size})`)
          .setDescription(
            client.blockedUsers.map((blockedUser) => `\`${blockedUser.userId}\``).join(', ') ||
              'No blocked users.',
          ),
      ],
    });
  },
);
