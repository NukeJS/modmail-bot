import { defineEmbed, defineCommand } from '../utils';

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

    await message.reply(existingSnippet.content);
  },
);
