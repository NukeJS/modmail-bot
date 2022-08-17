import type { Command } from '../types/command';

const previewSnippetCommand: Command = {
  name: 'previewsnippet',
  aliases: ['ps'],
  run: async ({ client, message, args: [name] }) => {
    if (!name.length) {
      await message.reply('A name must be provided.');
      return;
    }

    const snippet = client.snippets.find((_snippet) => _snippet.name === name);
    if (!snippet) {
      await message.reply("A snippet with that name doesn't exist.");
      return;
    }

    await message.reply(snippet.content);
  },
};

export default previewSnippetCommand;
