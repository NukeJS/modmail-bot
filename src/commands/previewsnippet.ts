import { createSimpleEmbed, defineCommand } from '../utils';

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

    await message.reply(snippet.content);
  },
);
