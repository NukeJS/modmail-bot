import { prisma } from '../db';
import type { Command } from '../types/command';

const deleteSnippetCommand: Command = {
  name: 'deletesnippet',
  aliases: ['-snippet', '-s'],
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

    await prisma.snippet.delete({
      where: {
        id: snippet.id,
      },
    });
    client.snippets.delete(snippet.id);
    await message.reply(`Snippet "${name}" has successfully been deleted.`);
  },
};

export default deleteSnippetCommand;
