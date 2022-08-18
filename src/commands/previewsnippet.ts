import type { Command } from '../types/command';
import { createSimpleEmbed } from '../utils';

const previewSnippetCommand: Command = {
  name: 'previewsnippet',
  aliases: ['ps'],
  description: 'Preview a snippet without sending it to the user.',
  argsRequired: true,
  usages: ['<name>'],
  examples: ['test'],
  run: async ({ client, message, args: [name] }) => {
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
};

export default previewSnippetCommand;
