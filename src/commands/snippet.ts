import { defineCommand, sendDirectMessage, createErrorEmbed } from '../utils';

export default defineCommand(
  ['snippet', 's'],
  {
    description: 'Sends the content of the specified snippet to the user.',
    usage: ['<name>'],
    // examples: ['test'],
    permissions: {
      ticketOnly: true,
    },
  },
  async ({ client, message, args: [name], ticket }) => {
    if (!ticket) return;

    if (!name?.length) {
      await message.reply({
        embeds: [createErrorEmbed().setDescription('A name must be provided.')],
      });
      return;
    }

    const existingSnippet = client.snippets.find((snippet) => snippet.name === name);
    if (!existingSnippet) {
      await message.reply({
        embeds: [createErrorEmbed().setDescription("A snippet with that name doesn't exist.")],
      });
      return;
    }

    const user = await client.users.fetch(ticket.userId);
    if (!user) return;

    await Promise.all([
      sendDirectMessage(message, user, existingSnippet.content),
      message.channel.send(existingSnippet.content),
    ]);
  },
);
