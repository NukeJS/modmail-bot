import {
  createErrorEmbed,
  createInfoEmbed,
  createSuccessEmbed,
  defineCommand,
  getUserByMentionOrId,
  sendDirectMessage,
} from '../utils';

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
        embeds: [createErrorEmbed().setDescription('User not found.')],
      });
      return;
    }

    const existingBlockedUser = client.blockedUsers.find(
      (blockedUser) => blockedUser.userId === user?.id || blockedUser.userId === ticket?.userId,
    );
    if (existingBlockedUser) {
      await message.reply({
        embeds: [createErrorEmbed().setDescription('User is already blocked.')],
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
            createInfoEmbed().setTitle('Ticket Closed').setDescription("You've been blocked."),
          ],
        }),
        message.channel.delete(),
      ]);
    }
    await message.reply({
      embeds: [createSuccessEmbed().setDescription('User has been blocked')],
    });
  },
);
