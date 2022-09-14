import { createSimpleEmbed, defineCommand, sendDirectMessage } from '../utils';

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
          createSimpleEmbed('A name must be provided.', {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const snippet = client.snippets.find((_snippet) => _snippet.name === name);
    if (!snippet) {
      await message.reply({
        embeds: [
          createSimpleEmbed("A snippet with that name doesn't exist.", {
            type: 'danger',
          }),
        ],
      });
      return;
    }

    const user = await client.users.fetch(ticket.userId);
    if (!user) return;

    await Promise.all([
      sendDirectMessage(message, user, snippet.content),
      message.channel.send(snippet.content),
    ]);
  },
);
