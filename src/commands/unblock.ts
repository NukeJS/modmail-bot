import { createSimpleEmbed, defineCommand, getUserByMentionOrId } from '../utils';

export default defineCommand(
  'unblock',
  {
    description: 'Unblock a user.',
    usage: ['<user>', '<user id>'],
    // examples: ['@Nuke#9476', '237878725130059777'],
  },
  async ({ prisma, client, message, args, ticket }) => {
    const user = await getUserByMentionOrId({ message, args, ticket });
    if (!user) {
      await message.reply({
        embeds: [
          createSimpleEmbed('User not found.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const existingBlockedUser = client.blockedUsers.find(
      (_blockedUser) => _blockedUser.userId === user?.id || _blockedUser.userId === ticket?.userId,
    );
    if (!existingBlockedUser) {
      await message.reply({
        embeds: [
          createSimpleEmbed('User is not blocked.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    await Promise.all([
      prisma.blockedUser.delete({
        where: {
          id: existingBlockedUser.id,
        },
      }),
      message.reply({
        embeds: [
          createSimpleEmbed('User has been unblocked.', {
            type: 'success',
          }),
        ],
      }),
    ]);
    client.blockedUsers.delete(existingBlockedUser.id);
  },
);
