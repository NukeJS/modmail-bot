import { defineEmbed, defineCommand, getUserByMentionOrId } from '../utils';

export default defineCommand(
  'blocked',
  {
    description:
      'Lists all blocked user IDs, or displays whether or not the given user is blocked.',
    usage: ['(user)', '(user id)'],
  },
  async ({ client, message, args }) => {
    const user = await getUserByMentionOrId({ message, args });
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

    if (user) {
      await message.reply({
        embeds: [
          defineEmbed(
            client.blockedUsers.find((blockedUser) => blockedUser.userId === user.id)
              ? 'User is blocked.'
              : 'User is not blocked.',
            {
              type: 'info',
            },
          ),
        ],
      });
      return;
    }

    await message.reply({
      embeds: [
        defineEmbed(
          client.blockedUsers.map((blockedUser) => `\`${blockedUser.userId}\``).join(', ') ||
            'No blocked users.',
          {
            title: `Blocked Users (${client.blockedUsers.size})`,
            type: 'info',
          },
        ),
      ],
    });
  },
);
