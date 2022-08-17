import type { Command } from '../types/command';
import { createSimpleEmbed } from '../utils';

const snippetsCommand: Command = {
  name: 'snippets',
  run: async ({ client, message }) => {
    await message.reply({
      embeds: [
        createSimpleEmbed(
          client.snippets.map((_snippet) => `\`${_snippet.name}\``).join(', ') ||
            'No snippets found.',
          {
            title: 'Available Snippets',
            type: 'info',
          },
        ),
      ],
    });
  },
};

export default snippetsCommand;
