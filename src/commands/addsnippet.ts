import { prisma } from '../db';
import type { Command } from '../types/command';

const addSnippetCommand: Command = {
  name: 'addsnippet',
  aliases: ['+snippet', '+s'],
  run: async ({ client, message, args: [name, ...content] }) => {
    if (!name.length) {
      await message.reply('A snippet must have a name.');
      return;
    }
    if (!content.length) {
      await message.reply('A snippet must have content.');
      return;
    }

    const existingSnippet = client.snippets.find((_snippet) => _snippet.name === name);
    if (existingSnippet) {
      await message.reply('A snippet with that name already exists.');
      return;
    }

    const snippet = await prisma.snippet.create({
      data: {
        name,
        content: content.join(' '),
      },
    });
    client.snippets.set(snippet.id, snippet);
    await message.reply(`Snippet "${name}" has successfully been created.`);
  },
};

export default addSnippetCommand;
