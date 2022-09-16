import { defineEmbed, defineCommand, getUserByMentionOrId, sendDirectMessage } from '../utils';

export default defineCommand(
  'block',
  {
    description:
      'Block a user from using the bot.\n\nCan also be used inside of a ticket without specifying a user to block the user that created the ticket.',
    usage: ['(user)', '(user id)'],
    // examples: ['@Nuke#9476', '237878725130059777'],
  },
  async ({ prisma, client, message, args, ticket }) => {
    const user = await getUserByMentionOrId({ message, args, ticket });
    if (!user) {
      await message.reply({
        embeds: [
          defineEmbed('User not found.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const existingBlockedUser = client.blockedUsers.find(
      (blockedUser) => blockedUser.userId === user?.id || blockedUser.userId === ticket?.userId,
    );
    if (existingBlockedUser) {
      await message.reply({
        embeds: [
          defineEmbed('User is already blocked.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const blockedUser = await prisma.blockedUser.create({
      data: {
        userId: user?.id || ticket!.userId,
      },
    });
    client.blockedUsers.set(blockedUser.id, blockedUser);

    if (ticket) {
      await Promise.all([
        sendDirectMessage(message, user, {
          embeds: [
            defineEmbed("You've been blocked.", {
              title: 'Ticket Closed',
              type: 'info',
            }),
          ],
        }),
        message.channel.delete(),
      ]);
    }
    await message.reply({
      embeds: [
        defineEmbed('User has been blocked', {
          type: 'success',
        }),
      ],
    });
  },
);
