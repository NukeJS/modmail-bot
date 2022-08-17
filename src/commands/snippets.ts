import type { Command } from '../types/command';

const snippetsCommand: Command = {
  name: 'snippets',
  run: async ({ client, message }) => {
    await message.reply({
      embeds: [
        {
          title: 'Available Snippets',
          description:
            client.snippets.map((_snippet) => `\`${_snippet.name}\``).join(', ') ||
            'No snippets found.',
        },
      ],
    });
  },
};

export default snippetsCommand;
