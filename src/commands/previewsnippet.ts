import { defineCommand, createErrorEmbed } from '../utils';

export default defineCommand(
  ['previewsnippet', 'ps'],
  {
    description: 'Preview a snippet without sending it to the user.',
    usage: ['<name>'],
    // examples: ['test'],
  },
  async ({ client, message, args: [name] }) => {
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

    await message.reply(existingSnippet.content);
  },
);
