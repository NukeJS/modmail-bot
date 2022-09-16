import { defineEmbed, defineCommand, sendDirectMessage } from '../utils';

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
        embeds: [
          defineEmbed('A name must be provided.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const existingSnippet = client.snippets.find((snippet) => snippet.name === name);
    if (!existingSnippet) {
      await message.reply({
        embeds: [
          defineEmbed("A snippet with that name doesn't exist.", {
            type: 'danger',
          }),
        ],
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
